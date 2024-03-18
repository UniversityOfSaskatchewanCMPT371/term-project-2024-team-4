const express = require("express");
const assert = require("node:assert/strict");
const { logger } = require("../config/logger.js");
const router = express.Router();
const artifactTypesHelper = require("../helperFiles/artifactTypesHelper");

/**
 * Creates a new ArtifactType in the database.
 * @route POST /artifactTypes
 * @param req Express request object, expecting 'id' in the request body.
 * @param res Express response object used to return the newly created ArtifactType.
 * @pre The 'id' provided in the body must be one of the predetermined values ('Lithic', 'Ceramic', 'Faunal').
 * @post A new ArtifactType is created and saved in the database.
 * @return Returns the newly created ArtifactType object or an error message.
 */
router.post("/", async (req, res) => {
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
		res.status(201).json(artifactType);
		logger.info(`New ArtifactType created: ${id}`);
	} catch (error) {
		logger.error(`Error creating ArtifactType: ${error.message}`);
		res
			.status(error instanceof assert.AssertionError ? 400 : 500)
			.json({ message: error.message });
	}
});

/**
 * Fetches all ArtifactTypes from the database.
 * @route GET /artifactTypes
 * @param req Express request object.
 * @param res Express response object used to return the fetched ArtifactTypes.
 * @pre None.
 * @post Retrieves and returns all ArtifactTypes from the database.
 * @return Returns an array of ArtifactType objects or an error message.
 */
router.get("/", async (req, res) => {
	try {
		const artifactTypeRepository = await myDatabase.getRepository(ArtifactType);
		const artifactTypes = await artifactTypeRepository.find({
			relations: ["materials", "artifacts"],
		});

		assert(artifactTypes.length > 0, "No ArtifactTypes found.");
		res.json(artifactTypes);
		logger.info("Fetched all ArtifactTypes.");
	} catch (error) {
		logger.error(`Error fetching ArtifactTypes: ${error.message}`);
		res.status(500).json({ error: error.message });
	}
});

/**
 * Fetches a single ArtifactType identified by ID from the database.
 * @route GET /artifactTypes/:id
 * @param req Express request object, expecting 'id' as a parameter.
 * @param res Express response object used to return the fetched ArtifactType.
 * @pre The ArtifactType with the given ID must exist in the database.
 * @post Retrieves and returns the specified ArtifactType from the database.
 * @return Returns an ArtifactType object or an error message.
 */
router.get("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const artifactTypeRepository = await myDatabase.getRepository(ArtifactType);
		const artifactType = await artifactTypeRepository.findOne({
			where: { id },
			relations: ["materials", "artifacts"],
		});

		assert(artifactType, "ArtifactType not found");
		res.json(artifactType);
		logger.info(`Fetched ArtifactType with ID: ${id}`);
	} catch (error) {
		logger.error(`Error fetching ArtifactType with ID ${id}: ${error.message}`);
		res.status(500).json({ error: error.message });
	}
	res.json(artifactType);
});

/**
 * Deletes a single ArtifactType identified by ID from the database.
 * @route DELETE /artifactTypes/:id
 * @param req Express request object, expecting 'id' as a parameter.
 * @param res Express response object used for signaling the result of the deletion operation.
 * @pre The ArtifactType with the given ID must exist in the database.
 * @post Deletes the specified ArtifactType from the database.
 * @return Does not return any content on successful deletion, otherwise returns an error message.
 */
router.delete("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const artifactTypeRepository = await myDatabase.getRepository(ArtifactType);
		const result = await artifactTypeRepository.delete(id);

		assert(result.affected > 0, "ArtifactType not found");
		res.status(204).send(); // No Content
		logger.info(`Deleted ArtifactType with ID: ${id}`);
	} catch (error) {
		logger.error(`Error deleting ArtifactType with ID ${id}: ${error.message}`);
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
