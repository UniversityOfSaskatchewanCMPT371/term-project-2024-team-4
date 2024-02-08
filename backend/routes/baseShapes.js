const { BaseShape } = require("../dist/entity");
const express = require("express");
const router = express.Router();
const myDatabase = require("../config/db");

// POST: Create a new BaseShape
router.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    const BaseShapeRepository = await myDatabase.getRepository(BaseShape);
    const newBaseShape = BaseShapeRepository.create({ name });
    await BaseShapeRepository.save(newBaseShape);
    res.status(201).json(newBaseShape);
  } catch (error) {
    console.error("Error creating new BaseShape:", error);
    res.status(400).json({ error: error.message });
  }
});

// GET: Fetch all BaseShapes
router.get("/", async (req, res) => {
  try {
    const BaseShapeRepository = await myDatabase.getRepository(BaseShape);
    const BaseShapes = await BaseShapeRepository.find({
      // relations: ["cultures", "projectilePoints"],
    });
    res.json(BaseShapes);
  } catch (error) {
    console.error("Error fetching BaseShapes:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET: Fetch all BaseShapes by ID
router.get("/:id", async (req, res) => {
  try {
    const baseShapeRepository = await myDatabase.getRepository(BaseShape);
    const baseShape = await baseShapeRepository.findOne({
      where: { id: parseInt(req.params.id) }
      // relations: ["cultures", "projectilePoints"],
    });
    if (baseShape) {
      res.json(baseShape);
    } else {
      res.status(404).send("BaseShape not found");
    }
  } catch (error) {
    console.error("Error fetching BaseShape:", error);
    res.status(500).json({ error: error.message });
  }
});


// PUT: Update an existing BaseShape
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const BaseShapeRepository = await myDatabase.getRepository(BaseShape);
    let BaseShapeToUpdate = await BaseShapeRepository.findOneBy({
      id: parseInt(id),
    });
    if (BaseShapeToUpdate) {
      BaseShapeToUpdate.name = name;
      await BaseShapeRepository.save(BaseShapeToUpdate);
      res.json(BaseShapeToUpdate);
    } else {
      res.status(404).json({ message: "BaseShape not found" });
    }
  } catch (error) {
    console.error("Error updating BaseShape:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE: Remove a BaseShape
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const BaseShapeRepository = await myDatabase.getRepository(BaseShape);
    const deleteResult = await BaseShapeRepository.delete(id);
    if (deleteResult.affected > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "BaseShape not found" });
    }
  } catch (error) {
    console.error("Error deleting BaseShape:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
