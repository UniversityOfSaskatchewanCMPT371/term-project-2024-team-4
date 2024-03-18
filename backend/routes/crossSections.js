const { CrossSection } = require("../dist/entity");
const express = require("express");
const assert = require("node:assert/strict");
const { logger } = require("../config/logger.js");
const router = express.Router();
const myDatabase = require("../config/db");

/**
 * POST: Create a new CrossSection.
 * @route POST /crossSections
 * @param req Express request object, expecting 'name' in the request body.
 * @param res Express response object used for returning the created CrossSection.
 * @pre 'name' field must be provided and should be unique.
 * @post A new CrossSection entity is created in the database.
 * @return Returns the newly created CrossSection object.
 */
router.post("/", async (req, res) => {
	const { name } = req.body;
	try {
		assert(name, "CrossSection name is required.");
		const crossSectionRepository = await myDatabase.getRepository(CrossSection);
		const newCrossSection = crossSectionRepository.create({ name });
		await crossSectionRepository.save(newCrossSection);
		res.json(newCrossSection);
		logger.info(`New CrossSection created: ${name}`);
	} catch (error) {
		logger.error(`Error creating new CrossSection: ${error.message}`);
		res
			.status(error instanceof assert.AssertionError ? 400 : 500)
			.json({ error: error.message });
	}
});

/**
 * GET: Fetch all CrossSections.
 * @route GET /crossSections
 * @param req Express request object.
 * @param res Express response object used to return all CrossSections.
 * @pre None.
 * @post Retrieves all CrossSection entities from the database.
 * @return Returns an array of CrossSection objects.
 */
router.get("/", async (req, res) => {
	try {
		const crossSectionRepository = await myDatabase.getRepository(CrossSection);
		const crossSections = await crossSectionRepository.find({
			relations: ["cultures", "projectilePoints"],
		});
		assert(crossSections.length > 0, "No CrossSections found.");
		res.json(crossSections);
		logger.info("Fetched all CrossSections.");
	} catch (error) {
		logger.error(`Error fetching CrossSections: ${error.message}`);
		res.status(500).json({ error: error.message });
	}
});

/**
 * GET: Fetch a CrossSection by ID.
 * @route GET /crossSections/:id
 * @param req Express request object, expecting 'id' as a route parameter.
 * @param res Express response object used to return a specific CrossSection.
 * @pre The CrossSection with the given ID must exist in the database.
 * @post Retrieves a specific CrossSection from the database based on its ID.
 * @return Returns a CrossSection object or a message indicating the CrossSection was not found.
 */
router.get("/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		assert(!isNaN(id), "Invalid ID provided");
		const crossSectionRepository = await myDatabase.getRepository(CrossSection);
		const crossSection = await crossSectionRepository.findOne({
			where: { id },
			relations: ["cultures", "projectilePoints"],
		});
		assert(crossSection, "CrossSection not found");
		res.json(crossSection);
		logger.info(`Fetched CrossSection with ID: ${id}`);
	} catch (error) {
		logger.error(
			`Error fetching CrossSection with ID ${req.params.id}: ${error.message}`,
		);
		res.status(500).json({ error: error.message });
	}
});

/**
 * PUT: Update an existing CrossSection.
 * @route PUT /crossSections/:id
 * @param req Express request object containing the new 'name' for the CrossSection.
 * @param res Express response object used for returning the updated CrossSection.
 * @pre The CrossSection with the given ID must exist in the database.
 * @post Updates and returns the specified CrossSection in the database.
 * @return Returns the updated CrossSection object or a message indicating the CrossSection was not found.
 */
router.put("/:id", async (req, res) => {
	const { id } = req.params;
	const { name } = req.body;
	try {
		const idInt = parseInt(id);
		assert(!isNaN(idInt) && name, "Valid ID and name are required.");
		const crossSectionRepository = await myDatabase.getRepository(CrossSection);
		let crossSectionToUpdate = await crossSectionRepository.findOneBy({
			id: idInt,
		});
		assert(crossSectionToUpdate, "CrossSection not found");
		crossSectionToUpdate.name = name;
		await crossSectionRepository.save(crossSectionToUpdate);
		res.json(crossSectionToUpdate);
		logger.info(`Updated CrossSection with ID: ${id}`);
	} catch (error) {
		logger.error(`Error updating CrossSection with ID ${id}: ${error.message}`);
		res.status(500).json({ error: error.message });
	}
});

/**
 * DELETE: Remove a CrossSection.
 * @route DELETE /crossSections/:id
 * @param req Express request object, expecting 'id' as a route parameter.
 * @param res Express response object used for signaling the result of the deletion operation.
 * @pre The CrossSection with the given ID must exist in the database.
 * @post Deletes the specified CrossSection from the database.
 * @return Returns a message indicating success or failure of the deletion.
 */
router.delete("/:id", async (req, res) => {
	const id = parseInt(req.params.id);
	try {
		assert(!isNaN(id), "Invalid ID provided for deletion");
		const crossSectionRepository = await myDatabase.getRepository(CrossSection);
		const deleteResult = await crossSectionRepository.delete(id);
		assert(deleteResult.affected > 0, "CrossSection not found for deletion");
		res.status(204).send(); // No Content
		logger.info(`Deleted CrossSection with ID: ${id}`);
	} catch (error) {
		logger.error(`Error deleting CrossSection with ID ${id}: ${error.message}`);
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
