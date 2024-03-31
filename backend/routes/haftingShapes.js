const express = require("express");
const router = express.Router();
const haftingShapesHelper = require("../helperFiles/haftingShapesHelper.js");
const authenticateAdmin = require("../middleware/authenticate.js");
const { validate, nameValidationRules } = require("../middleware/sanitize.js");

/**
 * POST: Creates a new HaftingShape.
 * @route POST /haftingShapes
 * @param req Express request object, expecting 'name' in the request body.
 * @param res Express response object used for returning the newly created HaftingShape.
 * @pre 'name' field must be provided in the request body.
 * @pre A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @post A new HaftingShape entity is created in the database.
 * @return Returns the newly created HaftingShape object.
 */
router.post(
	"/",
	authenticateAdmin,
	nameValidationRules(),
	validate,
	async (req, res) => {
		const response = await haftingShapesHelper.newHaftingShape(req);
		if (response instanceof Error) {
			return res.status(400).json({ error: response.message });
		}
		return res.json(response);
	},
);

/**
 * GET: Fetches all HaftingShapes.
 * @route GET /haftingShapes
 * @param req Express request object.
 * @param res Express response object used to return all HaftingShapes.
 * @pre None.
 * @post Retrieves all HaftingShape entities from the database.
 * @return Returns an array of HaftingShape objects.
 */
router.get("/", async (req, res) => {
	const response = await haftingShapesHelper.getAllHaftingShapes();
	if (response instanceof Error) {
		return res.status(500).json({ error: response.message });
	}
	return res.json(response);
});

/**
 * GET: Fetches a HaftingShape by ID.
 * @route GET /haftingShapes/:id
 * @param req Express request object, expecting 'id' as a route parameter.
 * @param res Express response object used to return a specific HaftingShape.
 * @pre The HaftingShape with the given ID must exist in the database.
 * @post Retrieves a specific HaftingShape from the database based on its ID.
 * @return Returns a HaftingShape object or a message indicating the HaftingShape was not found.
 */
router.get("/:id", async (req, res) => {
	const response = await haftingShapesHelper.getHaftingShapeById(req);
	if (response instanceof Error) {
		return res.status(500).json({ error: response.message });
	}
	return res.json(response);
});

/**
 * PUT: Updates an existing HaftingShape.
 * @route PUT /haftingShapes/:id
 * @param req Express request object containing the new 'name' for the HaftingShape.
 * @param res Express response object used for returning the updated HaftingShape.
 * @pre The HaftingShape with the given ID must exist in the database.
 * @pre A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @post Updates and returns the specified HaftingShape in the database.
 * @return Returns the updated HaftingShape object or a message indicating the HaftingShape was not found.
 */
router.put(
	"/:id",
	authenticateAdmin,
	nameValidationRules(),
	validate,
	async (req, res) => {
		const response = await haftingShapesHelper.updateHaftingShape(req);
		if (response instanceof Error) {
			return res.status(500).json({ error: response.message });
		}
		return res.json(response);
	},
);

/**
 * DELETE: Removes a HaftingShape by ID.
 * @route DELETE /haftingShapes/:id
 * @param req Express request object, expecting 'id' as a route parameter.
 * @param res Express response object used for signaling the result of the deletion operation.
 * @pre The HaftingShape with the given ID must exist in the database.
 * @pre A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @post Deletes the specified HaftingShape from the database.
 * @return Returns a message indicating success or failure of the deletion.
 */
router.delete("/:id", authenticateAdmin, async (req, res) => {
	const response = await haftingShapesHelper.deleteHaftingShape(req);
	if (response instanceof Error) {
		return res.status(500).json({ error: response.message });
	}
	return res.status(204).send();
});

module.exports = router;
