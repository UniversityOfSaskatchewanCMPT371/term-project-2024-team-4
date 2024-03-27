const { ArtifactType } = require("../dist/entity");
const myDatabase = require("../config/db");
const assert = require("node:assert/strict");
const { logger } = require("../config/logger.js");

/**
 *
 * @param {*} req
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
 *
 * @param {*} req
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
 *
 * @param {*} req
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
 *
 * @param {*} req
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
