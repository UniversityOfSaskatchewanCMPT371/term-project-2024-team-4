const { BladeShape } = require("../dist/entity");
const myDatabase = require("../config/db");
const assert = require("node:assert/strict");
const { logger } = require("../config/logger");

/**
 * POST: Creates a new BladeShape.
 * @param req Express request object, expecting 'name' in the request body.
 * @pre 'name' field should be provided in the body and must be unique.
 * @post A new BladeShape is created in the database.
 * @return Returns the newly created BladeShape object.
 */
async function newBladeShape(req) {
	const { name } = req.body;
	try {
		assert(name, "BladeShape name is required.");
		const bladeShapeRepository = await myDatabase.getRepository(BladeShape);
		const newBladeShape = bladeShapeRepository.create({ name });
		await bladeShapeRepository.save(newBladeShape);
		// res.json(newBladeShape);
		logger.info(`New BladeShape created: ${name}`);
		return newBladeShape;
	} catch (error) {
		logger.error(`Error creating new BladeShape: ${error.message}`);
		return error;
		// res
		// 	.status(error instanceof assert.AssertionError ? 400 : 500)
		// 	.json({ error: error.message });
	}
}

/**
 * GET: Fetches all BladeShapes.
 * @pre None.
 * @post Retrieves all BladeShapes from the database.
 * @return Returns an array of BladeShape objects.
 */
async function getAllBladeShapes() {
	try {
		const bladeShapeRepository = await myDatabase.getRepository(BladeShape);
		const bladeShapes = await bladeShapeRepository.find({
			relations: ["cultures", "projectilePoints"],
		});
		assert(bladeShapes.length > 0, "No BladeShapes found.");
		// res.json(bladeShapes);
		logger.info("Fetched all BladeShapes.");
		return bladeShapes;
	} catch (error) {
		logger.error(`Error fetching BladeShapes: ${error.message}`);
		return error;
		// res.status(500).json({ error: error.message });
	}
}

/**
 * GET: Fetches a BladeShape by ID.
 * @param req Express request object, expecting 'id' as a route parameter.
 * @pre The BladeShape with the provided ID must exist in the database.
 * @post Retrieves a specific BladeShape from the database based on its ID.
 * @return Returns a BladeShape object or a message indicating the BladeShape was not found.
 */
async function getBladeShapeById(req) {
	try {
		const id = parseInt(req.params.id);
		assert(!isNaN(id), "Invalid ID provided");
		const bladeShapeRepository = await myDatabase.getRepository(BladeShape);
		const bladeShape = await bladeShapeRepository.findOne({
			where: { id },
			relations: ["cultures", "projectilePoints"],
		});
		assert(bladeShape, "BladeShape not found");
		// res.json(bladeShape);
		logger.info(`Fetched BladeShape with ID: ${id}`);
		return bladeShape;
	} catch (error) {
		logger.error(
			`Error fetching BladeShape with ID ${req.params.id}: ${error.message}`,
		);
		return error;
		// res.status(500).json({ error: error.message });
	}
}

/**
 * PUT: Updates an existing BladeShape.
 * @param req Express request object containing the new 'name' for the BladeShape.
 * @pre The BladeShape with the given ID must exist in the database.
 * @post Updates and returns the specified BladeShape in the database.
 * @return Returns the updated BladeShape object or a message indicating the BladeShape was not found.
 */
async function updateBladeShape(req) {
	const { id } = req.params;
	const { name } = req.body;
	try {
		assert(name, "BladeShape name is required for update.");
		const bladeShapeRepository = await myDatabase.getRepository(BladeShape);
		let bladeShapeToUpdate = await bladeShapeRepository.findOneBy({
			id: parseInt(id),
		});
		assert(bladeShapeToUpdate, "BladeShape not found for update.");
		bladeShapeToUpdate.name = name;
		await bladeShapeRepository.save(bladeShapeToUpdate);
		// res.json(bladeShapeToUpdate);
		logger.info(`Updated BladeShape with ID: ${id}`);
		return bladeShapeToUpdate;
	} catch (error) {
		logger.error(`Error updating BladeShape with ID ${id}: ${error.message}`);
		return error;
		// res.status(500).json({ error: error.message });
	}
}

/**
 * DELETE: Removes a BladeShape by ID.
 * @param req Express request object, expecting 'id' as a route parameter.
 * @pre The BladeShape with the given ID must exist in the database.
 * @post Deletes the specified BladeShape from the database.
 * @return Returns a message indicating success or failure of the deletion.
 */
async function deleteBladeShape(req) {
	const id = parseInt(req.params.id);
	try {
		assert(!isNaN(id), "Invalid ID provided for deletion");
		const bladeShapeRepository = await myDatabase.getRepository(BladeShape);
		const deleteResult = await bladeShapeRepository.delete(id);
		assert(deleteResult.affected > 0, "BladeShape not found for deletion");
		// res.status(204).send(); // No Content
		logger.info(`Deleted BladeShape with ID: ${id}`);
		return;
	} catch (error) {
		logger.error(`Error deleting BladeShape with ID ${id}: ${error.message}`);
		return error;
		// res.status(500).json({ error: error.message });
	}
}

module.exports = {
	newBladeShape,
	getAllBladeShapes,
	getBladeShapeById,
	updateBladeShape,
	deleteBladeShape,
};
