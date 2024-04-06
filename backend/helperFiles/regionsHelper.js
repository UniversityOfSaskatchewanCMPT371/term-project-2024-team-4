const { Region } = require("../dist/entity");
const myDatabase = require("../config/db");

/**
 *
 */
async function getAllRegions() {
	try {
		const regionRepository = await myDatabase.getRepository(Region);
		const regions = await regionRepository.find();
		// res.json(regions);
		return regions;
	} catch (error) {
		console.error("Error fetching Regions:", error);
		return error;
		// res.json({ error: error.message });
	}
}

/**
 * POST: Create a new Region
 * @param {*} req - req body must contain valid 'name' and 'description'
 * @precond req.body contains 'name' and 'description'
 * @postcond
 * 	Success: Returns the newly created Region object
 * 	Failure: Returns an error message indicating the failure reason
 */
async function newRegion(req) {
	const { name, description } = req.body;
	try {
		const regionRepository = await myDatabase.getRepository(Region);
		const newRegion = regionRepository.create({ name, description });
		await regionRepository.save(newRegion);
		// res.json(newRegion);
		return newRegion;
	} catch (error) {
		console.error("Error creating new Region:", error);
		return error;
		// res.json({ error: error.message });
	}
}

/**
 * GET: Fetch a SINGLE Region by ID
 * @param {*} req - Request URL parameter contains the Region ID
 * @precond Request URL parameter contains a valid Region ID that exists in the database
 * @postcond
 * 	Success: Returns the SINGLE requested Region object
 * 	Failure: Returns an error message indicating the failure reason
 */
async function getRegionById(req) {
	try {
		const regionRepository = await myDatabase.getRepository(Region);
		const region = await regionRepository.findOne({
			where: { id: parseInt(req.params.id) },
			relations: ["sites"],
		});

		if (region) {
			// res.json(region);
			return region;
		} else {
			return "Region not found";
			// res.send("Region not found");
		}
	} catch (error) {
		console.error("Error fetching Region:", error);
		return error;
		// res.json({ error: error.message });
	}
}

/**
 * PUT: Update an existing Region
 * @param {*} req - req URL parameter contains the Region ID, body contains 'name' and 'description'
 * @precond Request URL parameter and body contain an existing Region ID and valid 'name' and 'description'
 * @postcond
 * 	Success: Returns the updated Region object
 * 	Failure: Returns an error related to issue
 */
async function updateRegion(req) {
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
			// res.json(RegionToUpdate);
			return RegionToUpdate;
		} else {
			return "Region not found";
			// res.json({ message: "Region not found" });
		}
	} catch (error) {
		console.error("Error updating Region:", error);
		return error;
		// res.json({ error: error.message });
	}
}

/**
 * DELETE: Delete a SINGLE existing Region by ID
 * @param {*} req - req URL parameter contains the Region ID
 * @precond Region ID from req URL parameter exists in the database
 * @postcond
 * 	Success: Region is deleted from the database; sends an empty response
 * 	Failure: Returns an error message indicating the failure reason
 */
async function deleteRegion(req) {
	const id = parseInt(req.params.id);
	try {
		const regionRepository = await myDatabase.getRepository(Region);
		const deleteResult = await regionRepository.delete(id);
		if (deleteResult.affected > 0) {
			// res.send();
			return;
		} else {
			return "Region not found";
			// res.json({ message: "Region not found" });
		}
	} catch (error) {
		console.error("Error deleting Region:", error);
		return error;
		// res.json({ error: error.message });
	}
}

module.exports = {
	getAllRegions,
	newRegion,
	getRegionById,
	updateRegion,
	deleteRegion,
};
