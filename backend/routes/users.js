const { User } = require("../dist/user.entity");
const express = require("express");
const router = express.Router();
const dataSource = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
	registerUser,
	deleteUserByUsername,
	verifyPassword,
	updateUsername,
	updatePassword,
} = require("../helperFiles/userHelper.js");
const { logger } = require("../config/logger");
require("dotenv").config();
const authenticateAdmin = require("../middleware/authenticate.js");

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
router.post("/", async (req, res) => {
	const { userName, password } = req.body;

	// Check if userName or password is null or undefined
	// Should be checking instead if password is not empty
	if (
		!userName ||
		userName.length === 0 ||
		!password ||
		password.length === 0
	) {
		// Use logger.error() for logging errors
		logger.error("Username and password are required");
		return res
			.status(400)
			.json({ message: "Username and password are required" });
	}

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
			const token = jwt.sign({ id: existingUser.id }, JWT_SECRET, {});
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

router.get("/:userId", async (req, res) => {
	const { userId } = req.params;

	try {
		// Initialize data source
		const Users = await dataSource.getRepository(User);
		// Fetch the user by userId
		const user = await Users.findOne({ where: { id: userId } });

		if (!user) {
			logger.error("User not found");
			return res.status(404).json({ message: "User not found" });
		}

		// If user is found, return username and password
		return res.status(200).json({ username: user.userName });
	} catch (error) {
		logger.error("Internal server error:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/;

router.patch("/changeUsername", authenticateAdmin, async (req, res) => {
	// extract JWToken User ID
	const { token } = req.cookies;

	try {
		if (token) {
			jwt.verify(token, JWT_SECRET, {}, (err, user) => {
				if (err) {
					logger.error("Error verifying JWT:", err);
					throw err;
				}
				// Get info
				const userId = user.id;
				const { newUsername, password } = req.body;

				// if password matches, then change username
				if (verifyPassword(userId, password)) {
					if (!updateUsername(userId, newUsername)) {
						// if update failed for whatever reason
						return res.status(500).json({ message: "Username update failed." });
					}
					return res
						.status(200)
						.json({ message: "Username succesfully updated" });
				} else {
					// if password does not match, return error
					return res
						.status(400)
						.json({ message: "Password verification failed" });
				}
			});
		} else {
			logger.info("No token provided");
			return res.json(null);
		}
	} catch (error) {
		logger.error("Caught an error upon changing username:", error);
		return res
			.status(500)
			.json({ message: `Caught an error upon changing username: ${error}` });
	}
});

/**
 * PATCH request to update password:
Endpoint: /:userId/password
Method: PATCH

Parameters:
- userId: The ID of the user whose password is to be updated (extracted from request parameters).
- password: The new password (extracted from request body).

Behavior:
- Fetches the user with the provided userId from the data source.
- Validates the provided password:
  - Checks if the password is provided and meets length requirements (up to 12 characters).
  - Performs additional data validation for password complexity (e.g., minimum length, special characters).
- Hashes the new password using bcrypt for security.
- Updates the password for the user.
- Saves the updated user to the data source.
- Returns a success message along with the updated user in JSON format if successful.
- Handles errors such as user not found, validation errors, and internal server errors.
 */
/*
router.patch("/:userId/password", async (req, res) => {
	const { userId } = req.params;
	const { password } = req.body;

	try {
		// Initialize data source
		const Users = await dataSource.getRepository(User);
		// Fetch the user by userId
		const user = await Users.findOne({ where: { id: userId } });
		if (!user) {
			logger.error("User not found");
			return res.status(404).json({ message: "User not found" });
		}

		// Validate password
		if (!password || password.length == 0) {
			logger.error("Password is required");
			return res.status(400).json({ message: "Password is required" });
		}
		if (password.length > 12) {
			logger.error("Password must be at most 12 characters long");
			return res
				.status(400)
				.json({ message: "Password must be at most 12 characters long" });
		}
		// Perform data validation for password (e.g., minimum length, special characters, etc.)
		// Example: Ensure minimum length of password is 10 characters
		if (!passwordRegex.test(password)) {
			logger.error(
				"Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one digit, and one special character",
			);
			return res.status(400).json({
				message:
					"Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one digit, and one special character",
			});
		}

		// Update password
		user.password = await bcrypt.hash(password, 10); // Hash the new password

		// Save updated user
		await Users.save(user);
		logger.info("Password successfully updated");
		return res
			.status(200)
			.json({ message: "Password successfully updated", user });
	} catch (error) {
		logger.error("Internal server error:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
}); */

router.patch("/changePassword", authenticateAdmin, async (req, res) => {
	// extract JWToken User ID
	const { token } = req.cookies;

	try {
		if (token) {
			jwt.verify(token, JWT_SECRET, {}, (err, user) => {
				if (err) {
					logger.error("Error verifying JWT:", err);
					throw err;
				}
				// Get info
				const userId = user.id;
				const { newPassword } = req.body;

				// if password matches, then change username
				if (verifyPassword(userId, newPassword)) {
					if (!updatePassword(userId, newPassword)) {
						// if update failed for whatever reason
						return res.status(500).json({ message: "Password update failed." });
					}
					return res
						.status(200)
						.json({ message: "Password succesfully updated" });
				} else {
					// if password does not match, return error
					return res
						.status(400)
						.json({ message: "Password verification failed" });
				}
			});
		} else {
			logger.info("No token provided");
			return res.json(null);
		}
	} catch (error) {
		logger.error("Caught an error upon changing password:", error);
		return res
			.status(500)
			.json({ message: `Caught an error upon changing password: ${error}` });
	}
});

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
