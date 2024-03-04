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

// GET: Fetch Sites by Location
router.get("/catalougesite/:location", async (req, res) => {
	const { location } = req.params; // geting the query
	try {
		const siteRepository = await myDatabase.getRepository(Site);
		// get the name of all the sites with location
		const sites = await siteRepository.find({
			where: { location },
			select: ["name"],
		});
		if (sites.length > 0) {
			const siteNames = sites.map((site) => site.name);
			// 200 found the sites with given location
			res.status(200).json(siteNames);
		} else {
			// 404 not found the location and sites
			res.status(404).send("Not available");
		}
	} catch (error) {
		console.error("Error fetching Sites:", error);
		// 500 error while fetching the sites
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
