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
    res.json(newBaseShape);
  } catch (error) {
    console.error("Error creating new BaseShape:", error);
    res.json({ error: error.message });
  }
});

// GET: Fetch all BaseShapes
router.get("/", async (req, res) => {
  try {
    const BaseShapeRepository = await myDatabase.getRepository(BaseShape);
    const BaseShapes = await BaseShapeRepository.find({
      relations: ["projectilePoints"],
    });
    if (BaseShapes) {
      res.json(BaseShapes);
    } else {
      res.send("BaseShapes not found");
    }
  } catch (error) {
    console.error("Error fetching BaseShapes:", error);
    res.json({ error: error.message });
  }
});

// GET: Fetch all BaseShapes by ID
router.get("/:id", async (req, res) => {
  try {
    const baseShapeRepository = await myDatabase.getRepository(BaseShape);
    const baseShape = await baseShapeRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["projectilePoints"],
    });
    if (baseShape) {
      res.json(baseShape);
    } else {
      res.send("BaseShape not found");
    }
  } catch (error) {
    console.error("Error fetching BaseShape:", error);
    res.json({ error: error.message });
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
      res.json({ message: "BaseShape not found" });
    }
  } catch (error) {
    console.error("Error updating BaseShape:", error);
    res.json({ error: error.message });
  }
});

// DELETE: Remove a BaseShape
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const BaseShapeRepository = await myDatabase.getRepository(BaseShape);
    const deleteResult = await BaseShapeRepository.delete(id);
    if (deleteResult.affected > 0) {
      res.send();
    } else {
      res.json({ message: "BaseShape not found" });
    }
  } catch (error) {
    console.error("Error deleting BaseShape:", error);
    res.json({ error: error.message });
  }
});

module.exports = router;
