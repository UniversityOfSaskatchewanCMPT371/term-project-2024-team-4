const express = require("express");
const router = express.Router();
const cataloguesHelper = require("../helperFiles/cataloguesHelper.js");

// GET: Fetch all catalogues
router.get("/", async (req, res) => {
	const catalogues = await cataloguesHelper.getAllCatalogues();
	if (catalogues instanceof Error) {
		res.json({ error: catalogues.message });
	}
	res.json(catalogues);
});

// POST: Create a new catalogue
router.post("/", async (req, res) => {
	const newCatalogue = await cataloguesHelper.createNewCatalogue(req);
	if (newCatalogue instanceof Error) {
		res.json({ error: newCatalogue.message });
	}
	res.json(newCatalogue);
});

// GET: Fetch a catalogue by ID
router.get("/:id", async (req, res) => {
	const catalogue = await cataloguesHelper.getCatalogueFromId(req);
	if (catalogue instanceof Error) {
		res.json({ error: catalogue.message });
	}
	res.json(catalogue);
});

// PUT: Update an existing catalogue
router.put("/:id", async (req, res) => {
	const catalogueToUpdate = await cataloguesHelper.updateCatalogue(req);
	if (catalogueToUpdate === "Catalogue not found") {
		res.json({ message: "Catalogue not found" });
	}
	if (catalogueToUpdate instanceof Error) {
		res.json({ error: catalogueToUpdate.message });
	}
	res.json(catalogueToUpdate);
});

// DELETE: Remove a catalogue
router.delete("/:id", async (req, res) => {
	const result = await cataloguesHelper.deleteCatalogue(req);
	if (result === "Catalogue not found") {
		res.json({ message: "Catalogue not found" });
	}
	if (result instanceof Error) {
		res.json({ error: result.message });
	}
});

module.exports = router;
