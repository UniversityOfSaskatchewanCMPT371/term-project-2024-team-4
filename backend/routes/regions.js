const { Region } = require("../dist/entity");
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

// GET: Fetch all Regions
router.get("/", async (req, res) => {
  try {
    const regionRepository = await myDatabase.getRepository(Region);
    const regions = await regionRepository.find();
    res.json(regions);
  } catch (error) {
    console.error("Error fetching Regions:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST: Create a new Region
router.post("/", async (req, res) => {
  const { name, description } = req.body;
  try {
    const regionRepository = await myDatabase.getRepository(Region);
    const newRegion = regionRepository.create({ name, description });
    await regionRepository.save(newRegion);
    res.status(201).json(newRegion);
  } catch (error) {
    console.error("Error creating new Region:", error);
    res.status(400).json({ error: error.message });
  }
});

// GET: Fetch a Region by ID
// GET: Fetch a Region by ID
router.get("/:id", async (req, res) => {
  try {
    const regionRepository = await myDatabase.getRepository(Region);
    const region = await regionRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["sites"],
    });

    if (region) {
      res.json(region);
    } else {
      res.status(404).send("Region not found");
    }
  } catch (error) {
    console.error("Error fetching Region:", error);
    res.status(500).json({ error: error.message });
  }
});

// PUT: Update an existing Region
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const regionRepository = await myDatabase.getRepository(Region);
    let RegionToUpdate = await regionRepository.findOneBy({
      id: parseInt(id),
    });
    if (RegionToUpdate) {
      RegionToUpdate.name = name;
      RegionToUpdate.description = description;
      await regionRepository.save(RegionToUpdate);
      res.json(RegionToUpdate);
    } else {
      res.status(404).json({ message: "Region not found" });
    }
  } catch (error) {
    console.error("Error updating Region:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE: Remove a Region
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const regionRepository = await myDatabase.getRepository(Region);
    const deleteResult = await regionRepository.delete(id);
    if (deleteResult.affected > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Region not found" });
    }
  } catch (error) {
    console.error("Error deleting Region:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
