const { Culture, Period } = require("../dist/entity");
const express = require("express");
const assert = require("node:assert/strict");
const { logger } = require("../config/logger.js");
const router = express.Router();
const myDatabase = require("../config/db");

/**
 * POST: Creates a new Culture.
 * @route POST /cultures
 * @param req Express request object, expecting 'name' and 'periodId' in the request body.
 * @param res Express response object used for returning the newly created Culture.
 * @pre 'name' field must be provided and 'periodId' must reference an existing Period.
 * @post A new Culture entity associated with the specified Period is created in the database.
 * @return Returns the newly created Culture object or an error message if creation fails.
 */
router.post("/", async (req, res) => {
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
		res.status(201).json(newCulture);
		logger.info(`New Culture created: ${name}`);
	} catch (error) {
		logger.error(`Error creating new Culture: ${error.message}`);
		res
			.status(error instanceof assert.AssertionError ? 404 : 400)
			.json({ error: error.message });
	}
});

/**
 * GET: Fetches all Cultures.
 * @route GET /cultures
 * @param req Express request object.
 * @param res Express response object used to return all Cultures.
 * @pre None.
 * @post Retrieves all Culture entities from the database including their related data.
 * @return Returns an array of Culture objects or an error message if there is a fetch failure.
 */
router.get("/", async (req, res) => {
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
		res.json(cultures);
		logger.info("Fetched all Cultures.");
	} catch (error) {
		logger.error(`Error fetching Cultures: ${error.message}`);
		res.status(500).json({ error: error.message });
	}
});

/**
 * GET: Fetches a Culture by ID.
 * @route GET /cultures/:id
 * @param req Express request object, expecting 'id' as a route parameter.
 * @param res Express response object used to return a specific Culture.
 * @pre The Culture with the given ID must exist in the database.
 * @post Retrieves a specific Culture from the database based on its ID including related data.
 * @return Returns a Culture object or a message indicating the Culture was not found.
 */
router.get("/:id", async (req, res) => {
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
		res.json(culture);
		logger.info(`Fetched Culture with ID: ${id}`);
	} catch (error) {
		logger.error(
			`Error fetching Culture with ID ${req.params.id}: ${error.message}`,
		);
		res.status(500).json({ error: error.message });
	}
});

/**
 * PUT: Updates an existing Culture.
 * @route PUT /cultures/:id
 * @param req Express request object containing the new 'name' and 'periodId' for the Culture.
 * @param res Express response object used for returning the updated Culture.
 * @pre The Culture with the given ID must exist in the database, and 'periodId' must reference an existing Period if provided.
 * @post Updates and returns the specified Culture in the database.
 * @return Returns the updated Culture object or a message indicating the Culture or Period was not found.
 */
router.put("/:id", async (req, res) => {
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
		res.json(cultureToUpdate);
		logger.info(`Updated Culture with ID: ${id}`);
	} catch (error) {
		logger.error(`Error updating Culture with ID ${id}: ${error.message}`);
		res.status(500).json({ error: error.message });
	}
});

/**
 * DELETE: Removes a Culture by ID.
 * @route DELETE /cultures/:id
 * @param req Express request object, expecting 'id' as a route parameter.
 * @param res Express response object used for signaling the result of the deletion operation.
 * @pre The Culture with the given ID must exist in the database.
 * @post Deletes the specified Culture from the database.
 * @return Returns a message indicating success or failure of the deletion.
 */
router.delete("/:id", async (req, res) => {
	const id = parseInt(req.params.id);
	try {
		assert(!isNaN(id), "Invalid ID provided for deletion");
		const cultureRepository = await myDatabase.getRepository(Culture);
		const deleteResult = await cultureRepository.delete(id);
		assert(deleteResult.affected > 0, "Culture not found for deletion");
		res.status(204).send(); // No Content
		logger.info(`Deleted Culture with ID: ${id}`);
	} catch (error) {
		logger.error(`Error deleting Culture with ID ${id}: ${error.message}`);
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
