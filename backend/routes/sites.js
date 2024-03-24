const { Site } = require("../dist/entity");
const express = require("express");
const router = express.Router();
const myDatabase = require("../config/db");
const { logger } = require("../config/logger");

/**
 * POST: Create a new Site
 * @param {*} req - Request body must contain valid 'name', 'description', 'location', 'catalogueId', and 'regionId'
 * @param {*} res - Response to client
 * @precond req.body contains 'name', 'description', 'location', 'catalogueId', and 'regionId'
 * @postcond
 * 	Success: Returns the newly created Site object
 * 	Failure: Returns an error message related to issue
 */
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
		logger.debug(`New site created: ${newSite.id}`);
		res.json(newSite);
	} catch (error) {
		logger.error(`Error creating new Site: ${error.message}`);
		res.json({ error: error.message });
	}
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
	try {
		const siteRepository = await myDatabase.getRepository(Site);
		const sites = await siteRepository.find({
			relations: ["catalogue", "region"],
		});
		res.json(sites);
	} catch (error) {
		logger.error("Error fetching Sites:", error);
		res.json({ error: error.message });
	}
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
		logger.error("Error fetching Site:", error);
		res.json({ error: error.message });
	}
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
		logger.error("Error updating Site:", error);
		res.json({ error: error.message });
	}
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
	try {
		const siteRepository = await myDatabase.getRepository(Site);
		const deleteResult = await siteRepository.delete(parseInt(req.params.id));
		if (deleteResult.affected > 0) {
			res.send();
		} else {
			logger.warn(`Site not found for deletion: ${parseInt(req.params.id)}`);
			res.json({ message: "Site not found" });
		}
	} catch (error) {
		logger.error(
			`Error deleting Site: ${parseInt(req.params.id)}, Error: ${error.message}`,
		);
		res.json({ error: error.message });
	}
});

module.exports = router;
