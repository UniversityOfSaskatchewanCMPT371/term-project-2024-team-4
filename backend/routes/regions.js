const express = require("express");
const router = express.Router();
const regionsHelper = require("../helperFiles/regionsHelper.js");

// GET: Fetch all Regions
router.get("/", async (req, res) => {
	const response = await regionsHelper.getAllRegions();
	if (response instanceof Error) {
		res.json({ error: response.message });
	}
	res.json(response);
});

// POST: Create a new Region
router.post("/", async (req, res) => {
	const response = await regionsHelper.getAllRegions();
	if (response instanceof Error) {
		res.json({ error: response.message });
	}
	res.json(response);
});

// GET: Fetch a Region by ID
// GET: Fetch a Region by ID
router.get("/:id", async (req, res) => {
	const response = await regionsHelper.getAllRegions();
	if (response === "Region not found") {
		res.json({ message: "Region not found" });
	}
	if (response instanceof Error) {
		res.json({ error: response.message });
	}
	res.json(response);
});

// PUT: Update an existing Region
router.put("/:id", async (req, res) => {
	const response = await regionsHelper.getAllRegions();
	if (response === "Region not found") {
		res.json({ message: "Region not found" });
	}
	if (response instanceof Error) {
		res.json({ error: response.message });
	}
	res.json(response);
});

// DELETE: Remove a Region
router.delete("/:id", async (req, res) => {
	const response = await regionsHelper.getAllRegions();
	if (response === "Region not found") {
		res.json({ message: "Region not found" });
	}
	if (response instanceof Error) {
		res.json({ error: response.message });
	}
	res.send();
});

module.exports = router;
