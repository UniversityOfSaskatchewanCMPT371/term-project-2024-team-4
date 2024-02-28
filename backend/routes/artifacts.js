const { Artifact, Site, ArtifactType } = require("../dist/entity");
const express = require("express");
const router = express.Router();
const myDatabase = require("../config/db");

// POST: Create a new Artifact
router.post("/", async (req, res) => {
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
			return res.json({ message: "Site or ArtifactType not found" });
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
		res.json(artifact);
	} catch (error) {
		console.error("Error creating Artifact:", error);
		res.json({ error: error.message });
	}
});

// GET: Fetch all Artifacts
router.get("/", async (req, res) => {
	try {
		const artifactRepository = await myDatabase.getRepository(Artifact);
		const artifacts = await artifactRepository.find({
			relations: ["site", "artifactType"],
		});
		if (Artifact) {
			res.json(artifacts);
		} else {
			res.send("Artifacts not found");
		}
	} catch (error) {
		console.error("Error fetching Artifacts:", error);
		res.json({ error: error.message });
	}
});

// GET: Fetch a single Artifact
router.get("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const artifact = await myDatabase.getRepository(Artifact).findOne({
			where: { id },
			relations: ["site", "artifactType"],
		});
		if (!artifact) {
			res.json({ message: "Artifact not found" });
		} else {
			res.json(artifact);
		}
	} catch (error) {
		console.error("Error fetching Artifact:", error);
		res.json({ error: error.message });
	}
});

// PUT: Update an existing Artifact
router.put("/:id", async (req, res) => {
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
			return res.json({ message: "Artifact not found" });
		}

		if (siteId) {
			const site = await myDatabase
				.getRepository(Site)
				.findOneBy({ id: siteId });
			if (!site) {
				return res.json({ message: "Site not found" });
			}
			artifact.site = site;
		}

		if (artifactTypeId) {
			const artifactType = await myDatabase
				.getRepository(ArtifactType)
				.findOneBy({ id: artifactTypeId });
			if (!artifactType) {
				return res.json({ message: "ArtifactType not found" });
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
		res.json(artifact);
	} catch (error) {
		console.error("Error updating Artifact:", error);
		res.json({ error: error.message });
	}
});

// DELETE: Delete a single Artifact
router.delete("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const artifactRepository = await myDatabase.getRepository(Artifact);
		const deleteResult = await artifactRepository.delete(id);

		if (deleteResult.affected > 0) {
			res.send();
		} else {
			res.json({ message: "Artifact not found" });
		}
	} catch (error) {
		console.error("Error deleting Artifact:", error);
		res.json({ error: error.message });
	}
});

// GET: Fetch Sites by Location
router.get("/:name", async (req, res) => {
	const { name } = req.params; // geting the query
	try {
		const artifactRepository = await myDatabase.getRepository(Artifact);
		// get the name of all the sites with location
		const sites = await artifactRepository.find({
			where: { name },
			select: ["photo"],
		});
		if (sites.length > 0) {
			const siteNames = sites.map((site) => site.name);
			// 200 found the sites with given location
			res.status(200).json(siteNames);
		} else {
			// 404 not found the location and sites
			res.status(404).send("Not available");
		}
	} catch (error) {
		console.error("Error fetching Sites:", error);
		// 500 error while fetching the sites
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
