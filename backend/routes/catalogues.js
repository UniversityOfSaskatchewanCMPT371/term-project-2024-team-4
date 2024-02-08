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
  

module.exports = router;
