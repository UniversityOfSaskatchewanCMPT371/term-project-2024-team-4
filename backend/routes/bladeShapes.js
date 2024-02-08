const { BladeShape } = require("../dist/entity");
const express = require("express");
const router = express.Router();
const myDatabase = require("../config/db");

myDatabase
  .initialize()
  .then(() => {
    console.log("Database has been initialized.");
  })
  .catch((error) => {
    console.error("Database initialization failed:", error);
  });

// GET: Fetch all BladeShapes
router.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    const bladeShapeRepository = await myDatabase.getRepository(BladeShape);
    const newBladeShape = bladeShapeRepository.create({ name });
    await bladeShapeRepository.save(newBladeShape);
    res.status(201).json(newBladeShape);
  } catch (error) {
    console.error("Error creating new BladeShape:", error);
    res.status(400).json({ error: error.message });
  }
});

// GET: Fetch all BladeShapes by ID
router.get("/", async (req, res) => {
  try {
    const bladeShapeRepository = await myDatabase.getRepository(BladeShape);
    const bladeShapes = await bladeShapeRepository.find({
      // relations: ["cultures", "projectilePoints"],
    });
    res.json(bladeShapes);
  } catch (error) {
    console.error("Error fetching BladeShapes:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST: Create a new BladeShape
router.get("/:id", async (req, res) => {
  try {
    const bladeShapeRepository = await myDatabase.getRepository(BladeShape);
    const bladeShape = await bladeShapeRepository.findOne({
      where: { id: parseInt(req.params.id) },
      // relations: ["cultures", "projectilePoints"],
    });
    if (bladeShape) {
      res.json(bladeShape);
    } else {
      res.status(404).send("BladeShape not found");
    }
  } catch (error) {
    console.error("Error fetching BladeShape:", error);
    res.status(500).json({ error: error.message });
  }
});

// PUT: Update an existing BladeShape
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const bladeShapeRepository = await myDatabase.getRepository(BladeShape);
    let bladeShapeToUpdate = await bladeShapeRepository.findOneBy({
      id: parseInt(id),
    });
    if (bladeShapeToUpdate) {
      bladeShapeToUpdate.name = name;
      await bladeShapeRepository.save(bladeShapeToUpdate);
      res.json(bladeShapeToUpdate);
    } else {
      res.status(404).json({ message: "BladeShape not found" });
    }
  } catch (error) {
    console.error("Error updating BladeShape:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE: Remove a BladeShape
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const bladeShapeRepository = await myDatabase.getRepository(BladeShape);
    const deleteResult = await bladeShapeRepository.delete(id);
    if (deleteResult.affected > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "BladeShape not found" });
    }
  } catch (error) {
    console.error("Error deleting BladeShape:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
