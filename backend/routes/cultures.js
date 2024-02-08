const { Culture, Period } = require("../dist/entity");
const express = require("express");
const router = express.Router();
const myDatabase = require("../config/db");

// POST: Create a new Culture
router.post("/", async (req, res) => {
  const { name, periodId } = req.body;
  try {
    const cultureRepository = await myDatabase.getRepository(Culture);
    const period = await myDatabase
      .getRepository(Period)
      .findOneBy({ id: periodId });
    if (!period) {
      return res.status(404).json({ message: "Period not found" });
    }
    const newCulture = cultureRepository.create({ name, period });
    await cultureRepository.save(newCulture);
    res.status(201).json(newCulture);
  } catch (error) {
    console.error("Error creating new Culture:", error);
    res.status(400).json({ error: error.message });
  }
});

// GET: Fetch all Cultures
router.get("/", async (req, res) => {
  try {
    const cultureRepository = await myDatabase.getRepository(Culture);
    const cultures = await cultureRepository.find({
      relations: [
        "period",
        "projectilePoints",
        "bladeShapes",
        "baseShapes",
        "haftingShapes",
        "CrossSections",
      ],
    });
    res.json(cultures);
  } catch (error) {
    console.error("Error fetching Cultures:", error);
    res.json({ error: error.message });
  }
});

// GET: Fetch all Cultures by ID
router.get("/:id", async (req, res) => {
  try {
    const cultureRepository = await myDatabase.getRepository(Culture);
    const culture = await cultureRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: [
        "period",
        "projectilePoints",
        "bladeShapes",
        "baseShapes",
        "haftingShapes",
        "CrossSections",
      ],
    });
    if (culture) {
      res.json(culture);
    } else {
      res.send("Culture not found");
    }
  } catch (error) {
    console.error("Error fetching Culture:", error);
    res.json({ error: error.message });
  }
});

//  GET: Fetch all Cultures by ID
router.get("/:id", async (req, res) => {
  try {
    const cultureRepository = await myDatabase.getRepository(Culture);
    const culture = await cultureRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: [
        "period",
        "projectilePoints",
        "bladeShapes",
        "baseShapes",
        "haftingShapes",
        "crossSections",
      ],
    });
    if (culture) {
      res.json(culture);
    } else {
      res.send("Culture not found");
    }
  } catch (error) {
    console.error("Error fetching Culture:", error);
    res.json({ error: error.message });
  }
});

// PUT: Update a Culture
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, periodId } = req.body; // Assume updating name and period
  try {
    const cultureRepository = await myDatabase.getRepository(Culture);
    let cultureToUpdate = await cultureRepository.findOneBy({
      id: parseInt(id),
    });
    if (!cultureToUpdate) {
      return res.json({ message: "Culture not found" });
    }
    if (periodId) {
      const period = await myDatabase
        .getRepository(Period)
        .findOneBy({ id: periodId });
      if (!period) {
        return res.json({ message: "Period not found" });
      }
      cultureToUpdate.period = period;
    }
    cultureToUpdate.name = name;
    await cultureRepository.save(cultureToUpdate);
    res.json(cultureToUpdate);
  } catch (error) {
    console.error("Error updating Culture:", error);
    res.json({ error: error.message });
  }
});

// DELETE: Remove a Culture
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const cultureRepository = await myDatabase.getRepository(Culture);
    const deleteResult = await cultureRepository.delete(id);
    if (deleteResult.affected > 0) {
      res.send();
    } else {
      res.json({ message: "Culture not found" });
    }
  } catch (error) {
    console.error("Error deleting Culture:", error);
    res.json({ error: error.message });
  }
});

module.exports = router;
