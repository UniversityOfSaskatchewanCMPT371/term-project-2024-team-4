const { Culture, Period } = require("../dist/entity");
const myDatabase = require("../config/db");
const assert = require("node:assert/strict");
const { logger } = require("../config/logger.js");

/**
 *
 */
async function newCulture(req) {
	const { name, periodId } = req.body;
	try {
		assert(name, "Name is required.");
		assert(periodId, "Period ID is required.");
		const cultureRepository = await myDatabase.getRepository(Culture);
		const period = await myDatabase
			.getRepository(Period)
			.findOneBy({ id: periodId });
		assert(period, "Period not found.");

		const newCulture = cultureRepository.create({ name, period });
		await cultureRepository.save(newCulture);
		// res.status(201).json(newCulture);
		logger.info(`New Culture created: ${name}`);
		return newCulture;
	} catch (error) {
		logger.error(`Error creating new Culture: ${error.message}`);
		return error;
		// res
		// 	.status(error instanceof assert.AssertionError ? 404 : 400)
		// 	.json({ error: error.message });
	}
}

/**
 *
 */
async function getAllCultures() {
	try {
		const cultureRepository = await myDatabase.getRepository(Culture);
		const cultures = await cultureRepository.find({
			relations: [
				"period",
				"projectilePoints",
				"bladeShapes",
				"baseShapes",
				"haftingShapes",
				"crossSections",
			],
		});
		assert(cultures.length > 0, "No Cultures found.");
		// res.json(cultures);
		logger.info("Fetched all Cultures.");
		return cultures;
	} catch (error) {
		logger.error(`Error fetching Cultures: ${error.message}`);
		return error;
		// res.status(500).json({ error: error.message });
	}
}

/**
 *
 */
async function getCultureById(req) {
	try {
		const id = parseInt(req.params.id);
		assert(!isNaN(id), "Invalid ID provided");
		const cultureRepository = await myDatabase.getRepository(Culture);
		const culture = await cultureRepository.findOne({
			where: { id },
			relations: [
				"period",
				"projectilePoints",
				"bladeShapes",
				"baseShapes",
				"haftingShapes",
				"crossSections",
			],
		});
		assert(culture, "Culture not found.");
		// res.json(culture);
		logger.info(`Fetched Culture with ID: ${id}`);
		return culture;
	} catch (error) {
		logger.error(
			`Error fetching Culture with ID ${req.params.id}: ${error.message}`,
		);
		return error;
		// res.status(500).json({ error: error.message });
	}
}

/**
 *
 */
async function updateCulture(req) {
	const { id } = req.params;
	const { name, periodId } = req.body;
	try {
		const idInt = parseInt(id);
		assert(!isNaN(idInt), "Invalid ID provided.");
		assert(name, "Updated name is required.");

		const cultureRepository = await myDatabase.getRepository(Culture);
		let cultureToUpdate = await cultureRepository.findOneBy({ id: idInt });
		assert(cultureToUpdate, "Culture not found.");

		if (periodId) {
			const period = await myDatabase
				.getRepository(Period)
				.findOneBy({ id: periodId });
			assert(period, "Period not found.");
			cultureToUpdate.period = period;
		}

		cultureToUpdate.name = name;
		await cultureRepository.save(cultureToUpdate);
		// res.json(cultureToUpdate);
		logger.info(`Updated Culture with ID: ${id}`);
		return cultureToUpdate;
	} catch (error) {
		logger.error(`Error updating Culture with ID ${id}: ${error.message}`);
		return error;
		// res.status(500).json({ error: error.message });
	}
}

/**
 *
 */
async function deleteCulture(req) {
	const id = parseInt(req.params.id);
	try {
		assert(!isNaN(id), "Invalid ID provided for deletion");
		const cultureRepository = await myDatabase.getRepository(Culture);
		const deleteResult = await cultureRepository.delete(id);
		assert(deleteResult.affected > 0, "Culture not found for deletion");
		// res.status(204).send(); // No Content
		logger.info(`Deleted Culture with ID: ${id}`);
		return;
	} catch (error) {
		logger.error(`Error deleting Culture with ID ${id}: ${error.message}`);
		return error;
		// res.status(500).json({ error: error.message });
	}
}

module.exports = {
	newCulture,
	getAllCultures,
	getCultureById,
	updateCulture,
	deleteCulture,
};
