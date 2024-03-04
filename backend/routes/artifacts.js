const express = require("express");
const router = express.Router();
const artifactsHelper = require("../helperFiles/artifactsHelper.js");

// POST: Create a new Artifact
router.post("/", async (req, res) => {
	const artifact = await artifactsHelper.newArtifact(req);
	if (artifact === "Site or ArtifactType not found") {
		return res.json({ message: "Site or ArtifactType not found" });
	}
	if (artifact instanceof Error) {
		res.json({ error: artifact.message });
	}
	res.json(artifact);
});

// GET: Fetch all Artifacts
router.get("/", async (req, res) => {
	const artifacts = await artifactsHelper.getAllArtifacts();
	if (artifacts === "Artifacts not found") {
		res.send("Artifacts not found");
	}
	if (artifacts instanceof Error) {
		res.json({ error: artifacts.message });
	}
	res.json(artifacts);
});

// GET: Fetch a single Artifact
router.get("/:id", async (req, res) => {
	const artifact = await artifactsHelper.getArtifactFromId(req);
	if (artifact === "Artifact not found") {
		res.json({ message: "Artifact not found" });
	}
	if (artifact instanceof Error) {
		res.json({ error: artifact.message });
	}
	res.json(artifact);
});

// PUT: Update an existing Artifact
router.put("/:id", async (req, res) => {
	const artifact = await artifactsHelper.updateArtifact(req);
	if (artifact === "Artifact not found") {
		return res.json({ message: "Artifact not found" });
	}
	if (artifact === "Site not found") {
		return res.json({ message: "Site not found" });
	}
	if (artifact === "ArtifactType not found") {
		return res.json({ message: "ArtifactType not found" });
	}
	if (artifact instanceof Error) {
		res.json({ error: artifact.message });
	}
	res.json(artifact);
});

// DELETE: Delete a single Artifact
router.delete("/:id", async (req, res) => {
	const result = await artifactsHelper.deleteArtifact(req);
	if (result === "Artifact not Found") {
		res.json({ message: "Artifact not found" });
	}
	if (result instanceof Error) {
		res.json({ error: result.message });
	}
	res.send();
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
