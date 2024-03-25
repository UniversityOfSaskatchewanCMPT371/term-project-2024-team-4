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

/**
 * POST: Create a new Region
 * @param {*} req - req body must contain valid 'name' and 'description'
 * @param {*} res - Response to client
 * @precond req.body contains 'name' and 'description'
 * @postcond
 * 	Success: Returns the newly created Region object
 * 	Failure: Returns an error message indicating the failure reason
 */
router.post("/", async (req, res) => {
	const response = await regionsHelper.newRegion(req);
	if (response instanceof Error) {
		res.json({ error: response.message });
	}
	res.json(response);
});

/**
 * GET: Fetch a SINGLE Region by ID
 * @param {*} req - Request URL parameter contains the Region ID
 * @param {*} res - Response to client
 * @precond Request URL parameter contains a valid Region ID that exists in the database
 * @postcond
 * 	Success: Returns the SINGLE requested Region object
 * 	Failure: Returns an error message indicating the failure reason
 */
router.get("/:id", async (req, res) => {
	const response = await regionsHelper.getRegionById(req);
	if (response === "Region not found") {
		res.json({ message: "Region not found" });
	}
	if (response instanceof Error) {
		res.json({ error: response.message });
	}
	res.json(response);
});

/**
 * PUT: Update an existing Region
 * @param {*} req - req URL parameter contains the Region ID, body contains 'name' and 'description'
 * @param {*} res - Response to client
 * @precond Request URL parameter and body contain an existing Region ID and valid 'name' and 'description'
 * @postcond
 * 	Success: Returns the updated Region object
 * 	Failure: Returns an error related to issue
 */
router.put("/:id", async (req, res) => {
	const response = await regionsHelper.updateRegion(req);
	if (response === "Region not found") {
		res.json({ message: "Region not found" });
	}
	if (response instanceof Error) {
		res.json({ error: response.message });
	}
	res.json(response);
});

/**
 * DELETE: Delete a SINGLE existing Region by ID
 * @param {*} req - req URL parameter contains the Region ID
 * @param {*} res - Response to the client
 * @precond Region ID from req URL parameter exists in the database
 * @postcond
 * 	Success: Region is deleted from the database; sends an empty response
 * 	Failure: Returns an error message indicating the failure reason
 */
router.delete("/:id", async (req, res) => {
	const response = await regionsHelper.deleteRegion(req);
	if (response === "Region not found") {
		res.json({ message: "Region not found" });
	}
	if (response instanceof Error) {
		res.json({ error: response.message });
	}
	res.send();
});

module.exports = router;
