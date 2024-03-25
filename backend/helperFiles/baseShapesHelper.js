const { BaseShape } = require("../dist/entity");
const myDatabase = require("../config/db");
const assert = require("node:assert/strict");
const { logger } = require("../config/logger.js");

/**
 *
 */
async function newBaseShape(req) {
	const { name } = req.body;
	try {
		assert(name, "BaseShape name is required.");
		const baseShapeRepository = await myDatabase.getRepository(BaseShape);
		const newBaseShape = baseShapeRepository.create({ name });
		await baseShapeRepository.save(newBaseShape);
		// res.json(newBaseShape);
		logger.info(`New BaseShape created: ${name}`);
		return newBaseShape;
	} catch (error) {
		logger.error(`Error creating new BaseShape: ${error.message}`);
		return error;
		// res
		// 	.status(error instanceof assert.AssertionError ? 400 : 500)
		// 	.json({ error: error.message });
	}
}

/**
 *
 */
async function getAllBaseShapes() {
	try {
		const baseShapeRepository = await myDatabase.getRepository(BaseShape);
		const baseShapes = await baseShapeRepository.find({
			relations: ["cultures", "projectilePoints"],
		});
		assert(baseShapes.length > 0, "No BaseShapes found.");
		// res.json(baseShapes);
		logger.info("Fetched all BaseShapes.");
		return baseShapes;
	} catch (error) {
		logger.error(`Error fetching BaseShapes: ${error.message}`);
		return error;
		// res.status(500).json({ error: error.message });
	}
}

/**
 *
 */
async function getBaseShapeById(req) {
	const { id } = req.params;
	try {
		const baseShapeRepository = await myDatabase.getRepository(BaseShape);
		const baseShape = await baseShapeRepository.findOne({
			where: { id: parseInt(id) },
			relations: ["cultures", "projectilePoints"],
		});
		assert(baseShape, "BaseShape not found");
		// res.json(baseShape);
		logger.info(`Fetched BaseShape with ID: ${id}`);
		return baseShape;
	} catch (error) {
		logger.error(`Error fetching BaseShape with ID ${id}: ${error.message}`);
		return error;
		// res.status(500).json({ error: error.message });
	}
}

/**
 *
 */
async function updateBaseShape(req) {
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
		// res.json(baseShapeToUpdate);
		logger.info(`Updated BaseShape with ID: ${id}`);
		return baseShapeToUpdate;
	} catch (error) {
		logger.error(`Error updating BaseShape with ID ${id}: ${error.message}`);
		return error;
		// res
		// 	.status(error instanceof assert.AssertionError ? 400 : 500)
		// 	.json({ error: error.message });
	}
}

/**
 *
 */
async function deleteBaseShape(req) {
	const id = parseInt(req.params.id);
	try {
		const baseShapeRepository = await myDatabase.getRepository(BaseShape);
		const deleteResult = await baseShapeRepository.delete(id);

		assert(deleteResult.affected > 0, "BaseShape not found");
		// res.status(204).send(); // No Content
		logger.info(`Deleted BaseShape with ID: ${id}`);
		return;
	} catch (error) {
		logger.error(`Error deleting BaseShape with ID ${id}: ${error.message}`);
		return error;
		// res.status(500).json({ error: error.message });
	}
}

module.exports = {
	newBaseShape,
	getAllBaseShapes,
	getBaseShapeById,
	updateBaseShape,
	deleteBaseShape,
};
