const express = require("express");
const assert = require("node:assert/strict");
const router = express.Router();
const baseShapesHelper = require("../helperFiles/baseShapesHelper.js");
const authenticateAdmin = require("../middleware/authenticate.js");
const { validate, nameValidationRules } = require("../middleware/sanitize.js");

/**
 * POST: Create a new BaseShape.
 * @route POST /baseShapes
 * @param req Express request object, expecting 'name' in the request body.
 * @param res Express response object used for returning the newly created BaseShape.
 * @pre The request body must contain a 'name' field.
 * @pre A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @post A new BaseShape is created and saved in the database.
 * @return Returns the newly created BaseShape object.
 */
router.post(
	"/",
	authenticateAdmin,
	nameValidationRules(),
	validate,
	async (req, res) => {
		const response = await baseShapesHelper.newBaseShape(req);
		if (response instanceof Error) {
			return res
				.status(response instanceof assert.AssertionError ? 400 : 500)
				.json({ error: response.message });
		}
		return res.json(response);
	},
);

/**
 * GET: Fetch all BaseShapes.
 * @route GET /baseShapes
 * @param req Express request object.
 * @param res Express response object used for returning the fetched BaseShapes.
 * @pre None.
 * @post Retrieves and returns all BaseShapes from the database.
 * @return Returns an array of BaseShape objects.
 */
router.get("/", async (req, res) => {
	const response = await baseShapesHelper.getAllBaseShapes();
	if (response instanceof Error) {
		return res.status(500).json({ error: response.message });
	}
	return res.json(response);
});

/**
 * GET: Fetch a BaseShape by ID.
 * @route GET /baseShapes/:id
 * @param req Express request object, expecting 'id' as a route parameter.
 * @param res Express response object used for returning the fetched BaseShape.
 * @pre The BaseShape with the given ID must exist in the database.
 * @post Retrieves and returns the specified BaseShape from the database.
 * @return Returns a BaseShape object or a message indicating the BaseShape was not found.
 */
router.get("/:id", async (req, res) => {
	const response = await baseShapesHelper.getBaseShapeById(req);
	if (response instanceof Error) {
		return res.status(500).json({ error: response.message });
	}
	return res.json(response);
});

/**
 * PUT: Update an existing BaseShape.
 * @route PUT /baseShapes/:id
 * @param req Express request object containing the new 'name' for the BaseShape.
 * @param res Express response object used for returning the updated BaseShape.
 * @pre The BaseShape with the given ID must exist in the database.
 * @pre A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @post Updates and returns the specified BaseShape in the database.
 * @return Returns the updated BaseShape object or a message indicating the BaseShape was not found.
 */
router.put(
	"/:id",
	authenticateAdmin,
	nameValidationRules(),
	validate,
	async (req, res) => {
		const response = await baseShapesHelper.updateBaseShape(req);
		if (response instanceof Error) {
			return res
				.status(response instanceof assert.AssertionError ? 400 : 500)
				.json({ error: response.message });
		}
		return res.json(response);
	},
);

/**
 * DELETE: Remove a BaseShape by ID.
 * @route DELETE /baseShapes/:id
 * @param req Express request object, expecting 'id' as a route parameter.
 * @param res Express response object used for signaling the result of the deletion operation.
 * @pre The BaseShape with the given ID must exist in the database.
 * @pre A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @post Deletes the specified BaseShape from the database.
 * @return Returns a message indicating success or failure of the deletion.
 */
router.delete("/:id", authenticateAdmin, async (req, res) => {
	const response = await baseShapesHelper.deleteBaseShape(req);
	if (response instanceof Error) {
		return res.status(500).json({ error: response.message });
	}
	return res.status(204).send(); // No Content
});

module.exports = router;
