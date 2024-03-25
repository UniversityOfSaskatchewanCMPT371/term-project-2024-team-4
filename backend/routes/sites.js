const express = require("express");
const router = express.Router();
const sitesHelper = require("../helperFiles/sitesHelper.js");

// POST: Create a New Site
router.post("/", async (req, res) => {
	const newSite = await sitesHelper.newSite(req);
	if (newSite instanceof Error) {
		res.json({ error: newSite.message });
	}
	res.json(newSite);
});

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
		res.json({ error: sites.message });
	}
	res.json(sites);
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
		res.send("Site not found");
	}
	if (site instanceof Error) {
		res.json({ error: site.message });
	}
	res.json(site);
});

/**
 * PUT: Update an existing Site
 * @param {*} req - req URL parameter contains the Site ID, body contains valid 'name', 'description', 'location', 'catalogueId', and 'regionId'
 * @param {*} res - Response to client
 * @precond Request URL parameter and body contain an existing Site ID and valid updates for 'name', 'description', 'location', 'catalogueId', and 'regionId'
 * @postcond
 * 	Success: Returns the updated Site object
 * 	Failure: Returns an error message related to issue
 */
router.put("/:id", async (req, res) => {
	const siteToUpdate = await sitesHelper.updateSite(req);
	if (siteToUpdate === "Site not found") {
		res.json({ message: "Site not found" });
	}
	if (siteToUpdate instanceof Error) {
		res.json({ error: siteToUpdate.message });
	}
	res.json(siteToUpdate);
});

/**
 * DELETE: Delete a SINGLE existing Site by ID
 * @param {*} req - Req URL parameter contains the Site ID
 * @param {*} res - Response to the client
 * @precond Site ID from req URL parameter exists in the database
 * @postcond
 * 	Success: Site is deleted from the database; sends an empty response
 * 	Failure: Returns an error message related to issue
 */
router.delete("/:id", async (req, res) => {
	const result = await sitesHelper.deleteSite(req);
	if (result === "Site not found") {
		res.json({ message: "Site not found" });
	}
	if (result instanceof Error) {
		res.json({ error: result.message });
	}
	res.send();
});

module.exports = router;
