const { Region } = require("../dist/entity");
const express = require("express");
const router = express.Router();
const myDatabase = require("../config/db");

// GET: Fetch all Regions
router.get("/", async (req, res) => {
  try {
    const regionRepository = await myDatabase.getRepository(Region);
    const regions = await regionRepository.find();
    res.json(regions);
  } catch (error) {
    console.error("Error fetching Regions:", error);
    res.json({ error: error.message });
  }
});

// POST: Create a new Region
router.post("/", async (req, res) => {
  const { name, description } = req.body;
  try {
    const regionRepository = await myDatabase.getRepository(Region);
    const newRegion = regionRepository.create({ name, description });
    await regionRepository.save(newRegion);
    res.json(newRegion);
  } catch (error) {
    console.error("Error creating new Region:", error);
    res.json({ error: error.message });
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
      res.send("Region not found");
    }
  } catch (error) {
    console.error("Error fetching Region:", error);
    res.json({ error: error.message });
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
      res.json({ message: "Region not found" });
    }
  } catch (error) {
    console.error("Error updating Region:", error);
    res.json({ error: error.message });
  }
});

// DELETE: Remove a Region
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const regionRepository = await myDatabase.getRepository(Region);
    const deleteResult = await regionRepository.delete(id);
    if (deleteResult.affected > 0) {
      res.send();
    } else {
      res.json({ message: "Region not found" });
    }
  } catch (error) {
    console.error("Error deleting Region:", error);
    res.json({ error: error.message });
  }
});

module.exports = router;
