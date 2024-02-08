const { HaftingShape } = require("../dist/entity");
const express = require("express");
const router = express.Router();
const myDatabase = require("../config/db");

// POST: Create a new HaftingShape
router.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    const HaftingShapeRepository = await myDatabase.getRepository(HaftingShape);
    const newHaftingShape = HaftingShapeRepository.create({ name });
    await HaftingShapeRepository.save(newHaftingShape);
    res.json(newHaftingShape);
  } catch (error) {
    console.error("Error creating new HaftingShape:", error);
    res.json({ error: error.message });
  }
});

// GET: Fetch all HaftingShapes
router.get("/", async (req, res) => {
  try {
    const HaftingShapeRepository = await myDatabase.getRepository(HaftingShape);
    const HaftingShapes = await HaftingShapeRepository.find({
      relations: ["projectilePoints"],
    });
    res.json(HaftingShapes);
  } catch (error) {
    console.error("Error fetching HaftingShapes:", error);
    res.json({ error: error.message });
  }
});

// GET: Fetch all HaftingShapes by ID
router.get("/:id", async (req, res) => {
  try {
    const haftingShapeRepository = await myDatabase.getRepository(HaftingShape);
    const haftingShape = await haftingShapeRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["projectilePoints"],
    });
    if (haftingShape) {
      res.json(haftingShape);
    } else {
      res.send("HaftingShape not found");
    }
  } catch (error) {
    console.error("Error fetching HaftingShape:", error);
    res.json({ error: error.message });
  }
});

// PUT: Update an existing HaftingShape
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const HaftingShapeRepository = await myDatabase.getRepository(HaftingShape);
    let HaftingShapeToUpdate = await HaftingShapeRepository.findOneBy({
      id: parseInt(id),
    });
    if (HaftingShapeToUpdate) {
      HaftingShapeToUpdate.name = name;
      await HaftingShapeRepository.save(HaftingShapeToUpdate);
      res.json(HaftingShapeToUpdate);
    } else {
      res.json({ message: "HaftingShape not found" });
    }
  } catch (error) {
    console.error("Error updating HaftingShape:", error);
    res.json({ error: error.message });
  }
});

// DELETE: Remove a HaftingShape
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const HaftingShapeRepository = await myDatabase.getRepository(HaftingShape);
    const deleteResult = await HaftingShapeRepository.delete(id);
    if (deleteResult.affected > 0) {
      res.send();
    } else {
      res.json({ message: "HaftingShape not found" });
    }
  } catch (error) {
    console.error("Error deleting HaftingShape:", error);
    res.json({ error: error.message });
  }
});

module.exports = router;
