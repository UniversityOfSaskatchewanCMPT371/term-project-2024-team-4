const { Region } = require("../dist/entity");
const express = require("express");
const router = express.Router();
const myDatabase = require("../config/db");
const { logger } = require("../config/logger");

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
	try {
		const regionRepository = await myDatabase.getRepository(Region);
		const regions = await regionRepository.find();
		res.json(regions);
	} catch (error) {
		logger.error("Error fetching Regions:", error);
		res.json({ error: error.message });
	}
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
	const { name, description } = req.body;
	try {
		const regionRepository = await myDatabase.getRepository(Region);
		const newRegion = regionRepository.create({ name, description });
		await regionRepository.save(newRegion);
		res.json(newRegion);
	} catch (error) {
		logger.error("Error creating new Region:", error);
		res.json({ error: error.message });
	}
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
	try {
		const regionRepository = await myDatabase.getRepository(Region);
		const region = await regionRepository.findOne({
			where: { id: parseInt(req.params.id) },
			relations: ["sites"],
		});

		if (region) {
			res.json(region);
		} else {
			logger.warn(
				`Region to fetch was not found, ID: ${parseInt(req.params.id)}`,
			);
			res.send("Region not found");
		}
	} catch (error) {
		logger.error("Error fetching Region:", error);
		res.json({ error: error.message });
	}
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
	const { id } = req.params;
	const { name, description } = req.body;
	try {
		const regionRepository = await myDatabase.getRepository(Region);
		let RegionToUpdate = await regionRepository.findOneBy({
			id: parseInt(id),
		});
		if (RegionToUpdate) {
			RegionToUpdate.name = name;
			RegionToUpdate.description = description;
			await regionRepository.save(RegionToUpdate);
			res.json(RegionToUpdate);
		} else {
			res.json({ message: "Region not found" });
		}
	} catch (error) {
		logger.error("Error updating Region:", error);
		res.json({ error: error.message });
	}
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
	const id = parseInt(req.params.id);
	try {
		const regionRepository = await myDatabase.getRepository(Region);
		const deleteResult = await regionRepository.delete(id);
		if (deleteResult.affected > 0) {
			res.send();
		} else {
			logger.warn(`Region to delete was not found, ID: ${id}`);
			res.json({ message: "Region not found" });
		}
	} catch (error) {
		logger.error("Error deleting Region:", error);
		res.json({ error: error.message });
	}
});

module.exports = router;
