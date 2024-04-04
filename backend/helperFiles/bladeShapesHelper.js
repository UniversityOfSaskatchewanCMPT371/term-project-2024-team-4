const { BladeShape } = require("../dist/entity");
const myDatabase = require("../config/db");
const assert = require("node:assert/strict");
const { logger } = require("../config/logger");

/**
 *
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
 *
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
 *
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
 *
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
 *
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
