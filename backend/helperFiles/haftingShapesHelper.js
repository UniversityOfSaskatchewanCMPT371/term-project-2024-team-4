const { HaftingShape } = require("../dist/entity");
const myDatabase = require("../config/db");
const assert = require("node:assert/strict");
const { logger } = require("../config/logger.js");

/**
 *
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
 *
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
 *
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
 *
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
 *
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
