const { ArtifactType } = require("../dist/entity");
const express = require("express");
const router = express.Router();
const myDatabase = require("../config/db");

// POST: Create a new ArtifactType
router.post("/", async (req, res) => {
  const { id } = req.body; // 'Lithic', 'Ceramic', or 'Faunal'
  try {
    const artifactTypeRepository = await myDatabase.getRepository(ArtifactType);
    // Validate the id
    if (!["Lithic", "Ceramic", "Faunal"].includes(id)) {
      return res.json({ message: "Invalid ArtifactType ID." });
    }
    // Check if the ArtifactType already exists
    const existingType = await artifactTypeRepository.findOneBy({ id });
    if (existingType) {
      return res.json({ message: "ArtifactType already exists." });
    }
    const artifactType = artifactTypeRepository.create({ id });
    await artifactTypeRepository.save(artifactType);
    res.json(artifactType);
  } catch (error) {
    console.error("Error creating ArtifactType:", error);
    res.json({ error: error.message });
  }
});

// GET: Fetch all ArtifactTypes
router.get("/", async (req, res) => {
  try {
    const artifactTypeRepository = await myDatabase.getRepository(ArtifactType);
    const artifactTypes = await artifactTypeRepository.find({
      relations: ["materials", "artifacts"],
    });
    res.json(artifactTypes);
  } catch (error) {
    console.error("Error fetching ArtifactTypes:", error);
    res.json({ error: error.message });
  }
});

// GET: Fetch a single ArtifactType
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const artifactTypeRepository = await myDatabase.getRepository(ArtifactType);
    const artifactType = await artifactTypeRepository.findOne({
      where: { id },
      relations: ["materials", "artifacts"],
    });
    if (artifactType) {
      res.json(artifactType);
    } else {
      res.json({ message: "ArtifactType not found" });
    }
  } catch (error) {
    console.error("Error fetching ArtifactType:", error);
    res.json({ error: error.message });
  }
});

// DELETE: Delete a single ArtifactType
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const artifactTypeRepository = await myDatabase.getRepository(ArtifactType);
    const result = await artifactTypeRepository.delete(id);
    if (result.affected > 0) {
      res.send();
    } else {
      res.json({ message: "ArtifactType not found" });
    }
  } catch (error) {
    console.error("Error deleting ArtifactType:", error);
    res.json({ error: error.message });
  }
});

module.exports = router;
