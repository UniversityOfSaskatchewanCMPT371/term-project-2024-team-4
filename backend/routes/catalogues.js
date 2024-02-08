const { Catalogue } = require("../dist/entity");
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

// GET: Fetch all catalogues
router.get("/", async (req, res) => {
  try {
    const catalogueRepository = await myDatabase.getRepository(Catalogue);
    const catalogues = await catalogueRepository.find();
    res.json(catalogues);
  } catch (error) {
    console.error("Error fetching catalogues:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST: Create a new catalogue
router.post("/", async (req, res) => {
  const { name, description } = req.body;
  try {
    const catalogueRepository = await myDatabase.getRepository(Catalogue);
    const newCatalogue = catalogueRepository.create({ name, description });
    await catalogueRepository.save(newCatalogue);
    res.status(201).json(newCatalogue);
  } catch (error) {
    console.error("Error creating new catalogue:", error);
    res.status(400).json({ error: error.message });
  }
});

// GET: Fetch a catalogue by ID
router.get("/:id", async (req, res) => {
  try {
    const catalogueRepository = await myDatabase.getRepository(Catalogue);
    const catalogue = await catalogueRepository.findOneBy({
      id: parseInt(req.params.id),
    });

    if (catalogue) {
      res.json(catalogue);
    } else {
      res.status(404).send("Catalogue not found");
    }
  } catch (error) {
    console.error("Error fetching catalogue:", error);
    res.status(500).json({ error: error.message });
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
      res.status(404).json({ message: "Catalogue not found" });
    }
  } catch (error) {
    console.error("Error updating catalogue:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
