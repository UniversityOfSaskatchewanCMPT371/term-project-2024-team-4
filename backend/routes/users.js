const { User } = require("../dist/user.entity");
const express = require("express");
const router = express.Router();
const dataSource = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
	registerUser,
	verifyPassword,
	updateUsername,
	updatePassword,
	deleteUserById,
	resetDefaultUserCredentials,
} = require("../helperFiles/userHelper.js");
const { logger } = require("../config/logger");
require("dotenv").config();
const authenticateAdmin = require("../middleware/authenticate.js");
const {
	validate,
	loginValidationRules,
	changeUsernameValidationRules,
	changePasswordValidationRules,
} = require("../middleware/sanitize.js");

// JWT Secret is in .env file
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * POST API for User Login
 * Handles user login: verifies user credentials and signs a JWToken
 * Ensures there is always a base user in the system
 *
 * @precond
 * 	- req.body must contain: username and password
 * 	- Default user credentials must be defined in .ENV file
 * @postcond
 * 	- Correct credentials: 200 OK Response-- signs a JWToken and signs in
 * 	- Incorrect Credentials: 401 Unauthorize Response-- denied access
 */

router.post("/", loginValidationRules(), validate, async (req, res) => {
	const { userName, password } = req.body;
	const Users = await dataSource.getRepository(User);

	try {
		/* ----------- NOTE: THIS PART CREATES A BASE USER UPON LOGIN TO MAKE SURE THERE IS ALWAYS A BASE USER IN THE SYSTEM ------------- */
		// Check Base User ENV Credentials
		const defaultUsername = process.env.DEFAULT_USERNAME;
		const defaultPassword = process.env.DEFAULT_PASSWORD;

		// check if default credentials exist
		if (!defaultUsername || !defaultPassword) {
			logger.error("Default user credentials not defined in .env file");
			return res.status(500).json({ message: "Internal server error" });
		}

		// if base user
		const defaultUserExists = await Users.findOne({
			where: { isDefaultUser: true },
		});

		if (!defaultUserExists) {
			await registerUser(defaultUsername, defaultPassword);
			logger.info("Default user did not exist. Recreating...");
		}

		/* ------------------------------------------------------------------------------------------------------------------------------ */

		// Continue with login process:
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
 * POST API for User Log out
 * Handles user logout: clears the JWToken cookie
 *
 * @precond
 * 	- User must be logged in (has valid JWtoken)
 *
 * @postcond
 * 	Successful Logout: 204 No Content-- Clears JWToken cookie and logs out
 * 	Failure: 500 Internal Server Error-- error occurred in the server
 */
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
 * GET API for single user authentication
 * Verifies if the incoming request has a valid user token and returns it in dev environments
 *
 * @precond
 * 	- User must be logged in (has valid JWToken)
 * @postcond
 * 	Success: Responds with user details (development) or a generic message (production)
 * 	Failure: 401 Unauthorized Access-- incoming request was not succesfully validated (invalid user)
 */
router.get("/", authenticateAdmin, async (req, res) => {
	// check if request (token) has user
	if (req.user) {
		// send back shallow user data
		return res.json(req.user);
	} else {
		// fallback if req.user does not exist
		logger.warn("No token provided or token is invalid");
		return res.status(401).json({ message: "Unauthorized access" });
	}
});

/**
 * GET API for retrieving all users
 * Fetches a list of ALL users in the system and: [id, username, role]
 * NOTE: Only works for intended app (small amount of users); if > 100, should update function
 * @precond
 * 	- User must be logged in (has valid JWToken)
 * @postcond
 * 	- Success: 200 OK-- gets all users id, role, and usernames
 * 	- Failure: 500 Internal Server Error-- something went wrong in the server
 */
router.get("/allUsers", authenticateAdmin, async (req, res) => {
	try {
		const Users = await dataSource.getRepository(User);
		const users = await Users.find({
			select: ["id", "userName", "role", "isDefaultUser", "isActive"],
		});

		res.status(200).json(users);
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});
/**
 * PATCH API for changing usernames
 * Allows authenticated admin users to change their username
 *
 * @precond
 * 	- User must be logged in (has valid JWToken)
 * 	- req.body must contain: newUsername & password
 * @postcond
 * 	- Success: 200 OK-- Username updated, but password & id stays the same
 * 	- Failure (server): 500 Internal Server Error-- problem with server
 * 	- Failure (client): 400 Bad Request-- password verification failed
 */
router.patch(
	"/changeUsername",
	authenticateAdmin,
	changeUsernameValidationRules(),
	validate,
	async (req, res) => {
		// fallback if req.user does not exist
		if (!req.user) {
			logger.warn(
				"Authentication middleware did not respond with user content from the JWToken",
			);
			return res.status(401).json({ message: "Unauthorized access" });
		}

		try {
			// Gather info
			const userId = req.user.id;
			const { newUsername, password } = req.body;

			/// if password matches, change username
			const passwordMatches = await verifyPassword(userId, password);
			if (passwordMatches) {
				const usernameUpdated = await updateUsername(userId, newUsername);
				if (!usernameUpdated) {
					// if update failed for whatever reason
					logger.error("Update username failed midway");
					return res.status(500).json({ message: "Username update failed." });
				}
				logger.info(`Username succesfully updated for user ${userId}`);
				return res
					.status(200)
					.json({ message: "Username succesfully updated" });
			}
			// if password does not match
			else {
				return res
					.status(400)
					.json({ message: "Password verification failed" });
			}
		} catch (error) {
			logger.error("Caught an error upon changing username:", error);
			return res
				.status(500)
				.json({ message: "Internal server error upon changing username" });
		}
	},
);

/**
 * PATCH API for changing passwords
 * Allows authenticated admin users to change their password
 *
 * @precond
 * 	- User must be logged in (has valid JWToken)
 * 	- req.body must contain: oldPassword & newPassword
 *
 * @postcond
 * 	- Success: 200 OK-- Password updated, but username & id stays the same
 * 	- Failure (server): 500 Internal Server Error-- problem with server
 * 	- Failure (client): 400 Bad Request-- password verification failed
 */
router.patch(
	"/changePassword",
	authenticateAdmin,
	changePasswordValidationRules(),
	validate,
	async (req, res) => {
		// fallback if req.user does not exist
		if (!req.user) {
			logger.warn(
				"Authentication middleware did not respond with user content from the JWToken",
			);
			return res.status(401).json({ message: "Unauthorized access" });
		}

		try {
			// Gather info
			const userId = req.user.id;
			const { oldPassword, newPassword } = req.body;

			// if old password passes verification, then replace with new password
			const passwordMatches = await verifyPassword(userId, oldPassword);
			if (passwordMatches) {
				const passwordUpdated = await updatePassword(userId, newPassword);
				if (!passwordUpdated) {
					// if update failed for whatever reason
					logger.error("Password update failed.");
					return res.status(500).json({ message: "Password update failed." });
				}
				logger.info(`Password successfully updated for user ${userId}`);
				return res
					.status(200)
					.json({ message: "Password successfully updated" });
			} else {
				// if password does not match, return error
				return res
					.status(400)
					.json({ message: "Password verification failed" });
			}
		} catch (error) {
			logger.error("Caught an error upon changing password:", error);
			return res
				.status(500)
				.json({ message: "Internal server error upon changing password" });
		}
	},
);

/**
 * PATCH API for resetting the default user's credentials
 * NOTE: this ONLY changes the DEFAULT USER; CAN BE ACCESSED BY ANY USER
 * IF MULTIPLE CONCURRENT USERS ARE ADDED, THIS NEEDS TO BE MODIFIED
 */
router.patch("/resetDefaultUser", authenticateAdmin, async (req, res) => {
	// fallback if req.user does not exist
	if (!req.user) {
		logger.warn(
			"Authentication middleware did not respond with user content from the JWToken",
		);
		return res.status(401).json({ message: "Unauthorized access" });
	}

	try {
		const wasReset = await resetDefaultUserCredentials();
		if (wasReset) {
			// should be logged by the helper function
			return res
				.status(200)
				.json({ message: "Default User credentials was succesfully updated" });
		} else {
			// should be logged by the helper function
			return res
				.status(500)
				.json({ message: "Server failed to reset default user credentials" });
		}
	} catch (error) {
		logger.error(
			"Caught an error upon trying to reset user credentials: ",
			error,
		);
		return res.status(500).json({
			message:
				"Internal server error upon trying to reset default user credentials",
		});
	}
});

/**
 * Delete an existing account via user id
 * @precond
 * 	- id must be an existing user in the database
 * 	- user must be signed in (valid JWToken)
 * @postcond
 * 	- user with given id is deleted from database
 */
router.delete("/deleteUser", authenticateAdmin, async (req, res) => {
	if (!req.user) {
		logger.warn(
			"Authentication middleware did not respond with user content from the JWToken",
		);
		return res.status(401).json({ message: "Unauthorized access" });
	}

	try {
		const userId = req.user.id;
		const wasDeleted = await deleteUserById(userId);

		// If delete status is false (not deleted), then return error
		if (!wasDeleted) {
			return res.status(404).json({ message: "User not found" });
		}
		return res.status(200).json({ message: "User succesfully deleted" });
	} catch (error) {
		logger.error("Internal server error:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

module.exports = router;
