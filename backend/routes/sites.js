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

// GET: Fetch All Sites
router.get("/", async (req, res) => {
	const sites = await sitesHelper.getAllSites();
	if (sites instanceof Error) {
		res.json({ error: sites.message });
	}
	res.json(sites);
});

// GET: Fetch a Site by ID
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

// PUT: Update an existing Site
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

// DELETE: Remove a Site
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
