const { CrossSection } = require("../dist/entity");
const express = require("express");
const router = express.Router();
const myDatabase = require("../config/db");

// POST: Create a new CrossSection
router.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    // Access CrossSection repository from the database connection
    const CrossSectionRepository = await myDatabase.getRepository(CrossSection);
    // Create a new CrossSection instance and save it to the database
    const newCrossSection = CrossSectionRepository.create({ name });
    await CrossSectionRepository.save(newCrossSection);
    // Respond with the newly created CrossSection
    res.json(newCrossSection);
  } catch (error) {
    // Handle errors, e.g., if the name is not unique
    console.error("Error creating new CrossSection:", error);
    res.json({ error: error.message });
  }
});

// GET: Fetch all CrossSections
router.get("/", async (req, res) => {
  try {
    const CrossSectionRepository = await myDatabase.getRepository(CrossSection);
    const crossSections = await CrossSectionRepository.find({
      relations: ["cultures", "projectilePoints"],
    });
    res.json(crossSections);
  } catch (error) {
    console.error("Error fetching CrossSections:", error);
    res.json({ error: error.message });
  }
});

// GET: Fetch all CrossSections by ID
router.get("/:id", async (req, res) => {
  try {
    const crossSectionRepository = await myDatabase.getRepository(CrossSection);
    const crossSections = await crossSectionRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["cultures", "projectilePoints"],
    });
    if (crossSections) {
      res.json(crossSections);
    } else {
      res.send("CrossSection not found");
    }
  } catch (error) {
    console.error("Error fetching BasCrossSectioneShape:", error);
    res.json({ error: error.message });
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
      res.json({ message: "CrossSection not found" });
    }
  } catch (error) {
    console.error("Error updating CrossSection:", error);
    res.json({ error: error.message });
  }
});

// DELETE: Remove a CrossSection
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const CrossSectionRepository = await myDatabase.getRepository(CrossSection);
    const deleteResult = await CrossSectionRepository.delete(id);
    if (deleteResult.affected > 0) {
      res.send();
    } else {
      res.json({ message: "CrossSection not found" });
    }
  } catch (error) {
    console.error("Error deleting CrossSection:", error);
    res.json({ error: error.message });
  }
});

module.exports = router;
