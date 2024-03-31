const express = require("express");
const router = express.Router();
const regionsHelper = require("../helperFiles/regionsHelper.js");
const authenticateAdmin = require("../middleware/authenticate.js");
const {
	validate,
	nameDescValidationRules,
} = require("../middleware/sanitize.js");

/**
 * GET: Fetch ALL Regions
 * @param {*} req - unused
 * @param {*} res - Response object to send back data to the client
 * @precond Database is accessible
 * @postcond
 * 	Success: Returns all Region entities from the database
 * 	Failure: Returns an error message related to issue
 */
router.get("/", async (req, res) => {
	const response = await regionsHelper.getAllRegions();
	if (response instanceof Error) {
		return res.json({ error: response.message });
	}
	return res.json(response);
});

/**
 * POST: Create a new Region
 * @param {*} req - req body must contain valid 'name' and 'description'
 * @param {*} res - Response to client
 * @precond req.body contains 'name' and 'description'
 * @precond A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @postcond
 * 	Success: Returns the newly created Region object
 * 	Failure: Returns an error message indicating the failure reason
 */
router.post(
	"/",
	authenticateAdmin,
	nameDescValidationRules(),
	validate,
	async (req, res) => {
		const response = await regionsHelper.newRegion(req);
		if (response instanceof Error) {
			return res.json({ error: response.message });
		}
		return res.json(response);
	},
);

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
		return res.json({ message: "Region not found" });
	}
	if (response instanceof Error) {
		return res.json({ error: response.message });
	}
	return res.json(response);
});

/**
 * PUT: Update an existing Region
 * @param {*} req - req URL parameter contains the Region ID, body contains 'name' and 'description'
 * @param {*} res - Response to client
 * @precond Request URL parameter and body contain an existing Region ID and valid 'name' and 'description'
 * @precond A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @postcond
 * 	Success: Returns the updated Region object
 * 	Failure: Returns an error related to issue
 */
router.put(
	"/:id",
	authenticateAdmin,
	nameDescValidationRules(),
	validate,
	async (req, res) => {
		const response = await regionsHelper.updateRegion(req);
		if (response === "Region not found") {
			return res.json({ message: "Region not found" });
		}
		if (response instanceof Error) {
			return res.json({ error: response.message });
		}
		return res.json(response);
	},
);

/**
 * DELETE: Delete a SINGLE existing Region by ID
 * @param {*} req - req URL parameter contains the Region ID
 * @param {*} res - Response to the client
 * @precond Region ID from req URL parameter exists in the database
 * @precond A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @postcond
 * 	Success: Region is deleted from the database; sends an empty response
 * 	Failure: Returns an error message indicating the failure reason
 */
router.delete("/:id", authenticateAdmin, async (req, res) => {
	const response = await regionsHelper.deleteRegion(req);
	if (response === "Region not found") {
		return res.json({ message: "Region not found" });
	}
	if (response instanceof Error) {
		return res.json({ error: response.message });
	}
	return res.send();
});

module.exports = router;
