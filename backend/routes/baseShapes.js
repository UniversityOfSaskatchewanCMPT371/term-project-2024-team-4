const { BaseShape } = require("../dist/entity");
const express = require("express");
const assert = require("node:assert/strict");
const { logger } = require("../config/logger.js");
const router = express.Router();
const myDatabase = require("../config/db");

/**
 * POST: Create a new BaseShape.
 * @route POST /baseShapes
 * @param req Express request object, expecting 'name' in the request body.
 * @param res Express response object used for returning the newly created BaseShape.
 * @pre The request body must contain a 'name' field.
 * @post A new BaseShape is created and saved in the database.
 * @return Returns the newly created BaseShape object.
 */
router.post("/", async (req, res) => {
	const { name } = req.body;
	try {
		assert(name, "BaseShape name is required.");
		const baseShapeRepository = await myDatabase.getRepository(BaseShape);
		const newBaseShape = baseShapeRepository.create({ name });
		await baseShapeRepository.save(newBaseShape);
		res.json(newBaseShape);
		logger.info(`New BaseShape created: ${name}`);
	} catch (error) {
		logger.error(`Error creating new BaseShape: ${error.message}`);
		res
			.status(error instanceof assert.AssertionError ? 400 : 500)
			.json({ error: error.message });
	}
});

/**
 * GET: Fetch all BaseShapes.
 * @route GET /baseShapes
 * @param req Express request object.
 * @param res Express response object used for returning the fetched BaseShapes.
 * @pre None.
 * @post Retrieves and returns all BaseShapes from the database.
 * @return Returns an array of BaseShape objects.
 */
router.get("/", async (req, res) => {
	try {
		const baseShapeRepository = await myDatabase.getRepository(BaseShape);
		const baseShapes = await baseShapeRepository.find({
			relations: ["cultures", "projectilePoints"],
		});
		assert(baseShapes.length > 0, "No BaseShapes found.");
		res.json(baseShapes);
		logger.info("Fetched all BaseShapes.");
	} catch (error) {
		logger.error(`Error fetching BaseShapes: ${error.message}`);
		res.status(500).json({ error: error.message });
	}
});

/**
 * GET: Fetch a BaseShape by ID.
 * @route GET /baseShapes/:id
 * @param req Express request object, expecting 'id' as a route parameter.
 * @param res Express response object used for returning the fetched BaseShape.
 * @pre The BaseShape with the given ID must exist in the database.
 * @post Retrieves and returns the specified BaseShape from the database.
 * @return Returns a BaseShape object or a message indicating the BaseShape was not found.
 */
router.get("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const baseShapeRepository = await myDatabase.getRepository(BaseShape);
		const baseShape = await baseShapeRepository.findOne({
			where: { id: parseInt(id) },
			relations: ["cultures", "projectilePoints"],
		});
		assert(baseShape, "BaseShape not found");
		res.json(baseShape);
		logger.info(`Fetched BaseShape with ID: ${id}`);
	} catch (error) {
		logger.error(`Error fetching BaseShape with ID ${id}: ${error.message}`);
		res.status(500).json({ error: error.message });
	}
});

/**
 * PUT: Update an existing BaseShape.
 * @route PUT /baseShapes/:id
 * @param req Express request object containing the new 'name' for the BaseShape.
 * @param res Express response object used for returning the updated BaseShape.
 * @pre The BaseShape with the given ID must exist in the database.
 * @post Updates and returns the specified BaseShape in the database.
 * @return Returns the updated BaseShape object or a message indicating the BaseShape was not found.
 */
router.put("/:id", async (req, res) => {
	const { id } = req.params;
	const { name } = req.body;
	try {
		assert(name, "Updated BaseShape name is required.");
		const baseShapeRepository = await myDatabase.getRepository(BaseShape);
		let baseShapeToUpdate = await baseShapeRepository.findOneBy({
			id: parseInt(id),
		});

		assert(baseShapeToUpdate, "BaseShape not found");
		baseShapeToUpdate.name = name;
		await baseShapeRepository.save(baseShapeToUpdate);
		res.json(baseShapeToUpdate);
		logger.info(`Updated BaseShape with ID: ${id}`);
	} catch (error) {
		logger.error(`Error updating BaseShape with ID ${id}: ${error.message}`);
		res
			.status(error instanceof assert.AssertionError ? 400 : 500)
			.json({ error: error.message });
	}
});

/**
 * DELETE: Remove a BaseShape by ID.
 * @route DELETE /baseShapes/:id
 * @param req Express request object, expecting 'id' as a route parameter.
 * @param res Express response object used for signaling the result of the deletion operation.
 * @pre The BaseShape with the given ID must exist in the database.
 * @post Deletes the specified BaseShape from the database.
 * @return Returns a message indicating success or failure of the deletion.
 */
router.delete("/:id", async (req, res) => {
	const id = parseInt(req.params.id);
	try {
		const baseShapeRepository = await myDatabase.getRepository(BaseShape);
		const deleteResult = await baseShapeRepository.delete(id);

		assert(deleteResult.affected > 0, "BaseShape not found");
		res.status(204).send(); // No Content
		logger.info(`Deleted BaseShape with ID: ${id}`);
	} catch (error) {
		logger.error(`Error deleting BaseShape with ID ${id}: ${error.message}`);
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
