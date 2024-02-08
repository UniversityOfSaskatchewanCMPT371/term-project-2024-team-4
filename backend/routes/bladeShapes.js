const { BladeShape } = require("../dist/entity");
const express = require("express");
const router = express.Router();
const myDatabase = require("../config/db");

// POST: Create a new BladeShape
router.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    const bladeShapeRepository = await myDatabase.getRepository(BladeShape);
    const newBladeShape = bladeShapeRepository.create({ name });
    await bladeShapeRepository.save(newBladeShape);
    res.json(newBladeShape);
  } catch (error) {
    console.error("Error creating new BladeShape:", error);
    res.json({ error: error.message });
  }
});

// GET: Fetch all BladeShapes
router.get("/", async (req, res) => {
  try {
    const bladeShapeRepository = await myDatabase.getRepository(BladeShape);
    /**
     * bladeShapeRepository.createQueryBuilder(BladeShape)
    .leftJoinAndSelect("culture.bladeShapes", "culture")
    .getMany();
     */
    const bladeShapes = await bladeShapeRepository.find({
      // relations: ["cultures", "projectilePoints"]
      relations: ["projectilePoints"],
    });
    res.json(bladeShapes);
  } catch (error) {
    console.error("Error fetching BladeShapes:", error);
    res.json({ error: error.message });
  }
});

// GET: Fetch all BladeShapes by ID
router.get("/:id", async (req, res) => {
  try {
    const bladeShapeRepository = await myDatabase.getRepository(BladeShape);
    const bladeShape = await bladeShapeRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["projectilePoints"],
    });
    if (bladeShape) {
      res.json(bladeShape);
    } else {
      res.send("BladeShape not found");
    }
  } catch (error) {
    console.error("Error fetching BladeShape:", error);
    res.json({ error: error.message });
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
      res.json({ message: "BladeShape not found" });
    }
  } catch (error) {
    console.error("Error updating BladeShape:", error);
    res.json({ error: error.message });
  }
});

// DELETE: Remove a BladeShape
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const bladeShapeRepository = await myDatabase.getRepository(BladeShape);
    const deleteResult = await bladeShapeRepository.delete(id);
    if (deleteResult.affected > 0) {
      res.send();
    } else {
      res.json({ message: "BladeShape not found" });
    }
  } catch (error) {
    console.error("Error deleting BladeShape:", error);
    res.json({ error: error.message });
  }
});

module.exports = router;
