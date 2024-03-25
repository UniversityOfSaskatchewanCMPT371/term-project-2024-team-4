const express = require("express");
const router = express.Router();
const materialsHelper = require("../helperFiles/materialsHelper.js");

// POST: create a new Material
router.post("/", async (req, res) => {
	const response = await materialsHelper.newMaterial(req);
	if (response === "ArtifactType not found") {
		res.json({ message: "ArtifactType not found" });
	}
	if (response instanceof Error) {
		res.json({ error: response.message });
	}
	res.json(response);
});

// GET: Fetch all Materials
router.get("/", async (req, res) => {
	const response = await materialsHelper.getAllMaterials();
	if (response instanceof Error) {
		res.json({ error: response.message });
	}
	res.json(response);
});

// GET: Fetch a single Material
router.get("/:id", async (req, res) => {
	const response = await materialsHelper.getMaterialById(req);
	if (response === "Material not found") {
		res.json({ message: "Material not found" });
	}
	if (response instanceof Error) {
		res.json({ error: response.message });
	}
	res.json(response);
});

// PUT: Update a single Material
router.put("/:id", async (req, res) => {
	const response = await materialsHelper.updateMaterial(req);
	if (response === "Material not found") {
		res.json({ message: "Material not found" });
	}
	if (response === "ArtifactType not found") {
		res.json({ message: "ArtifactType not found" });
	}
	if (response instanceof Error) {
		res.json({ error: response.message });
	}
	res.json(response);
});

// DELETE: Delete a single Material
router.delete("/:id", async (req, res) => {
	const response = await materialsHelper.deleteMaterial(req);
	if (response === "Material not found") {
		res.json({ message: "Material not found" });
	}
	if (response instanceof Error) {
		res.json({ error: response.message });
	}
	res.send();
});

module.exports = router;
