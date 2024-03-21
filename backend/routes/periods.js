const express = require("express");
const router = express.Router();
const periodsHelper = require("../helperFiles/periodsHelper.js");

// POST: Create a New Period
router.post("/", async (req, res) => {
	const response = await periodsHelper.newPeriod(req);
	if (response instanceof Error) {
		res.json({ error: response.message });
	}
	res.json(response);
});

// GET: Fetch all Periods
router.get("/", async (req, res) => {
	const response = await periodsHelper.getAllPeriods();
	if (response instanceof Error) {
		res.json({ error: response.message });
	}
	res.json(response);
});

// GET: Fetch a Period by ID
router.get("/:id", async (req, res) => {
	const response = await periodsHelper.getPeriodById(req);
	if (response === "Period not found") {
		res.json({ message: "Period not found" });
	}
	if (response instanceof Error) {
		res.json({ error: response.message });
	}
	res.json(response);
});

// PUT: Update an existing Period
router.put("/:id", async (req, res) => {
	const response = await periodsHelper.updatePeriod(req);
	if (response === "Period not found") {
		res.json({ message: "Period not found" });
	}
	if (response instanceof Error) {
		res.json({ error: response.message });
	}
	res.json(response);
});

// DELETE: Delete an existing Period
router.delete("/:id", async (req, res) => {
	const response = await periodsHelper.updatePeriod(req);
	if (response === "Period not found") {
		res.json({ message: "Period not found" });
	}
	if (response instanceof Error) {
		res.json({ error: response.message });
	}
	res.send();
});

module.exports = router;
