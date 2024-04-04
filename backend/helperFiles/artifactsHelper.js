/* eslint-disable indent */
const { Artifact, Site, ArtifactType } = require("../dist/entity");
const myDatabase = require("../config/db");
const { logger } = require("../config/logger.js");
const assert = require("node:assert/strict");

/**
 *
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
 *
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
 *
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
 *
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
 *
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
