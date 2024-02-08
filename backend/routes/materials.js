const { Material, ArtifactType } = require("../dist/entity");
const express = require("express");
const router = express.Router();
const myDatabase = require("../config/db");

// POST: create a new Material
router.post("/", async (req, res) => {
  const { name, description, artifactTypeId } = req.body;
  try {
    let artifactType = null;
    if (artifactTypeId) {
      artifactType = await myDatabase
        .getRepository(ArtifactType)
        .findOneBy({ id: artifactTypeId });
      if (!artifactType) {
        return res.status(404).json({ message: "ArtifactType not found" });
      }
    }

    const newMaterial = myDatabase.getRepository(Material).create({
      name,
      description,
      artifactType,
    });

    await myDatabase.getRepository(Material).save(newMaterial);
    res.status(201).json(newMaterial);
  } catch (error) {
    console.error("Error creating Material:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET: Fetch all Materials
router.get("/", async (req, res) => {
  try {
    const materials = await myDatabase.getRepository(Material).find({
      relations: ["artifactType", "artifacts"],
    });
    res.json(materials);
  } catch (error) {
    console.error("Error fetching Materials:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET: Fetch a single Material
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const material = await myDatabase.getRepository(Material).findOne({
      where: { id },
      relations: ["artifactType", "artifacts"],
    });
    if (!material) {
      res.status(404).json({ message: "Material not found" });
    } else {
      res.json(material);
    }
  } catch (error) {
    console.error("Error fetching Material:", error);
    res.status(500).json({ error: error.message });
  }
});

// PUT: Update a single Material
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, artifactTypeId } = req.body;
  try {
    let material = await myDatabase.getRepository(Material).findOneBy({ id });

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    if (artifactTypeId) {
      const artifactType = await myDatabase
        .getRepository(ArtifactType)
        .findOneBy({ id: artifactTypeId });
      if (!artifactType) {
        return res.status(404).json({ message: "ArtifactType not found" });
      }
      material.artifactType = artifactType;
    }

    material.name = name;
    material.description = description;

    await myDatabase.getRepository(Material).save(material);
    res.json(material);
  } catch (error) {
    console.error("Error updating Material:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE: Delete a single Material
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteResult = await myDatabase.getRepository(Material).delete(id);
    if (deleteResult.affected > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Material not found" });
    }
  } catch (error) {
    console.error("Error deleting Material:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
