const express = require("express");
const assert = require("node:assert/strict");
const router = express.Router();
const bladeShapeHelper = require("../helperFiles/bladeShapesHelper.js");
const authenticateAdmin = require("../middleware/authenticate.js");
const { validate, nameValidationRules } = require("../middleware/sanitize.js");

/**
 * POST: Creates a new BladeShape.
 * @route POST /bladeShapes
 * @param req Express request object, expecting 'name' in the request body.
 * @param res Express response object used to return the created BladeShape.
 * @pre 'name' field should be provided in the body and must be unique.
 * @pre A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @post A new BladeShape is created in the database.
 * @return Returns the newly created BladeShape object.
 */
router.post(
	"/",
	authenticateAdmin,
	nameValidationRules(),
	validate,
	async (req, res) => {
		const response = await bladeShapeHelper.newBladeShape(req);
		if (response instanceof Error) {
			return res
				.status(response instanceof assert.AssertionError ? 400 : 500)
				.json({ error: response.message });
		}
		return res.json(response);
	},
);

/**
 * GET: Fetches all BladeShapes.
 * @route GET /bladeShapes
 * @param req Express request object.
 * @param res Express response object used to return all BladeShapes.
 * @pre None.
 * @post Retrieves all BladeShapes from the database.
 * @return Returns an array of BladeShape objects.
 */
router.get("/", async (req, res) => {
	const response = await bladeShapeHelper.getAllBladeShapes();
	if (response instanceof Error) {
		return res.status(500).json({ error: response.message });
	}
	return res.json(response);
});

/**
 * GET: Fetches a BladeShape by ID.
 * @route GET /bladeShapes/:id
 * @param req Express request object, expecting 'id' as a route parameter.
 * @param res Express response object used to return a specific BladeShape.
 * @pre The BladeShape with the provided ID must exist in the database.
 * @post Retrieves a specific BladeShape from the database based on its ID.
 * @return Returns a BladeShape object or a message indicating the BladeShape was not found.
 */
router.get("/:id", async (req, res) => {
	const response = await bladeShapeHelper.getBladeShapeById(req);
	if (response instanceof Error) {
		return res.status(500).json({ error: response.message });
	}
	return res.json(response);
});

/**
 * PUT: Updates an existing BladeShape.
 * @route PUT /bladeShapes/:id
 * @param req Express request object containing the new 'name' for the BladeShape.
 * @param res Express response object used for returning the updated BladeShape.
 * @pre The BladeShape with the given ID must exist in the database.
 * @pre A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @post Updates and returns the specified BladeShape in the database.
 * @return Returns the updated BladeShape object or a message indicating the BladeShape was not found.
 */
router.put(
	"/:id",
	authenticateAdmin,
	nameValidationRules(),
	validate,
	async (req, res) => {
		const response = await bladeShapeHelper.updateBladeShape(req);
		if (response instanceof Error) {
			return res.status(500).json({ error: response.message });
		}
		return res.json(response);
	},
);

/**
 * DELETE: Removes a BladeShape by ID.
 * @route DELETE /bladeShapes/:id
 * @param req Express request object, expecting 'id' as a route parameter.
 * @param res Express response object used for signaling the result of the deletion operation.
 * @pre The BladeShape with the given ID must exist in the database.
 * @pre A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @post Deletes the specified BladeShape from the database.
 * @return Returns a message indicating success or failure of the deletion.
 */
router.delete("/:id", authenticateAdmin, async (req, res) => {
	const response = await bladeShapeHelper.deleteBladeShape(req);
	if (response instanceof Error) {
		return res.status(500).json({ error: response.message });
	}
	return res.status(204).send(); // No Content
});

module.exports = router;
