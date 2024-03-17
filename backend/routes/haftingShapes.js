const { HaftingShape } = require("../dist/entity");
const express = require("express");
const assert = require("node:assert/strict");
const { logger } = require("../config/logger.js");
const router = express.Router();
const myDatabase = require("../config/db");

/**
 * POST: Creates a new HaftingShape.
 * @route POST /haftingShapes
 * @param req Express request object, expecting 'name' in the request body.
 * @param res Express response object used for returning the newly created HaftingShape.
 * @pre 'name' field must be provided in the request body.
 * @post A new HaftingShape entity is created in the database.
 * @return Returns the newly created HaftingShape object.
 */
router.post("/", async (req, res) => {
	const { name } = req.body;
	try {
		assert(name, "HaftingShape name is required.");
		const haftingShapeRepository = await myDatabase.getRepository(HaftingShape);
		const newHaftingShape = haftingShapeRepository.create({ name });
		await haftingShapeRepository.save(newHaftingShape);
		res.json(newHaftingShape);
		logger.info(`New HaftingShape created: ${name}`);
	} catch (error) {
		logger.error(`Error creating new HaftingShape: ${error.message}`);
		res.status(400).json({ error: error.message });
	}
});

/**
 * GET: Fetches all HaftingShapes.
 * @route GET /haftingShapes
 * @param req Express request object.
 * @param res Express response object used to return all HaftingShapes.
 * @pre None.
 * @post Retrieves all HaftingShape entities from the database.
 * @return Returns an array of HaftingShape objects.
 */
router.get("/", async (req, res) => {
	try {
		const haftingShapeRepository = await myDatabase.getRepository(HaftingShape);
		const haftingShapes = await haftingShapeRepository.find({
			relations: ["cultures", "projectilePoints"],
		});
		assert(haftingShapes.length > 0, "No HaftingShapes found.");
		res.json(haftingShapes);
		logger.info("Fetched all HaftingShapes.");
	} catch (error) {
		logger.error(`Error fetching HaftingShapes: ${error.message}`);
		res.status(500).json({ error: error.message });
	}
});

/**
 * GET: Fetches a HaftingShape by ID.
 * @route GET /haftingShapes/:id
 * @param req Express request object, expecting 'id' as a route parameter.
 * @param res Express response object used to return a specific HaftingShape.
 * @pre The HaftingShape with the given ID must exist in the database.
 * @post Retrieves a specific HaftingShape from the database based on its ID.
 * @return Returns a HaftingShape object or a message indicating the HaftingShape was not found.
 */
router.get("/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		assert(!isNaN(id), "Invalid ID provided");
		const haftingShapeRepository = await myDatabase.getRepository(HaftingShape);
		const haftingShape = await haftingShapeRepository.findOne({
			where: { id },
			relations: ["cultures", "projectilePoints"],
		});
		assert(haftingShape, "HaftingShape not found");
		res.json(haftingShape);
		logger.info(`Fetched HaftingShape with ID: ${id}`);
	} catch (error) {
		logger.error(
			`Error fetching HaftingShape with ID ${req.params.id}: ${error.message}`,
		);
		res.status(500).json({ error: error.message });
	}
});

/**
 * PUT: Updates an existing HaftingShape.
 * @route PUT /haftingShapes/:id
 * @param req Express request object containing the new 'name' for the HaftingShape.
 * @param res Express response object used for returning the updated HaftingShape.
 * @pre The HaftingShape with the given ID must exist in the database.
 * @post Updates and returns the specified HaftingShape in the database.
 * @return Returns the updated HaftingShape object or a message indicating the HaftingShape was not found.
 */
router.put("/:id", async (req, res) => {
	const { id } = req.params;
	const { name } = req.body;
	try {
		const idInt = parseInt(id);
		assert(!isNaN(idInt) && name, "Valid ID and name are required.");
		const haftingShapeRepository = await myDatabase.getRepository(HaftingShape);
		let haftingShapeToUpdate = await haftingShapeRepository.findOneBy({
			id: idInt,
		});
		assert(haftingShapeToUpdate, "HaftingShape not found");
		haftingShapeToUpdate.name = name;
		await haftingShapeRepository.save(haftingShapeToUpdate);
		res.json(haftingShapeToUpdate);
		logger.info(`Updated HaftingShape with ID: ${id}`);
	} catch (error) {
		logger.error(`Error updating HaftingShape with ID ${id}: ${error.message}`);
		res.status(500).json({ error: error.message });
	}
});

/**
 * DELETE: Removes a HaftingShape by ID.
 * @route DELETE /haftingShapes/:id
 * @param req Express request object, expecting 'id' as a route parameter.
 * @param res Express response object used for signaling the result of the deletion operation.
 * @pre The HaftingShape with the given ID must exist in the database.
 * @post Deletes the specified HaftingShape from the database.
 * @return Returns a message indicating success or failure of the deletion.
 */
router.delete("/:id", async (req, res) => {
	const id = parseInt(req.params.id);
	try {
		assert(!isNaN(id), "Invalid ID provided for deletion");
		const haftingShapeRepository = await myDatabase.getRepository(HaftingShape);
		const deleteResult = await haftingShapeRepository.delete(id);
		assert(deleteResult.affected > 0, "HaftingShape not found for deletion");
		res.status(204).send(); // No Content
		logger.info(`Deleted HaftingShape with ID: ${id}`);
	} catch (error) {
		logger.error(`Error deleting HaftingShape with ID ${id}: ${error.message}`);
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
