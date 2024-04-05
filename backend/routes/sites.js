const express = require("express");
const router = express.Router();
const sitesHelper = require("../helperFiles/sitesHelper.js");
const authenticateAdmin = require("../middleware/authenticate.js");
const { validate, siteValidationRules } = require("../middleware/sanitize.js");

/**
 * POST: Create a new Site
 * @param {*} req - Request body must contain valid 'name', 'description', 'location', 'catalogueId', and 'regionId'
 * @param {*} res - Response to client
 * @precond req.body contains 'name', 'description', 'location', 'catalogueId', and 'regionId'
 * @precond A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @postcond
 * 	Success: Returns the newly created Site object
 * 	Failure: Returns an error message related to issue
 */
router.post(
	"/",
	authenticateAdmin,
	siteValidationRules(),
	validate,
	async (req, res) => {
		const newSite = await sitesHelper.newSite(req);
		if (newSite instanceof Error) {
			return res.json({ error: newSite.message });
		}
		return res.json(newSite);
	},
);

/**
 * GET: Fetch ALL Sites
 * @param {*} req - unused
 * @param {*} res - Response object to send back data to the client
 * @precond Database is accessible
 * @postcond
 * 	Success: Returns ALL Site entities from the database
 * 	Failure: Returns an error message indicating the failure reason
 */
router.get("/", async (req, res) => {
	const sites = await sitesHelper.getAllSites();
	if (sites instanceof Error) {
		return res.json({ error: sites.message });
	}
	return res.json(sites);
});

/**
 * GET: Fetch a SINGLE Site by ID
 * @param {*} req - req URL parameter contains the Site ID
 * @param {*} res - Response to client
 * @precond Request URL parameter contains a valid Site ID that exists in the database
 * @postcond
 * 	Success: Returns the SINGLE requested Site object including its relations to 'catalogue', 'region', and 'artifacts'
 * 	Failure: Returns an error message indicating the failure reason
 */
router.get("/:id", async (req, res) => {
	const site = await sitesHelper.getSiteFromId(req);
	if (site === "Site not found") {
		return res.send("Site not found");
	}
	if (site instanceof Error) {
		return res.json({ error: site.message });
	}
	return res.json(site);
});

/**
 * PUT: Update an existing Site
 * @param {*} req - req URL parameter contains the Site ID, body contains valid 'name', 'description', 'location', 'catalogueId', and 'regionId'
 * @param {*} res - Response to client
 * @precond Request URL parameter and body contain an existing Site ID and valid updates for 'name', 'description', 'location', 'catalogueId', and 'regionId'
 * @precond A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @postcond
 * 	Success: Returns the updated Site object
 * 	Failure: Returns an error message related to issue
 */
router.put(
	"/:id",
	authenticateAdmin,
	siteValidationRules(),
	validate,
	async (req, res) => {
		const siteToUpdate = await sitesHelper.updateSite(req);
		if (siteToUpdate === "Site not found") {
			return res.json({ message: "Site not found" });
		}
		if (siteToUpdate instanceof Error) {
			return res.json({ error: siteToUpdate.message });
		}
		return res.json(siteToUpdate);
	},
);

/**
 * DELETE: Delete a SINGLE existing Site by ID
 * @param {*} req - Req URL parameter contains the Site ID
 * @param {*} res - Response to the client
 * @precond Site ID from req URL parameter exists in the database
 * @precond A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @postcond
 * 	Success: Site is deleted from the database; sends an empty response
 * 	Failure: Returns an error message related to issue
 */
router.delete("/:id", authenticateAdmin, async (req, res) => {
	const result = await sitesHelper.deleteSite(req);
	if (result === "Site not found") {
		return res.json({ message: "Site not found" });
	}
	if (result instanceof Error) {
		return res.json({ error: result.message });
	}
	return res.send();
});

module.exports = router;
