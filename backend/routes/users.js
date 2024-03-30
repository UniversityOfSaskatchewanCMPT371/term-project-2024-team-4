const { User } = require("../dist/user.entity");
const express = require("express");
const router = express.Router();
const dataSource = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
	registerUser,
	deleteUserByUsername,
} = require("../helperFiles/userHelper.js");
const { logger } = require("../config/logger");
require("dotenv").config();
const authenticateAdmin = require("../middleware/authenticate.js");
const {
	validate,
	loginValidationRules,
	registerValidationRules,
} = require("../middleware/sanitize.js");

// JWT Secret is in .env file
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * POST /api/users
 *
 * Purpose: Authenticate a user and generate a JWT token for authentication.
 *
 * Pre-conditions:
 * - Request body must contain 'userName' and 'password' fields.
 * - 'userName' and 'password' fields must not be null or empty.
 *
 * Post-conditions:
 * - If authentication is successful, returns a JWT token and user details with status code 200.
 * - If authentication fails due to invalid credentials, returns a message "Unauthorized" with status code 401.
 * - If an internal server error occurs, returns a message "Internal server error" with status code 500.
 */
router.post("/", loginValidationRules(), validate, async (req, res) => {
	const { userName, password } = req.body;

	const Users = await dataSource.getRepository(User);

	try {
		// Check Base User ENV Credentials
		const defaultUsername = process.env.DEFAULT_USERNAME;
		const defaultPassword = process.env.DEFAULT_PASSWORD;

		// check if default credentials exist
		if (!defaultUsername || !defaultPassword) {
			logger.error("Default user credentials not defined in .env file");
			return res.status(500).json({ message: "Internal server error" });
		}

		// If Base user does not exist, then register them
		if (!(await Users.findOneBy({ userName: defaultUsername }))) {
			await registerUser(defaultUsername, defaultPassword);
			logger.info("Default user did not exist. Recreating...");
		}
		// Check if any user exists in the database with the provided username
		const existingUser = await Users.findOne({ where: { userName } });
		if (existingUser) {
			// If user exists, compare the provided password with the hashed password from the database
			const match = await bcrypt.compare(password, existingUser.password);
			if (!match) {
				return res.status(401).json({ message: "Unauthorized" });
			}
			const token = jwt.sign(
				{ id: existingUser.id, userName: existingUser.userName },
				JWT_SECRET,
				{},
			);
			res.cookie("token", token, {
				secure: true,
				sameSite: "None", // allows cookie to be sent on cross-site requests
			});
			logger.info("User successfully logged in");

			// if in development, respond with token (for tests)
			if (process.env.NODE_ENV === "development") {
				return res.status(200).json({
					token,
					message: "User succesfully logged in",
					user: existingUser,
				});
			} else {
				return res
					.status(200)
					.json({ message: "User successfully logged in", user: existingUser });
			}
		} else {
			logger.error("Unauthorized");
			return res.status(401).json({ message: "Unauthorized" });
		}
	} catch (error) {
		logger.error("Internal server error:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

/**
 * POST /api/users/logout
 *
 * Purpose: Log out a user by clearing the JWT token cookie.
 *
 * @precond A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 *
 * Post-conditions:
 * - Clears the token cookie.
 * - Returns status code 204 on successful logout.
 * - If an internal server error occurs, returns a message "Internal server error" with status code 500.
 */
// POST route for user logout
router.post("/logout", authenticateAdmin, async (req, res) => {
	try {
		// Clear the token cookie
		res.clearCookie("token", {
			secure: true,
			sameSite: "None", // allows cookie to be sent on cross-site requests
		});
		// Log successful logout
		logger.info("User successfully logged out");
		// Send a success response
		res.sendStatus(204);
	} catch (error) {
		// Log any errors that occur during logout
		logger.error("Error during logout:", error);
		// Send an error response
		res.status(500).json({ message: "Internal server error" });
	}
});

/**
 * GET /api/users
 *
 * Purpose: Retrieve user details using a JWT token.
 *
 * @precond A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 *
 * Post-conditions:
 * - If a valid token is provided, returns user details with status code 200.
 * - If no token is provided, returns null with status code 200.
 * - If an error occurs during token verification, returns a message "Internal server error" with status code 500.
 */
// GET route to fetch the single user's details
router.get("/", authenticateAdmin, async (req, res) => {
	const { token } = req.cookies;
	if (token) {
		jwt.verify(token, JWT_SECRET, {}, (err, user) => {
			if (err) {
				logger.error("Error verifying JWT:", err);
				throw err;
			}

			return res.json(user);
		});
	} else {
		logger.info("No token provided");
		return res.json(null);
	}
});

/**
 * PATCH /api/users/:userId
 *
 * Purpose: Update username and/or password of a user.
 *
 * @precond
 * - Request must contain 'userName' and 'password' fields in the body.
 * - 'userId' parameter must be provided.
 * - 'userName' and 'password' fields must not be null or empty.
 * @precond A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 *
 *
 * Post-conditions:
 * - If the user is successfully updated, returns updated user details with status code 200.
 * - If the provided user ID does not exist, returns a message "User not found" with status code 404.
 * - If the provided user ID does not match the user's ID, returns a message "Forbidden" with status code 403.
 * - If the provided username or password does not meet validation criteria, returns a validation message with status code 400.
 * - If an internal server error occurs, returns a message "Internal server error" with status code 500.
 */
// PATCH route for admin to update username and password
router.patch(
	"/:userId",
	authenticateAdmin,
	registerValidationRules(),
	validate,
	async (req, res) => {
		const { userId } = req.params;
		const { userName, password } = req.body;
		// Check if userId is provided
		if (!userId) {
			logger.error("User ID is required");
			return res.status(400).json({ message: "User ID is required" });
		}

		try {
			// Initialize data source
			const Users = await dataSource.getRepository(User);
			// Fetch the user by userId
			const user = await Users.findOne({ where: { id: userId } });
			if (!user) {
				logger.error("User not found");
				return res.status(404).json({ message: "User not found" });
			}

			// Check if the provided userId matches the user's id
			if (parseInt(userId) !== user.id) {
				// Parse userId to integer for comparison
				logger.error("Forbidden");
				return res.status(403).json({ message: "Forbidden" });
			}
			// Update username and/or password
			if (userName) {
				user.userName = userName;
			}
			if (password) {
				user.password = await bcrypt.hash(password, 10); // Hash the new password
			}

			// Save updated user
			await Users.save(user);
			logger.info("User successfully updated");
			return res
				.status(200)
				.json({ message: "User successfully updated", user });
		} catch (error) {
			logger.error("Internal server error:", error);
			return res.status(500).json({ message: "Internal server error" });
		}
	},
);

/**
 * Delete an existing account via given username
 * @precond A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @precond
 * 	- username must be existing in database
 * 	- req param must include username
 * @postcond
 * 	- user with given username is deleted from database
 */
router.delete("/:username", authenticateAdmin, async (req, res) => {
	const { username } = req.params;

	try {
		const wasDeleted = await deleteUserByUsername(username);

		// If delete status is false (not deleted), then return error
		if (!wasDeleted) {
			return res.status(404).json({ message: "User not found" });
		}
		return res.status(200).json({ message: "user succesfully deleted" });
	} catch (error) {
		logger.error("Internal server error:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

module.exports = router;
