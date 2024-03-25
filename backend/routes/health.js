const express = require("express");
const router = express.Router();
const myDatabase = require("../config/db");
const { logger } = require("../config/logger");

// Health Check Route to check if backend is connected to database
router.get("/health", async (req, res) => {
	try {
		if (!myDatabase.isInitialized) {
			await myDatabase.initialize();
		}
		// Query to make sure database is responding
		await myDatabase.query("SELECT 1");
		return res.status(200).send("OK");
	} catch (error) {
		logger.error("Health check failed:", error);
		return res.status(500).send("Database connection failed");
	}
});

module.exports = router;
