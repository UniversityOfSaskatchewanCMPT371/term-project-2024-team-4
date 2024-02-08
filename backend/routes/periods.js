const { Period } = require("../dist/entity");
const express = require("express");
const router = express.Router();
const myDatabase = require("../config/db");

// POST: Create a New Period
router.post("/", async (req, res) => {
  const { name, start, end } = req.body;
  try {
    const periodRepository = await myDatabase.getRepository(Period);
    const newPeriod = periodRepository.create({ name, start, end });
    await periodRepository.save(newPeriod);
    res.json(newPeriod);
  } catch (error) {
    console.error("Error creating new Period:", error);
    res.json({ error: error.message });
  }
});

// GET: Fetch all Periods
router.get("/", async (req, res) => {
  try {
    const periodRepository = await myDatabase.getRepository(Period);
    const periods = await periodRepository.find({ relations: ["cultures"] });
    res.json(periods);
  } catch (error) {
    console.error("Error fetching Periods:", error);
    res.json({ error: error.message });
  }
});

// GET: Fetch a Period by ID
router.get("/:id", async (req, res) => {
  try {
    const periodRepository = await myDatabase.getRepository(Period);
    const period = await periodRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["cultures"],
    });
    if (period) {
      res.json(period);
    } else {
      res.send("Period not found");
    }
  } catch (error) {
    console.error("Error fetching Period:", error);
    res.json({ error: error.message });
  }
});

// PUT: Update an existing Period
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, start, end } = req.body;
  try {
    const periodRepository = await myDatabase.getRepository(Period);
    let periodToUpdate = await periodRepository.findOneBy({ id: parseInt(id) });
    if (periodToUpdate) {
      periodToUpdate.name = name;
      periodToUpdate.start = start;
      periodToUpdate.end = end;
      await periodRepository.save(periodToUpdate);
      res.json(periodToUpdate);
    } else {
      res.json({ message: "Period not found" });
    }
  } catch (error) {
    console.error("Error updating Period:", error);
    res.json({ error: error.message });
  }
});

// DELETE: Delete an existing Period
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const periodRepository = await myDatabase.getRepository(Period);
    const deleteResult = await periodRepository.delete(id);
    if (deleteResult.affected > 0) {
      res.send();
    } else {
      res.json({ message: "Period not found" });
    }
  } catch (error) {
    console.error("Error deleting Period:", error);
    res.json({ error: error.message });
  }
});

module.exports = router;
