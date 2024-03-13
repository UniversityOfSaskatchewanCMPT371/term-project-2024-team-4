const {
	ProjectilePoint,
	Culture,
	BladeShape,
	BaseShape,
	HaftingShape,
	CrossSection,
} = require("../dist/entity");
const express = require("express");
const router = express.Router();
const myDatabase = require("../config/db");

// POST: Create a new ProjectilePoint
// This endpoint handles the creation of a new ProjectilePoint.
// It extracts various properties from the request body, including related entities like Culture and BladeShape.
// Each related entity is fetched from the database to ensure it exists before associating it with the new ProjectilePoint.
router.post("/", async (req, res) => {
	const {
		name,
		location,
		description,
		dimensions,
		photo,
		siteId,
		artifactTypeId,
		cultureId,
		bladeShapeId,
		baseShapeId,
		haftingShapeId,
		crossSectionId,
	} = req.body;

	try {
		// Fetch related entities by their IDs
		const culture = await myDatabase
			.getRepository(Culture)
			.findOneBy({ id: cultureId });
		const bladeShape = await myDatabase
			.getRepository(BladeShape)
			.findOneBy({ id: bladeShapeId });
		const baseShape = await myDatabase
			.getRepository(BaseShape)
			.findOneBy({ id: baseShapeId });
		const haftingShape = await myDatabase
			.getRepository(HaftingShape)
			.findOneBy({ id: haftingShapeId });
		const crossSection = await myDatabase
			.getRepository(CrossSection)
			.findOneBy({ id: crossSectionId });

		// Then create a new instance of ProjectilePoint with the provided and fetched data
		const projectilePoint = new ProjectilePoint();
		projectilePoint.name = name;
		projectilePoint.location = location;
		projectilePoint.description = description;
		projectilePoint.dimensions = dimensions;
		projectilePoint.photo = photo;
		projectilePoint.site = { id: siteId };
		projectilePoint.artifactType = { id: artifactTypeId };
		projectilePoint.culture = culture;
		projectilePoint.bladeShape = bladeShape;
		projectilePoint.baseShape = baseShape;
		projectilePoint.haftingShape = haftingShape;
		projectilePoint.crossSection = crossSection;

		// Set properties directly and through fetched entities
		// Save the new instance to the database
		await myDatabase.getRepository(ProjectilePoint).save(projectilePoint);
		res.status(201).json(projectilePoint);
	} catch (error) {
		console.error("Error creating ProjectilePoint:", error);
		res.status(500).json({ error: error.message });
	}
});

router.get("/", async (req, res) => {
	try {
		const projectilePoints = await myDatabase
			.getRepository(ProjectilePoint)
			.find({
				relations: [
					"site",
					"artifactType",
					"culture",
					"bladeShape",
					"baseShape",
					"haftingShape",
					"crossSection",
				],
			});
		res.json(projectilePoints);
	} catch (error) {
		console.error("Error fetching ProjectilePoints:", error);
		res.json({ error: error.message });
	}
});

router.get("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const projectilePoint = await myDatabase
			.getRepository(ProjectilePoint)
			.findOne({
				where: { id },
				relations: [
					"site",
					"artifactType",
					"culture",
					"bladeShape",
					"baseShape",
					"haftingShape",
					"crossSection",
				],
			});
		if (!projectilePoint) {
			return res.json({ message: "ProjectilePoint not found" });
		}
		res.json(projectilePoint);
	} catch (error) {
		console.error("Error fetching ProjectilePoint:", error);
		res.json({ error: error.message });
	}
});

// PUT: Update a ProjectilePoint
router.put("/:id", async (req, res) => {
	const { id } = req.params;
	const {
		name,
		location,
		description,
		dimensions,
		photo,
		siteId,
		artifactTypeId,
		cultureId,
		bladeShapeId,
		baseShapeId,
		haftingShapeId,
		crossSectionId,
	} = req.body;

	try {
		// Fetch the existing ProjectilePoint entity
		let projectilePoint = await myDatabase
			.getRepository(ProjectilePoint)
			.findOneBy({ id });
		if (!projectilePoint) {
			return res.json({ message: "ProjectilePoint not found" });
		}

		// Update the basic Artifact properties
		projectilePoint.name = name;
		projectilePoint.location = location;
		projectilePoint.description = description;
		projectilePoint.dimensions = dimensions;
		projectilePoint.photo = photo;
		projectilePoint.site = { id: siteId };
		projectilePoint.artifactType = { id: artifactTypeId };

		// Fetch and set the related entities
		projectilePoint.culture = await myDatabase
			.getRepository(Culture)
			.findOneBy({ id: cultureId });
		projectilePoint.bladeShape = await myDatabase
			.getRepository(BladeShape)
			.findOneBy({ id: bladeShapeId });
		projectilePoint.baseShape = await myDatabase
			.getRepository(BaseShape)
			.findOneBy({ id: baseShapeId });
		projectilePoint.haftingShape = await myDatabase
			.getRepository(HaftingShape)
			.findOneBy({ id: haftingShapeId });
		projectilePoint.crossSection = await myDatabase
			.getRepository(CrossSection)
			.findOneBy({ id: crossSectionId });

		// Save the updated entity
		await myDatabase.getRepository(ProjectilePoint).save(projectilePoint);

		res.json(projectilePoint);
	} catch (error) {
		console.error("Error updating ProjectilePoint:", error);
		res.json({ error: error.message });
	}
});

router.delete("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const result = await myDatabase.getRepository(ProjectilePoint).delete(id);
		if (result.affected > 0) {
			res.send();
		} else {
			res.json({ message: "ProjectilePoint not found" });
		}
	} catch (error) {
		console.error("Error deleting ProjectilePoint:", error);
		res.json({ error: error.message });
	}
});

module.exports = router;
