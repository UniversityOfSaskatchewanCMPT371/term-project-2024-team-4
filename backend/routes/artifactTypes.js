const express = require("express");
const router = express.Router();
const artifactTypesHelper = require("../helperFiles/artifactTypesHelper");

// POST: Create a new ArtifactType
router.post("/", async (req, res) => {
	const artifactTypeResult = await artifactTypesHelper.newArtifactType(req);
	if (artifactTypeResult === "Invalid ArtifactType ID.") {
		return res.json({ message: "Invalid ArtifactType ID." });
	}
	if (artifactTypeResult === "ArtifactType already exists.") {
		return res.json({ message: "ArtifactType already exists." });
	}
	if (artifactTypeResult instanceof Error) {
		res.json({ error: artifactTypeResult.message });
	}
	res.json(artifactTypeResult);
});

// GET: Fetch all ArtifactTypes
router.get("/", async (req, res) => {
	const artifactTypes = await artifactTypesHelper.getAllArtifactTypes();
	if (artifactTypes instanceof Error) {
		res.json({ error: artifactTypes.message });
	}
	res.json(artifactTypes);
});

// GET: Fetch a single ArtifactType
router.get("/:id", async (req, res) => {
	const artifactType = await artifactTypesHelper.getArtifactTypeFromId(req);
	if (artifactType === "ArtifactType not found") {
		res.json({ message: "ArtifactType not found" });
	}
	if (artifactType instanceof Error) {
		res.json({ error: artifactType.message });
	}
	res.json(artifactType);
});

// DELETE: Delete a single ArtifactType
router.delete("/:id", async (req, res) => {
	const result = await artifactTypesHelper.deleteArtifactType(req);
	if (result === "ArtifactType not found") {
		res.json({ message: "ArtifactType not found" });
	}
	if (result instanceof Error) {
		res.json({ error: result.message });
	}
});

module.exports = router;
