const { User } = require("../dist/user.entity");
const express = require("express");
const router = express.Router();
const dataSource = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const registerUser = require("../helpers/register");
const crypto = require("crypto");
const { logger } = require("../config/logger");

// Function to generate a secure random string
function generateJWTSecret(length = 64) {
	return crypto.randomBytes(length).toString("hex");
}

// Generate a JWT secret
const JWT_SECRET = generateJWTSecret();

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
		if (!(await Users.findOne({ where: { id: 1 } }))) {
			// If user with id 1 does not exist, register a new user
			await registerUser();
		}
		// Check if any user exists in the database with the provided username
		const existingUser = await Users.findOne({ where: { userName } });
		if (existingUser) {
			logger.error("Unauthorized");
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
			res.cookie("token", token);
			logger.info("User successfully logged in");
			return res
				.status(200)
				.json({ message: "User successfully logged in", user: existingUser });
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
 * Pre-conditions: None
 *
 * Post-conditions:
 * - Clears the token cookie.
 * - Returns status code 204 on successful logout.
 * - If an internal server error occurs, returns a message "Internal server error" with status code 500.
 */
// POST route for user logout
router.post("/logout", async (req, res) => {
	try {
		// Clear the token cookie
		res.clearCookie("token");
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
 * Pre-conditions:
 * - Request must contain a valid JWT token in the cookie named 'token'.
 *
 * Post-conditions:
 * - If a valid token is provided, returns user details with status code 200.
 * - If no token is provided, returns null with status code 200.
 * - If an error occurs during token verification, returns a message "Internal server error" with status code 500.
 */
// GET route to fetch the single user's details
router.get("/", async (req, res) => {
	const { token } = req.cookies;
	if (token) {
		jwt.verify(token, JWT_SECRET, {}, (err, user) => {
			if (err) {
				logger.error("Error verifying JWT:", err);
				throw err;
			}

			res.json(user);
		});
	} else {
		logger.info("No token provided");
		res.json(null);
	}
});

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/;

/**
 * PATCH /api/users/:userId
 *
 * Purpose: Update username and/or password of a user.
 *
 * Pre-conditions:
 * - Request must contain 'userName' and 'password' fields in the body.
 * - 'userId' parameter must be provided.
 * - 'userName' and 'password' fields must not be null or empty.
 *
 * Post-conditions:
 * - If the user is successfully updated, returns updated user details with status code 200.
 * - If the provided user ID does not exist, returns a message "User not found" with status code 404.
 * - If the provided user ID does not match the user's ID, returns a message "Forbidden" with status code 403.
 * - If the provided username or password does not meet validation criteria, returns a validation message with status code 400.
 * - If an internal server error occurs, returns a message "Internal server error" with status code 500.
 */
// PATCH route for admin to update username and password
router.patch("/:userId", async (req, res) => {
	const { userId } = req.params;
	const { userName, password } = req.body;
	// Check if userId is provided
	if (!userId) {
		logger.error("User ID is required");
		return res.status(400).json({ message: "User ID is required" });
	}
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

		// Validate username
		if (userName) {
			// Perform data validation for username (e.g., minimum length, special characters, etc.)
			// Example: Ensure minimum length of username is 5 characters
			if (userName.length < 5) {
				logger.error("Username must be at least 5 characters long");
				return res
					.status(400)
					.json({ message: "Username must be at least 5 characters long" });
			}
			// Add more validation rules for username if needed
		}

		// Validate password
		if (password) {
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
			// Add more validation rules for password if needed
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
		res.status(200).json({ message: "User successfully updated", user });
	} catch (error) {
		logger.error("Internal server error:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

module.exports = router;
