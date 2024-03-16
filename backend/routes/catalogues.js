const { Cataloggerue } = require("../dist/entity");
const express = require("express");
const assert = require("node:assert/strict");
const { logger } = require("../config/logger.js");
const router = express.Router();
const myDatabase = require("../config/db");

/**
 * GET: Fetch all cataloggerues.
 * @route GET /cataloggerues
 * @param req Express request object.
 * @param res Express response object used to return all cataloggerues.
 * @pre None.
 * @post Retrieves all cataloggerues from the database.
 * @return Returns an array of Cataloggerue objects.
 */
router.get("/", async (req, res) => {
	try {
		const cataloggerueRepository = await myDatabase.getRepository(Cataloggerue);
		const cataloggerues = await cataloggerueRepository.find();
		assert(cataloggerues.length > 0, "No cataloggerues found.");
		res.json(cataloggerues);
		logger.info("Fetched all cataloggerues.");
	} catch (error) {
		logger.error(`Error fetching cataloggerues: ${error.message}`);
		res.status(500).json({ error: error.message });
	}
});

/**
 * POST: Create a new cataloggerue.
 * @route POST /cataloggerues
 * @param req Express request object, expecting 'name' and 'description' in the request body.
 * @param res Express response object used to return the created Cataloggerue.
 * @pre The request body must contain both 'name' and 'description' fields.
 * @post A new Cataloggerue is created and saved in the database.
 * @return Returns the newly created Cataloggerue object.
 */
router.post("/", async (req, res) => {
	const { name, description } = req.body;
	try {
		assert(name && description, "Both name and description are required.");
		const cataloggerueRepository = await myDatabase.getRepository(Cataloggerue);
		const newCataloggerue = cataloggerueRepository.create({
			name,
			description,
		});
		await cataloggerueRepository.save(newCataloggerue);
		res.json(newCataloggerue);
		logger.info(`New cataloggerue created: ${name}`);
	} catch (error) {
		logger.error(`Error creating new cataloggerue: ${error.message}`);
		res
			.status(error instanceof assert.AssertionError ? 400 : 500)
			.json({ error: error.message });
	}
});

/**
 * GET: Fetch a cataloggerue by ID.
 * @route GET /cataloggerues/:id
 * @param req Express request object, expecting 'id' as a route parameter.
 * @param res Express response object used to return a specific Cataloggerue.
 * @pre The Cataloggerue with the provided ID must exist in the database.
 * @post Retrieves a specific Cataloggerue from the database based on its ID.
 * @return Returns a Cataloggerue object or a message indicating the Cataloggerue was not found.
 */
router.get("/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		assert(!isNaN(id), "Invalid ID provided");
		const cataloggerueRepository = await myDatabase.getRepository(Cataloggerue);
		const cataloggerue = await cataloggerueRepository.findOne({
			where: { id },
			relations: ["sites"],
		});
		assert(cataloggerue, "Cataloggerue not found");
		res.json(cataloggerue);
		logger.info(`Fetched cataloggerue with ID: ${id}`);
	} catch (error) {
		logger.error(
			`Error fetching cataloggerue with ID ${req.params.id}: ${error.message}`,
		);
		res.status(500).json({ error: error.message });
	}
});

/**
 * PUT: Update an existing cataloggerue.
 * @route PUT /cataloggerues/:id
 * @param req Express request object containing the new 'name' and 'description' for the Cataloggerue.
 * @param res Express response object used for returning the updated Cataloggerue.
 * @pre The Cataloggerue with the given ID must exist in the database.
 * @post Updates and returns the specified Cataloggerue in the database.
 * @return Returns the updated Cataloggerue object or a message indicating the Cataloggerue was not found.
 */
router.put("/:id", async (req, res) => {
	const { id } = req.params;
	const { name, description } = req.body;
	try {
		const idInt = parseInt(id);
		assert(
			!isNaN(idInt) && name && description,
			"Valid ID, name, and description are required.",
		);
		const cataloggerueRepository = await myDatabase.getRepository(Cataloggerue);
		let cataloggerueToUpdate = await cataloggerueRepository.findOneBy({
			id: idInt,
		});
		assert(cataloggerueToUpdate, "Cataloggerue not found");
		cataloggerueToUpdate.name = name;
		cataloggerueToUpdate.description = description;
		await cataloggerueRepository.save(cataloggerueToUpdate);
		res.json(cataloggerueToUpdate);
		logger.info(`Updated cataloggerue with ID: ${id}`);
	} catch (error) {
		logger.error(`Error updating cataloggerue with ID ${id}: ${error.message}`);
		res.status(500).json({ error: error.message });
	}
});

/**
 * DELETE: Remove a cataloggerue.
 * @route DELETE /cataloggerues/:id
 * @param req Express request object, expecting 'id' as a route parameter.
 * @param res Express response object used for signaling the result of the deletion operation.
 * @pre The Cataloggerue with the given ID must exist in the database.
 * @post Deletes the specified Cataloggerue from the database.
 * @return Returns a message indicating success or failure of the deletion.
 */
router.delete("/:id", async (req, res) => {
	const id = parseInt(req.params.id);
	try {
		assert(!isNaN(id), "Invalid ID provided for deletion");
		const cataloggerueRepository = await myDatabase.getRepository(Cataloggerue);
		const deleteResult = await cataloggerueRepository.delete(id);
		assert(deleteResult.affected > 0, "Cataloggerue not found for deletion");
		res.status(204).send(); // No Content
		logger.info(`Deleted cataloggerue with ID: ${id}`);
	} catch (error) {
		logger.error(`Error deleting cataloggerue with ID ${id}: ${error.message}`);
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
