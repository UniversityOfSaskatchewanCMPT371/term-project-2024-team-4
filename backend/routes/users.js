const { User } = require("../dist/user.entity");
const express = require("express");
const router = express.Router();
const dataSource = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const registerUser = require("../helpers/register");
const crypto = require("crypto");

// Function to generate a secure random string
function generateJWTSecret(length = 64) {
	return crypto.randomBytes(length).toString("hex");
}

// Generate a JWT secret
const JWT_SECRET = generateJWTSecret();

router.post("/", async (req, res) => {
	const { userName, password } = req.body;

	// Check if userName or password is null or undefined
	if (!userName || !password) {
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
			return res
				.status(200)
				.json({ message: "User successfully logged in", user: existingUser });
		} else {
			return res.status(401).json({ message: "Unauthorized" });
		}
	} catch (error) {
		console.error("Error creating user:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

router.post("/logout", async (req, res) => {
	// Clear the token cookie
	res.clearCookie("token");
	// Send a success response
	res.sendStatus(204);
});

// GET route to fetch the single user's details
router.get("/", async (req, res) => {
	const { token } = req.cookies;
	if (token) {
		jwt.verify(token, JWT_SECRET, {}, (err, user) => {
			if (err) throw err;

			res.json(user);
		});
	} else {
		res.json(null);
	}
});

// PATCH route for admin to update username and password
router.patch("/:userId", async (req, res) => {
	const { userId } = req.params;
	const { userName, password } = req.body;
	// Check if userId is provided
	if (!userId) {
		return res.status(400).json({ message: "User ID is required" });
	}

	try {
		// Initialize data source
		const Users = await dataSource.getRepository(User);
		// Fetch the user by userId
		const user = await Users.findOne({ where: { id: userId } });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Check if the provided userId matches the user's id
		if (parseInt(userId) !== user.id) {
			// Parse userId to integer for comparison
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
		res.status(200).json({ message: "User successfully updated", user });
	} catch (error) {
		console.error("Error updating user:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

module.exports = router;
