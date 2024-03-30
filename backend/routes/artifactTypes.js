const express = require("express");
const assert = require("node:assert/strict");
const router = express.Router();
const artifactTypesHelper = require("../helperFiles/artifactTypesHelper.js");
const authenticateAdmin = require("../middleware/authenticate.js");

/**
 * Creates a new ArtifactType in the database.
 * @route POST /artifactTypes
 * @param req Express request object, expecting 'id' in the request body.
 * @param res Express response object used to return the newly created ArtifactType.
 * @pre The 'id' provided in the body must be one of the predetermined values ('Lithic', 'Ceramic', 'Faunal').
 * @pre A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @post A new ArtifactType is created and saved in the database.
 * @return Returns the newly created ArtifactType object or an error message.
 */
router.post("/", authenticateAdmin, async (req, res) => {
	const response = await artifactTypesHelper.newArtifactType(req);
	if (response instanceof Error) {
		res
			.status(response instanceof assert.AssertionError ? 400 : 500)
			.json({ message: response.message });
	}
	return res.status(201).json(response);
});

/**
 * Fetches all ArtifactTypes from the database.
 * @route GET /artifactTypes
 * @param req Express request object.
 * @param res Express response object used to return the fetched ArtifactTypes.
 * @pre None.
 * @post Retrieves and returns all ArtifactTypes from the database.
 * @return Returns an array of ArtifactType objects or an error message.
 */
router.get("/", async (req, res) => {
	const response = await artifactTypesHelper.getAllArtifactTypes();
	if (response instanceof Error) {
		return res.status(500).json({ error: response.message });
	}
	return res.json(response);
});

/**
 * Fetches a single ArtifactType identified by ID from the database.
 * @route GET /artifactTypes/:id
 * @param req Express request object, expecting 'id' as a parameter.
 * @param res Express response object used to return the fetched ArtifactType.
 * @pre The ArtifactType with the given ID must exist in the database.
 * @post Retrieves and returns the specified ArtifactType from the database.
 * @return Returns an ArtifactType object or an error message.
 */
router.get("/:id", async (req, res) => {
	const response = await artifactTypesHelper.getArtifactTypeFromId(req);
	if (response instanceof Error) {
		return res.status(500).json({ error: response.message });
	}
	return res.json(response);
});

/**
 * Deletes a single ArtifactType identified by ID from the database.
 * @route DELETE /artifactTypes/:id
 * @param req Express request object, expecting 'id' as a parameter.
 * @param res Express response object used for signaling the result of the deletion operation.
 * @pre The ArtifactType with the given ID must exist in the database.
 * @pre A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @post Deletes the specified ArtifactType from the database.
 * @return Does not return any content on successful deletion, otherwise returns an error message.
 */
router.delete("/:id", authenticateAdmin, async (req, res) => {
	const response = await artifactTypesHelper.deleteArtifactType(req);
	if (response instanceof Error) {
		return res.status(500).json({ error: response.message });
	}
	return res.send(); //No Content
});

module.exports = router;
