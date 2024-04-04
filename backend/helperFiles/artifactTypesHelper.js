const { ArtifactType } = require("../dist/entity");
const myDatabase = require("../config/db");
const assert = require("node:assert/strict");
const { logger } = require("../config/logger.js");

/**
 * Creates a new ArtifactType in the database.
 * @param req Express request object, expecting 'id' in the request body.
 * @pre The 'id' provided in the body must be one of the predetermined values ('Lithic', 'Ceramic', 'Faunal').
 * @post A new ArtifactType is created and saved in the database.
 * @return Returns the newly created ArtifactType object or an error message.
 */
async function newArtifactType(req) {
	const { id } = req.body;
	try {
		assert(
			["Lithic", "Ceramic", "Faunal"].includes(id),
			"Invalid ArtifactType ID.",
		);
		const artifactTypeRepository = await myDatabase.getRepository(ArtifactType);

		const existingType = await artifactTypeRepository.findOneBy({ id });
		assert(!existingType, "ArtifactType already exists.");

		const artifactType = artifactTypeRepository.create({ id });
		await artifactTypeRepository.save(artifactType);
		// res.status(201).json(artifactType);
		logger.info(`New ArtifactType created: ${id}`);
		return artifactType;
	} catch (error) {
		logger.error(`Error creating ArtifactType: ${error.message}`);
		return error;
		// res
		// .status(error instanceof assert.AssertionError ? 400 : 500)
		// .json({ message: error.message });
	}
}

/**
 * Fetches all ArtifactTypes from the database.
 * @pre None.
 * @post Retrieves and returns all ArtifactTypes from the database.
 * @return Returns an array of ArtifactType objects or an error message.
 */
async function getAllArtifactTypes() {
	try {
		const artifactTypeRepository = await myDatabase.getRepository(ArtifactType);
		const artifactTypes = await artifactTypeRepository.find({
			relations: ["materials", "artifacts"],
		});

		assert(artifactTypes.length > 0, "No ArtifactTypes found.");
		// res.json(artifactTypes);
		logger.info("Fetched all ArtifactTypes.");
		return artifactTypes;
	} catch (error) {
		logger.error(`Error fetching ArtifactTypes: ${error.message}`);
		return error;
		// res.status(500).json({ error: error.message });
	}
}

/**
 * Fetches a single ArtifactType identified by ID from the database.
 * @param req Express request object, expecting 'id' as a parameter.
 * @pre The ArtifactType with the given ID must exist in the database.
 * @post Retrieves and returns the specified ArtifactType from the database.
 * @return Returns an ArtifactType object or an error message.
 */
async function getArtifactTypeFromId(req) {
	const { id } = req.params;
	try {
		const artifactTypeRepository = await myDatabase.getRepository(ArtifactType);
		const artifactType = await artifactTypeRepository.findOne({
			where: { id },
			relations: [
				"materials",
				"artifacts",
				"artifacts.artifactType",
				"artifacts.artifactType.materials",
				"artifacts.baseShape",
				"artifacts.bladeShape",
				"artifacts.haftingShape",
				"artifacts.crossSection",
			],
		});
		assert(artifactType, "ArtifactType not found");
		// res.json(artifactType);
		logger.info(`Fetched ArtifactType with ID: ${id}`);
		return artifactType;
	} catch (error) {
		logger.error(`Error fetching ArtifactType with ID ${id}: ${error.message}`);
		return error;
		// res.status(500).json({ error: error.message });
	}
}

/**
 * Deletes a single ArtifactType identified by ID from the database.
 * @param req Express request object, expecting 'id' as a parameter.
 * @pre The ArtifactType with the given ID must exist in the database.
 * @post Deletes the specified ArtifactType from the database.
 * @return Does not return any content on successful deletion, otherwise returns an error message.
 */
async function deleteArtifactType(req) {
	const { id } = req.params;
	try {
		const artifactTypeRepository = await myDatabase.getRepository(ArtifactType);
		const result = await artifactTypeRepository.delete(id);

		assert(result.affected > 0, "ArtifactType not found");
		// res.status(204).send(); // No Content
		logger.info(`Deleted ArtifactType with ID: ${id}`);
		return;
	} catch (error) {
		logger.error(`Error deleting ArtifactType with ID ${id}: ${error.message}`);
		return error;
		// res.status(500).json({ error: error.message });
	}
}

module.exports = {
	newArtifactType,
	getAllArtifactTypes,
	getArtifactTypeFromId,
	deleteArtifactType,
};
