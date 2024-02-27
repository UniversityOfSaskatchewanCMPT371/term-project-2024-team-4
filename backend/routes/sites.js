const { Site } = require("../dist/entity");
const express = require("express");
const router = express.Router();
const myDatabase = require("../config/db");

// POST: Create a New Site
router.post("/", async (req, res) => {
	const { name, description, location, catalogueId, regionId } = req.body;
	try {
		const siteRepository = await myDatabase.getRepository(Site);
		const newSite = siteRepository.create({
			name,
			description,
			location,
			catalogue: { id: catalogueId },
			region: { id: regionId },
		});
		await siteRepository.save(newSite);
		res.json(newSite);
	} catch (error) {
		console.error("Error creating new Site:", error);
		res.json({ error: error.message });
	}
});

// GET: Fetch All Sites
router.get("/", async (req, res) => {
	try {
		const siteRepository = await myDatabase.getRepository(Site);
		const sites = await siteRepository.find({
			relations: ["catalogue", "region"],
		});
		res.json(sites);
	} catch (error) {
		console.error("Error fetching Sites:", error);
		res.json({ error: error.message });
	}
});

// GET: Fetch a Site by ID
router.get("/:id", async (req, res) => {
	try {
		const siteRepository = await myDatabase.getRepository(Site);
		const site = await siteRepository.findOne({
			where: { id: parseInt(req.params.id) },
			relations: ["catalogue", "region", "artifacts"],
		});
		if (site) {
			res.json(site);
		} else {
			res.send("Site not found");
		}
	} catch (error) {
		console.error("Error fetching Site:", error);
		res.json({ error: error.message });
	}
});

// PUT: Update an existing Site
router.put("/:id", async (req, res) => {
	const { name, description, location, catalogueId, regionId } = req.body;
	try {
		const siteRepository = await myDatabase.getRepository(Site);
		let siteToUpdate = await siteRepository.findOneBy({
			id: parseInt(req.params.id),
		});
		if (siteToUpdate) {
			siteToUpdate.name = name;
			siteToUpdate.description = description;
			siteToUpdate.location = location;
			siteToUpdate.catalogue = { id: catalogueId };
			siteToUpdate.region = { id: regionId };
			await siteRepository.save(siteToUpdate);
			res.json(siteToUpdate);
		} else {
			res.json({ message: "Site not found" });
		}
	} catch (error) {
		console.error("Error updating Site:", error);
		res.json({ error: error.message });
	}
});

// DELETE: Remove a Site
router.delete("/:id", async (req, res) => {
	try {
		const siteRepository = await myDatabase.getRepository(Site);
		const deleteResult = await siteRepository.delete(parseInt(req.params.id));
		if (deleteResult.affected > 0) {
			res.send();
		} else {
			res.json({ message: "Site not found" });
		}
	} catch (error) {
		console.error("Error deleting Site:", error);
		res.json({ error: error.message });
	}
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
