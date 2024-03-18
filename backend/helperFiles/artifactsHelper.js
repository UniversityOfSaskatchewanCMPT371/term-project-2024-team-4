const { Artifact, Site, ArtifactType } = require("../dist/entity");
const myDatabase = require("../config/db");

/**
 * Creates a new artifact in the database
 * @param {*} req - the request
 */
async function newArtifact(req) {
	console.log("creating new artifact: " + req.body);
	// Extract the information from the request body
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
		// Use database connection to get the necessary repositories
		const artifactRepository = await myDatabase.getRepository(Artifact);
		const site = await myDatabase.getRepository(Site).findOneBy({ id: siteId });
		const artifactType = await myDatabase
			.getRepository(ArtifactType)
			.findOneBy({ id: artifactTypeId });
		// If the site or artifactType is not found, return a 404
		if (!site || !artifactType) {
			return "Site or ArtifactType not found";
			//return res.json({ message: "Site or ArtifactType not found" });
		}

		// If the site and artifactType exist, creates a new Artifact entity with the given information
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
		// Save the new Artifact entity to the database
		await artifactRepository.save(artifact);
		return artifact;
		//res.json(artifact);
	} catch (error) {
		console.error("Error creating Artifact:", error);
		return error;
		//res.json({ error: error.message });
	}
}

/**
 * Gets all artifacts in the database.
 */
async function getAllArtifacts() {
	console.log("Getting All Artifacts");
	try {
		const artifactRepository = await myDatabase.getRepository(Artifact);
		const artifacts = await artifactRepository.find({
			relations: ["site", "artifactType", "site.artifacts"],
		});
		if (Artifact) {
			return artifacts;
			//res.json(artifacts);
		} else {
			return "Artifacts not found";
		}
	} catch (error) {
		console.error("Error fetching Artifacts:", error);
		return error;
		//res.json({ error: error.message });
	}
}

/**
 * get a single artifact that matches the given id
 * @param {*} req - the id requested
 */
async function getArtifactFromId(req) {
	console.log("Getting artifact from id: " + req.params);
	const { id } = req.params;
	try {
		const artifact = await myDatabase.getRepository(Artifact).findOne({
			where: { id },
			relations: ["site", "artifactType"],
		});
		if (!artifact) {
			return "Artifact not found";
			//res.json({ message: "Artifact not found" });
		} else {
			return artifact;
			//res.json(artifact);
		}
	} catch (error) {
		console.error("Error fetching Artifacts:", error);
		return error;
		//res.json({ error: error.message });
	}
}

/**
 * update a given artifact with new given information
 * @param {*} req - the request
 */
async function updateArtifact(req) {
	console.log("Updating Artifact Id: " + req.params);
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

		if (!artifact) {
			return "Artifact not found";
			//return res.json({ message: "Artifact not found" });
		}

		if (siteId) {
			const site = await myDatabase
				.getRepository(Site)
				.findOneBy({ id: siteId });
			if (!site) {
				return "Site not found";
				//return res.json({ message: "Site not found" });
			}
			artifact.site = site;
		}

		if (artifactTypeId) {
			const artifactType = await myDatabase
				.getRepository(ArtifactType)
				.findOneBy({ id: artifactTypeId });
			if (!artifactType) {
				return "ArtifactType not found";
				//return res.json({ message: "ArtifactType not found" });
			}
			artifact.artifactType = artifactType;
		}

		// Update fields
		artifact.name = name;
		artifact.location = location;
		artifact.description = description;
		artifact.dimensions = dimensions;
		artifact.photo = photo;
		artifact.subtype = subtype;

		await artifactRepository.save(artifact);
		return artifact;
		//res.json(artifact);
	} catch (error) {
		console.error("Error updating Artifact:", error);
		return error;
		//res.json({ error: error.message });
	}
}

/**
 * deletes the artifact that matches the given id.
 * @param {*} req - the request
 */
async function deleteArtifact(req) {
	console.log("Deleting Artifact Id: " + req.params);
	const { id } = req.params;
	try {
		const artifactRepository = await myDatabase.getRepository(Artifact);
		const deleteResult = await artifactRepository.delete(id);

		if (deleteResult.affected > 0) {
			return;
			//res.send();
		} else {
			return "Artifact not found";
			//res.json({ message: "Artifact not found" });
		}
	} catch (error) {
		console.error("Error deleting Artifact:", error);
		return error;
		//res.json({ error: error.message });
	}
}

module.exports = {
	newArtifact,
	getAllArtifacts,
	getArtifactFromId,
	updateArtifact,
	deleteArtifact,
};
