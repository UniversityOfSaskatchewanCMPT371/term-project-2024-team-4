const { HaftingShape } = require("../dist/entity");
const myDatabase = require("../config/db");
const assert = require("node:assert/strict");
const { logger } = require("../config/logger.js");

/**
 * POST: Creates a new HaftingShape.
 * @param req Express request object, expecting 'name' in the request body.
 * @pre 'name' field must be provided in the request body.
 * @post A new HaftingShape entity is created in the database.
 * @return Returns the newly created HaftingShape object.
 */
async function newHaftingShape(req) {
	const { name } = req.body;
	try {
		assert(name, "HaftingShape name is required.");
		const haftingShapeRepository = await myDatabase.getRepository(HaftingShape);
		const newHaftingShape = haftingShapeRepository.create({ name });
		await haftingShapeRepository.save(newHaftingShape);
		logger.info(`New HaftingShape created: ${name}`);
		return newHaftingShape;
	} catch (error) {
		logger.error(`Error creating new HaftingShape: ${error.message}`);
		return error;
	}
}

/**
 * GET: Fetches all HaftingShapes.
 * @pre None.
 * @post Retrieves all HaftingShape entities from the database.
 * @return Returns an array of HaftingShape objects.
 */
async function getAllHaftingShapes() {
	try {
		const haftingShapeRepository = await myDatabase.getRepository(HaftingShape);
		const haftingShapes = await haftingShapeRepository.find({
			relations: ["cultures", "projectilePoints"],
		});
		assert(haftingShapes.length > 0, "No HaftingShapes found.");
		logger.info("Fetched all HaftingShapes.");
		return haftingShapes;
	} catch (error) {
		logger.error(`Error fetching HaftingShapes: ${error.message}`);
		return error;
	}
}

/**
 * GET: Fetches a HaftingShape by ID.
 * @param req Express request object, expecting 'id' as a route parameter.
 * @pre The HaftingShape with the given ID must exist in the database.
 * @post Retrieves a specific HaftingShape from the database based on its ID.
 * @return Returns a HaftingShape object or a message indicating the HaftingShape was not found.
 */
async function getHaftingShapeById(req) {
	try {
		const id = parseInt(req.params.id);
		assert(!isNaN(id), "Invalid ID provided");
		const haftingShapeRepository = await myDatabase.getRepository(HaftingShape);
		const haftingShape = await haftingShapeRepository.findOne({
			where: { id },
			relations: ["cultures", "projectilePoints"],
		});
		assert(haftingShape, "HaftingShape not found");
		logger.info(`Fetched HaftingShape with ID: ${id}`);
		return haftingShape;
	} catch (error) {
		logger.error(
			`Error fetching HaftingShape with ID ${req.params.id}: ${error.message}`,
		);
		return error;
	}
}

/**
 * PUT: Updates an existing HaftingShape.
 * @param req Express request object containing the new 'name' for the HaftingShape.
 * @pre The HaftingShape with the given ID must exist in the database.
 * @post Updates and returns the specified HaftingShape in the database.
 * @return Returns the updated HaftingShape object or a message indicating the HaftingShape was not found.
 */
async function updateHaftingShape(req) {
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
		logger.info(`Updated HaftingShape with ID: ${id}`);
		return haftingShapeToUpdate;
	} catch (error) {
		logger.error(`Error updating HaftingShape with ID ${id}: ${error.message}`);
		return error;
	}
}

/**
 * DELETE: Removes a HaftingShape by ID.
 * @param req Express request object, expecting 'id' as a route parameter.
 * @pre The HaftingShape with the given ID must exist in the database.
 * @post Deletes the specified HaftingShape from the database.
 * @return Returns a message indicating success or failure of the deletion.
 */
async function deleteHaftingShape(req) {
	const id = parseInt(req.params.id);
	try {
		assert(!isNaN(id), "Invalid ID provided for deletion");
		const haftingShapeRepository = await myDatabase.getRepository(HaftingShape);
		const deleteResult = await haftingShapeRepository.delete(id);
		assert(deleteResult.affected > 0, "HaftingShape not found for deletion");
		logger.info(`Deleted HaftingShape with ID: ${id}`);
		return;
	} catch (error) {
		logger.error(`Error deleting HaftingShape with ID ${id}: ${error.message}`);
		return error;
	}
}

module.exports = {
	newHaftingShape,
	getAllHaftingShapes,
	getHaftingShapeById,
	updateHaftingShape,
	deleteHaftingShape,
};
