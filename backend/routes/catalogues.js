const { Catalogue } = require("../dist/entity");
const express = require("express");
const router = express.Router();
const myDatabase = require("../config/db");

// GET: Fetch all catalogues
router.get("/", async (req, res) => {
  try {
    const catalogueRepository = await myDatabase.getRepository(Catalogue);
    const catalogues = await catalogueRepository.find();
    res.json(catalogues);
  } catch (error) {
    console.error("Error fetching catalogues:", error);
    res.json({ error: error.message });
  }
});

// POST: Create a new catalogue
router.post("/", async (req, res) => {
  const { name, description } = req.body;
  try {
    const catalogueRepository = await myDatabase.getRepository(Catalogue);
    const newCatalogue = catalogueRepository.create({ name, description });
    await catalogueRepository.save(newCatalogue);
    res.json(newCatalogue);
  } catch (error) {
    console.error("Error creating new catalogue:", error);
    res.json({ error: error.message });
  }
});

// GET: Fetch a catalogue by ID
router.get("/:id", async (req, res) => {
  try {
    const catalogueRepository = await myDatabase.getRepository(Catalogue);
    const catalogue = await catalogueRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["sites"],
    });

    if (catalogue) {
      res.json(catalogue);
    } else {
      res.send("Catalogue not found");
    }
  } catch (error) {
    console.error("Error fetching catalogue:", error);
    res.json({ error: error.message });
  }
});

// PUT: Update an existing catalogue
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const catalogueRepository = await myDatabase.getRepository(Catalogue);
    let catalogueToUpdate = await catalogueRepository.findOneBy({
      id: parseInt(id),
    });
    if (catalogueToUpdate) {
      catalogueToUpdate.name = name;
      catalogueToUpdate.description = description;
      await catalogueRepository.save(catalogueToUpdate);
      res.json(catalogueToUpdate);
    } else {
      res.json({ message: "Catalogue not found" });
    }
  } catch (error) {
    console.error("Error updating catalogue:", error);
    res.json({ error: error.message });
  }
});

// DELETE: Remove a catalogue
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const catalogueRepository = await myDatabase.getRepository(Catalogue);
    const deleteResult = await catalogueRepository.delete(id);
    if (deleteResult.affected > 0) {
      res.send();
    } else {
      res.json({ message: "Catalogue not found" });
    }
  } catch (error) {
    console.error("Error deleting catalogue:", error);
    res.json({ error: error.message });
  }
});

module.exports = router;
