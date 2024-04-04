const { Catalogue } = require("../dist/entity");
const myDatabase = require("../config/db");
const assert = require("node:assert/strict");
const { logger } = require("../config/logger.js");

/**
 * @pre None.
 * @post Retrieves all catalogues from the database.
 * @return Returns an array of Catalogue objects.
 */
async function getAllCatalogues() {
	try {
		const catalogueRepository = await myDatabase.getRepository(Catalogue);
		const catalogues = await catalogueRepository.find();
		assert(catalogues.length > 0, "No catalogues found.");
		// res.json(catalogues);
		logger.info("Fetched all catalogues.");
		return catalogues;
	} catch (error) {
		logger.error(`Error fetching catalogues: ${error.message}`);
		return error;
		// res.status(500).json({ error: error.message });
	}
}

/**
 * POST: Create a new catalogue.
 * @param req Express request object, expecting 'name' and 'description' in the request body.
 * @pre The request body must contain both 'name' and 'description' fields.
 * @post A new Catalogue is created and saved in the database.
 * @return Returns the newly created Catalogue object.
 */
async function newCatalogue(req) {
	const { name, description } = req.body;
	try {
		assert(name && description, "Both name and description are required.");
		const catalogueRepository = await myDatabase.getRepository(Catalogue);
		const newCatalogue = catalogueRepository.create({ name, description });
		await catalogueRepository.save(newCatalogue);
		// res.json(newCatalogue);
		logger.info(`New catalogue created: ${name}`);
		return newCatalogue;
	} catch (error) {
		logger.error(`Error creating new catalogue: ${error.message}`);
		return error;
		// res
		// 	.status(error instanceof assert.AssertionError ? 400 : 500)
		// 	.json({ error: error.message });
	}
}

/**
 * GET: Fetch a catalogue by ID.
 * @param req Express request object, expecting 'id' as a route parameter.
 * @pre The Catalogue with the provided ID must exist in the database.
 * @post Retrieves a specific Catalogue from the database based on its ID.
 * @return Returns a Catalogue object or a message indicating the Catalogue was not found.
 */
async function getCatalogueFromId(req) {
	try {
		const id = parseInt(req.params.id);
		assert(!isNaN(id), "Invalid ID provided");
		const catalogueRepository = await myDatabase.getRepository(Catalogue);
		const catalogue = await catalogueRepository.findOne({
			where: { id },
			relations: [
				"sites",
				"sites.artifacts",
				"sites.artifacts.artifactType",
				"sites.artifacts.artifactType.materials",
				"sites.artifacts.bladeShape",
				"sites.artifacts.baseShape",
				"sites.artifacts.haftingShape",
				"sites.artifacts.crossSection",
			],
		});
		assert(catalogue, "Catalogue not found");
		// res.json(catalogue);
		logger.info(`Fetched catalogue with ID: ${id}`);
		return catalogue;
	} catch (error) {
		logger.error(
			`Error fetching catalogue with ID ${req.params.id}: ${error.message}`,
		);
		return error;
		// res.status(500).json({ error: error.message });
	}
}

/**
 * PUT: Update an existing catalogue.
 * @param req Express request object containing the new 'name' and 'description' for the Catalogue.
 * @pre The Catalogue with the given ID must exist in the database.
 * @post Updates and returns the specified Catalogue in the database.
 * @return Returns the updated Catalogue object or a message indicating the Catalogue was not found.
 */
async function updateCatalogue(req) {
	const { id } = req.params;
	const { name, description } = req.body;
	try {
		const idInt = parseInt(id);
		assert(
			!isNaN(idInt) && name && description,
			"Valid ID, name, and description are required.",
		);
		const catalogueRepository = await myDatabase.getRepository(Catalogue);
		let catalogueToUpdate = await catalogueRepository.findOneBy({ id: idInt });
		assert(catalogueToUpdate, "Catalogue not found");
		catalogueToUpdate.name = name;
		catalogueToUpdate.description = description;
		await catalogueRepository.save(catalogueToUpdate);
		// res.json(catalogueToUpdate);
		logger.info(`Updated catalogue with ID: ${id}`);
		return catalogueToUpdate;
	} catch (error) {
		logger.error(`Error updating catalogue with ID ${id}: ${error.message}`);
		return error;
		// res.status(500).json({ error: error.message });
	}
}

/**
 * DELETE: Remove a catalogue.
 * @param req Express request object, expecting 'id' as a route parameter.
 * @pre The Catalogue with the given ID must exist in the database.
 * @post Deletes the specified Catalogue from the database.
 * @return Returns a message indicating success or failure of the deletion.
 */
async function deleteCatalogue(req) {
	const id = parseInt(req.params.id);
	try {
		assert(!isNaN(id), "Invalid ID provided for deletion");
		const catalogueRepository = await myDatabase.getRepository(Catalogue);
		const deleteResult = await catalogueRepository.delete(id);
		assert(deleteResult.affected > 0, "Catalogue not found for deletion");
		// res.status(204).send(); // No Content
		logger.info(`Deleted catalogue with ID: ${id}`);
		return;
	} catch (error) {
		logger.error(`Error deleting catalogue with ID ${id}: ${error.message}`);
		return error;
		// res.status(500).json({ error: error.message });
	}
}

module.exports = {
	getAllCatalogues,
	newCatalogue,
	getCatalogueFromId,
	updateCatalogue,
	deleteCatalogue,
};
