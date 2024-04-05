const express = require("express");
const assert = require("node:assert/strict");
const router = express.Router();
const cataloguesHelper = require("../helperFiles/cataloguesHelper.js");
const authenticateAdmin = require("../middleware/authenticate.js");
const {
	validate,
	nameDescValidationRules,
} = require("../middleware/sanitize.js");

/**
 * GET: Fetch all catalogues.
 * @route GET /catalogues
 * @param req Express request object.
 * @param res Express response object used to return all catalogues.
 * @pre None.
 * @post Retrieves all catalogues from the database.
 * @return Returns an array of Catalogue objects.
 */
router.get("/", async (req, res) => {
	const response = await cataloguesHelper.getAllCatalogues();
	if (response instanceof Error) {
		return res.status(500).json({ error: response.message });
	}
	return res.json(response);
});

/**
 * POST: Create a new catalogue.
 * @route POST /catalogues
 * @param req Express request object, expecting 'name' and 'description' in the request body.
 * @param res Express response object used to return the created Catalogue.
 * @pre The request body must contain both 'name' and 'description' fields.
 * @pre A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @post A new Catalogue is created and saved in the database.
 * @return Returns the newly created Catalogue object.
 */
router.post(
	"/",
	authenticateAdmin,
	nameDescValidationRules(),
	validate,
	async (req, res) => {
		const response = await cataloguesHelper.newCatalogue(req);
		if (response instanceof Error) {
			return res
				.status(response instanceof assert.AssertionError ? 400 : 500)
				.json({ error: response.message });
		}
		return res.json(response);
	},
);

/**
 * GET: Fetch a catalogue by ID.
 * @route GET /catalogues/:id
 * @param req Express request object, expecting 'id' as a route parameter.
 * @param res Express response object used to return a specific Catalogue.
 * @pre The Catalogue with the provided ID must exist in the database.
 * @post Retrieves a specific Catalogue from the database based on its ID.
 * @return Returns a Catalogue object or a message indicating the Catalogue was not found.
 */
router.get("/:id", async (req, res) => {
	const response = await cataloguesHelper.getCatalogueFromId(req);
	if (response instanceof Error) {
		return res.status(500).json({ error: response.message });
	}
	return res.json(response);
});

/**
 * PUT: Update an existing catalogue.
 * @route PUT /catalogues/:id
 * @param req Express request object containing the new 'name' and 'description' for the Catalogue.
 * @param res Express response object used for returning the updated Catalogue.
 * @pre The Catalogue with the given ID must exist in the database.
 * @pre A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @post Updates and returns the specified Catalogue in the database.
 * @return Returns the updated Catalogue object or a message indicating the Catalogue was not found.
 */
router.put(
	"/:id",
	authenticateAdmin,
	nameDescValidationRules(),
	validate,
	async (req, res) => {
		const response = await cataloguesHelper.updateCatalogue(req);
		if (response instanceof Error) {
			return res.status(500).json({ error: response.message });
		}
		return res.json(response);
	},
);

/**
 * DELETE: Remove a catalogue.
 * @route DELETE /catalogues/:id
 * @param req Express request object, expecting 'id' as a route parameter.
 * @param res Express response object used for signaling the result of the deletion operation.
 * @pre The Catalogue with the given ID must exist in the database.
 * @pre A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @post Deletes the specified Catalogue from the database.
 * @return Returns a message indicating success or failure of the deletion.
 */
router.delete("/:id", authenticateAdmin, async (req, res) => {
	const response = await cataloguesHelper.deleteCatalogue(req);
	if (response instanceof Error) {
		return res.status(500).json({ error: response.message });
	}
	return res.status(204).send(); // No Content
});

module.exports = router;
