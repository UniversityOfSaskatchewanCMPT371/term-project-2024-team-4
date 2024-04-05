const express = require("express");
const assert = require("node:assert/strict");
const router = express.Router();
const crossSectionsHelper = require("../helperFiles/crossSectionsHelper.js");
const authenticateAdmin = require("../middleware/authenticate.js");
const { validate, nameValidationRules } = require("../middleware/sanitize.js");

/**
 * POST: Create a new CrossSection.
 * @route POST /crossSections
 * @param req Express request object, expecting 'name' in the request body.
 * @param res Express response object used for returning the created CrossSection.
 * @pre 'name' field must be provided and should be unique.
 * @pre A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @post A new CrossSection entity is created in the database.
 * @return Returns the newly created CrossSection object.
 */
router.post(
	"/",
	authenticateAdmin,
	nameValidationRules(),
	validate,
	async (req, res) => {
		const response = await crossSectionsHelper.newCrossSection(req);
		if (response instanceof Error) {
			return res
				.status(response instanceof assert.AssertionError ? 400 : 500)
				.json({ error: response.message });
		}
		return res.json(response);
	},
);

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
	const response = await crossSectionsHelper.getAllCrossSections();
	if (response instanceof Error) {
		return res.status(500).json({ error: response.message });
	}
	return res.json(response);
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
	const response = await crossSectionsHelper.getCrossSectionById(req);
	if (response instanceof Error) {
		return res.status(500).json({ error: response.message });
	}
	return res.json(response);
});

/**
 * PUT: Update an existing CrossSection.
 * @route PUT /crossSections/:id
 * @param req Express request object containing the new 'name' for the CrossSection.
 * @param res Express response object used for returning the updated CrossSection.
 * @pre The CrossSection with the given ID must exist in the database.
 * @pre A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @post Updates and returns the specified CrossSection in the database.
 * @return Returns the updated CrossSection object or a message indicating the CrossSection was not found.
 */
router.put(
	"/:id",
	authenticateAdmin,
	nameValidationRules(),
	validate,
	async (req, res) => {
		const response = await crossSectionsHelper.updateCrossSection(req);
		if (response instanceof Error) {
			return res.status(500).json({ error: response.message });
		}
		return res.json(response);
	},
);

/**
 * DELETE: Remove a CrossSection.
 * @route DELETE /crossSections/:id
 * @param req Express request object, expecting 'id' as a route parameter.
 * @param res Express response object used for signaling the result of the deletion operation.
 * @pre The CrossSection with the given ID must exist in the database.
 * @pre A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @post Deletes the specified CrossSection from the database.
 * @return Returns a message indicating success or failure of the deletion.
 */
router.delete("/:id", authenticateAdmin, async (req, res) => {
	const response = await crossSectionsHelper.deleteCrossSection(req);
	if (response instanceof Error) {
		return res.status(500).json({ error: response.message });
	}
	return res.status(204).send(); // No Content
});

module.exports = router;
