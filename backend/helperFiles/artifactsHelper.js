/* eslint-disable indent */
const { Artifact, Site, ArtifactType } = require("../dist/entity");
const myDatabase = require("../config/db");
const { logger } = require("../config/logger.js");
const assert = require("node:assert/strict");

/**
 * Creates a new Artifact in the database.
 * @param req Express request object containing Artifact data: name, location, description, dimensions, photo, siteId, artifactTypeId, subtype.
 * @pre The request body must contain valid Artifact data fields.
 * @post Creates a new Artifact entity in the database, returns it with a 201 status code upon successful creation, or provides an error response.
 * @return The newly created Artifact object if successful, otherwise an error object.
 */
async function newArtifact(req) {
	const {
		name,
		location,
		description,
		dimensions,
		photo,
		siteId,
		artifactTypeId,
		subtype,
	} = req.body;

	assert.ok(
		name &&
			location &&
			description &&
			dimensions &&
			photo &&
			siteId &&
			artifactTypeId,
		"Required artifact data fields are missing.",
	);

	try {
		const artifactRepository = await myDatabase.getRepository(Artifact);
		const site = await myDatabase.getRepository(Site).findOneBy({ id: siteId });
		const artifactType = await myDatabase
			.getRepository(ArtifactType)
			.findOneBy({ id: artifactTypeId });

		assert.ok(site, "Site not found.");
		assert.ok(artifactType, "ArtifactType not found.");

		const artifact = artifactRepository.create({
			name,
			location,
			description,
			dimensions,
			photo,
			site,
			artifactType,
			subtype,
		});

		await artifactRepository.save(artifact);
		logger.info("New artifact created: " + name);
		return artifact;
	} catch (error) {
		logger.error("Error creating Artifact: " + error.message);
		return error;
	}
}

/**
 * Retrieves all artifacts from the database.
 * @pre None.
 * @post Returns an array of all Artifact entities found or a suitable error response.
 * @return An array of Artifact objects if successful, otherwise an error object.
 */
async function getAllArtifacts() {
	try {
		const artifactRepository = await myDatabase.getRepository(Artifact);
		const artifacts = await artifactRepository.find({
			relations: ["site", "artifactType", "material"],
		});

		assert.ok(artifacts.length > 0, "No artifacts found.");
		logger.info("Fetched all artifacts.");
		return artifacts;
	} catch (error) {
		logger.error("Error fetching Artifacts: " + error.message);
		return error;
	}
}

/**
 * Fetches a single Artifact identified by ID from the database.
 * @param req Express request object containing the ID of the Artifact to be fetched.
 * @pre The Artifact with the specified ID must exist in the database.
 * @post Retrieves and returns the specified Artifact entity from the database including its relations 'site' and 'artifactType'. If no Artifact is found with the given ID, a 404 Not Found error is returned. On server errors, a 500 Internal Server Error is returned.
 * @return Returns the requested Artifact object if successful; otherwise, returns an error message.
 */
async function getArtifactFromId(req) {
	const { id } = req.params;
	try {
		const artifact = await myDatabase.getRepository(Artifact).findOne({
			where: { id },
			relations: ["site", "artifactType"],
		});

		assert.ok(artifact, "Artifact not found");
		logger.info(`Fetched artifact with ID: ${id}`);
		return artifact;
	} catch (error) {
		logger.error(`Error fetching Artifact with ID ${id}: ${error.message}`);
		return error;
	}
}

/**
 * Updates an existing Artifact in the database.
 * @param req Express request object containing the ID of the Artifact to be updated and the new data for the Artifact.
 * @pre The Artifact with the specified ID must exist in the database. The request body must contain valid data fields for updating the Artifact.
 * @post Updates the specified Artifact entity in the database with the new provided data, and returns the updated Artifact. If no Artifact is found with the given ID, a 404 Not Found error is returned. On validation failure, a 400 Bad Request error is returned. On server errors, a 500 Internal Server Error is returned.
 * @return Returns the updated Artifact object if successful; otherwise, returns an error message.
 */
async function updateArtifact(req) {
	const { id } = req.params;
	const {
		name,
		location,
		description,
		dimensions,
		photo,
		siteId,
		artifactTypeId,
		subtype,
	} = req.body;
	try {
		const artifactRepository = await myDatabase.getRepository(Artifact);
		let artifact = await artifactRepository.findOneBy({ id });

		assert.ok(artifact, "Artifact not found");

		const site = siteId
			? await myDatabase.getRepository(Site).findOneBy({ id: siteId })
			: null;
		const artifactType = artifactTypeId
			? await myDatabase
					.getRepository(ArtifactType)
					.findOneBy({ id: artifactTypeId })
			: null;

		artifact.name = name || artifact.name;
		artifact.location = location || artifact.location;
		artifact.description = description || artifact.description;
		artifact.dimensions = dimensions || artifact.dimensions;
		artifact.photo = photo || artifact.photo;
		artifact.site = site || artifact.site;
		artifact.artifactType = artifactType || artifact.artifactType;
		artifact.subtype = subtype || artifact.subtype;

		await artifactRepository.save(artifact);
		logger.info(`Updated artifact with ID: ${id}`);
		return artifact;
	} catch (error) {
		logger.error(`Error updating Artifact with ID ${id}: ${error.message}`);
		return error;
	}
}

/**
 * Deletes a single Artifact identified by ID from the database.
 * @param req Express request object containing the ID of the Artifact to be deleted.
 * @pre The Artifact with the specified ID must exist in the database.
 * @post Removes the specified Artifact entity from the database. If the Artifact is successfully deleted, a 204 No Content response is returned to signify successful deletion without returning any content. If no Artifact is found with the given ID, a 404 Not Found error is returned. On server errors, a 500 Internal Server Error is returned.
 * @return Does not return any content on success; otherwise, returns an error message.
 */
async function deleteArtifact(req) {
	const { id } = req.params;
	try {
		const artifactRepository = await myDatabase.getRepository(Artifact);
		const deleteResult = await artifactRepository.delete(id);

		assert.strictEqual(deleteResult.affected > 0, true, "Artifact not found");
		logger.info(`Deleted artifact with ID: ${id}`);
		return;
	} catch (error) {
		logger.error(`Error deleting Artifact with ID ${id}: ${error.message}`);
		return error;
	}
}

module.exports = {
	newArtifact,
	getAllArtifacts,
	getArtifactFromId,
	updateArtifact,
	deleteArtifact,
};
