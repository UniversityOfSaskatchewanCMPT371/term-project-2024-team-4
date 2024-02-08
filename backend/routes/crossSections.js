const { CrossSection } = require("../dist/entity");
const express = require("express");
const router = express.Router();
const myDatabase = require("../config/db");

// POST: Create a new CrossSection
router.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    const CrossSectionRepository = await myDatabase.getRepository(CrossSection);
    const newCrossSection = CrossSectionRepository.create({ name });
    await CrossSectionRepository.save(newCrossSection);
    res.status(201).json(newCrossSection);
  } catch (error) {
    console.error("Error creating new CrossSection:", error);
    res.status(400).json({ error: error.message });
  }
});

// GET: Fetch all CrossSections
router.get("/", async (req, res) => {
  try {
    const CrossSectionRepository = await myDatabase.getRepository(CrossSection);
    const CrossSections = await CrossSectionRepository.find({
      // relations: ["cultures", "projectilePoints"],
    });
    res.json(CrossSections);
  } catch (error) {
    console.error("Error fetching CrossSections:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET: Fetch all CrossSections by ID
router.get("/:id", async (req, res) => {
  try {
    const crossSectionRepository = await myDatabase.getRepository(CrossSection);
    const crossSections = await crossSectionRepository.findOne({
      where: { id: parseInt(req.params.id) }
      // relations: ["cultures", "projectilePoints"],
    });
    if (crossSections) {
      res.json(crossSections);
    } else {
      res.status(404).send("CrossSection not found");
    }
  } catch (error) {
    console.error("Error fetching BasCrossSectioneShape:", error);
    res.status(500).json({ error: error.message });
  }
});

// PUT: Update an existing CrossSection
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const CrossSectionRepository = await myDatabase.getRepository(CrossSection);
    let CrossSectionToUpdate = await CrossSectionRepository.findOneBy({
      id: parseInt(id),
    });
    if (CrossSectionToUpdate) {
      CrossSectionToUpdate.name = name;
      await CrossSectionRepository.save(CrossSectionToUpdate);
      res.json(CrossSectionToUpdate);
    } else {
      res.status(404).json({ message: "CrossSection not found" });
    }
  } catch (error) {
    console.error("Error updating CrossSection:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE: Remove a CrossSection
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const CrossSectionRepository = await myDatabase.getRepository(CrossSection);
    const deleteResult = await CrossSectionRepository.delete(id);
    if (deleteResult.affected > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "CrossSection not found" });
    }
  } catch (error) {
    console.error("Error deleting CrossSection:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
