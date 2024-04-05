const express = require("express");
const assert = require("node:assert/strict");
const router = express.Router();
const culturesHelper = require("../helperFiles/culturesHelper.js");
const authenticateAdmin = require("../middleware/authenticate.js");
const { validate, nameValidationRules } = require("../middleware/sanitize.js");

/**
 * POST: Creates a new Culture.
 * @route POST /cultures
 * @param req Express request object, expecting 'name' and 'periodId' in the request body.
 * @param res Express response object used for returning the newly created Culture.
 * @pre 'name' field must be provided and 'periodId' must reference an existing Period.
 * @pre A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @post A new Culture entity associated with the specified Period is created in the database.
 * @return Returns the newly created Culture object or an error message if creation fails.
 */
router.post(
	"/",
	authenticateAdmin,
	nameValidationRules(),
	validate,
	async (req, res) => {
		const response = await culturesHelper.newCulture(req);
		if (response instanceof Error) {
			return res
				.status(response instanceof assert.AssertionError ? 404 : 400)
				.json({ error: response.message });
		}
		return res.status(201).json(response);
	},
);

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
	const response = await culturesHelper.getAllCultures();
	if (response instanceof Error) {
		return res.status(500).json({ error: response.message });
	}
	return res.json(response);
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
	const response = await culturesHelper.getCultureById(req);
	if (response instanceof Error) {
		return res.status(500).json({ error: response.message });
	}
	return res.json(response);
});

/**
 * PUT: Updates an existing Culture.
 * @route PUT /cultures/:id
 * @param req Express request object containing the new 'name' and 'periodId' for the Culture.
 * @param res Express response object used for returning the updated Culture.
 * @pre The Culture with the given ID must exist in the database, and 'periodId' must reference an existing Period if provided.
 * @pre A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @post Updates and returns the specified Culture in the database.
 * @return Returns the updated Culture object or a message indicating the Culture or Period was not found.
 */
router.put(
	"/:id",
	authenticateAdmin,
	nameValidationRules(),
	validate,
	async (req, res) => {
		const response = await culturesHelper.updateCulture(req);
		if (response instanceof Error) {
			return res.status(500).json({ error: response.message });
		}
		return res.json(response);
	},
);

/**
 * DELETE: Removes a Culture by ID.
 * @route DELETE /cultures/:id
 * @param req Express request object, expecting 'id' as a route parameter.
 * @param res Express response object used for signaling the result of the deletion operation.
 * @pre The Culture with the given ID must exist in the database.
 * @pre A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @post Deletes the specified Culture from the database.
 * @return Returns a message indicating success or failure of the deletion.
 */
router.delete("/:id", authenticateAdmin, async (req, res) => {
	const response = await culturesHelper.deleteCulture(req);
	if (response instanceof Error) {
		return res.status(500).json({ error: response.message });
	}
	return res.status(204).send(); // No Content
});

module.exports = router;
