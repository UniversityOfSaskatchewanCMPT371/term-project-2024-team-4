/* eslint-disable indent */
const express = require("express");
const router = express.Router();
const artifactsHelper = require("../helperFiles/artifactsHelper.js");
const authenticateAdmin = require("../middleware/authenticate.js");
const {
	validate,
	artifactValidationRules,
} = require("../middleware/sanitize.js");

/**
 * Creates a new Artifact in the database.
 * @route POST /artifacts
 * @param req Express request object containing Artifact data: name, location, description, dimensions, photo, siteId, artifactTypeId, subtype.
 * @param res Express response object used for returning response.
 * @pre The request body must contain valid Artifact data fields.
 * @pre A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @post Creates a new Artifact entity in the database, returns it with a 201 status code upon successful creation, or provides an error response.
 * @return The newly created Artifact object if successful, otherwise an error object.
 */
router.post(
	"/",
	authenticateAdmin,
	artifactValidationRules(),
	validate,
	async (req, res) => {
		const response = await artifactsHelper.newArtifact(req);
		if (response instanceof Error) {
			return res.status(500).json({ error: response.message });
		}
		return res.status(201).json(response);
	},
);

/**
 * Retrieves all artifacts from the database.
 * @route GET /artifacts
 * @param req Express request object.
 * @param res Express response object used for returning response.
 * @pre None.
 * @post Returns an array of all Artifact entities found or a suitable error response.
 * @return An array of Artifact objects if successful, otherwise an error object.
 */
router.get("/", async (req, res) => {
	const response = await artifactsHelper.getAllArtifacts();
	if (response instanceof Error) {
		return res.status(500).json({ error: response.message });
	}
	return res.json(response);
});

/**
 * Fetches a single Artifact identified by ID from the database.
 * @route GET /artifacts/:id
 * @param req Express request object containing the ID of the Artifact to be fetched.
 * @param res Express response object used for returning the found Artifact or an error message.
 * @pre The Artifact with the specified ID must exist in the database.
 * @post Retrieves and returns the specified Artifact entity from the database including its relations 'site' and 'artifactType'. If no Artifact is found with the given ID, a 404 Not Found error is returned. On server errors, a 500 Internal Server Error is returned.
 * @return Returns the requested Artifact object if successful; otherwise, returns an error message.
 */
router.get("/:id", async (req, res) => {
	const response = await artifactsHelper.getArtifactFromId(req);
	if (response instanceof Error) {
		return res.status(500).json({ error: response.message });
	}
	return res.json(response);
});

/**
 * Updates an existing Artifact in the database.
 * @route PUT /artifacts/:id
 * @param req Express request object containing the ID of the Artifact to be updated and the new data for the Artifact.
 * @param res Express response object used for returning the updated Artifact or an error message.
 * @pre The Artifact with the specified ID must exist in the database. The request body must contain valid data fields for updating the Artifact.
 * @pre A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @post Updates the specified Artifact entity in the database with the new provided data, and returns the updated Artifact. If no Artifact is found with the given ID, a 404 Not Found error is returned. On validation failure, a 400 Bad Request error is returned. On server errors, a 500 Internal Server Error is returned.
 * @return Returns the updated Artifact object if successful; otherwise, returns an error message.
 */
router.put(
	"/:id",
	authenticateAdmin,
	artifactValidationRules(),
	validate,
	async (req, res) => {
		const response = await artifactsHelper.updateArtifact(req);
		if (response instanceof Error) {
			return res.status(500).json({ error: response.message });
		}
		return res.json(response);
	},
);

/**
 * Deletes a single Artifact identified by ID from the database.
 * @route DELETE /artifacts/:id
 * @param req Express request object containing the ID of the Artifact to be deleted.
 * @param res Express response object used for signaling the result of the deletion operation.
 * @pre The Artifact with the specified ID must exist in the database.
 * @pre A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @post Removes the specified Artifact entity from the database. If the Artifact is successfully deleted, a 204 No Content response is returned to signify successful deletion without returning any content. If no Artifact is found with the given ID, a 404 Not Found error is returned. On server errors, a 500 Internal Server Error is returned.
 * @return Does not return any content on success; otherwise, returns an error message.
 */
router.delete("/:id", authenticateAdmin, async (req, res) => {
	const response = await artifactsHelper.deleteArtifact(req);
	if (response instanceof Error) {
		return res.status(500).json({ error: response.message });
	}
	return res.send(); // No Content
});

module.exports = router;
