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
const { logger } = require("../config/logger");

/**
 * POST: Creates a new Projectile Point
 * Extracts various properties from request body including related entities like Culture and Bladeshape.
 * Each related entity is fetched from the database to ensure it exists before associating it with the new Projectile Point
 * @param {*} req - req.body contains: name,
 * 					location, description, dimensions, photo,
 * 					siteId, artifactTypeId, cultureId, bladeShapeId,
 * 					baseShapeId, haftingShapeId, crossSectionId
 * @param {*} res - response to client
 * @precond all referenced entities (foreign-key IDs) must exist in the database
 * @postcond
 * 	Succesful: Returns newly created Projectile Point with 201 status code
 * 	Failure: Error; 500 status code
 */
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
		logger.error("Error creating ProjectilePoint:", error);
		res.status(500).json({ error: error.message });
	}
});

/**
 * GET: Fetch ALL Projectile Points
 * Retrieves all projectile points including their related entities
 * @param {*} req - unused
 * @param {*} res - response to client contains an array of Projectile Points
 * @precond Database is accessible
 * @postcond
 * 	Succesful: Returns an array of ALL projectile points
 *	Failure: Returns an error message
 */
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
		logger.error("Error fetching ProjectilePoints:", error);
		res.json({ error: error.message });
	}
});

/**
 * GET: Fetch a SINGLE projectile point given an ID
 * @param {*} req - req URL parameter contains a valid projectile point ID
 * @param {*} res - response to client contains the single projectile point from the ID
 * @precond the given projectile point ID exists in the database
 * @postcond
 * 	Succesful: Returns requested Projectile Point
 * 	Failure: Returns an error message related to the issue
 */
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
			logger.warn(`Projectile Point with ID${id} was not found in database`);
			return res.json({ message: "ProjectilePoint not found" });
		}
		res.json(projectilePoint);
	} catch (error) {
		logger.error("Error fetching ProjectilePoint:", error);
		res.json({ error: error.message });
	}
});

/**
 * PUT: Update a SINGLE, EXISTING Projectile Point
 * @param {*} req - req URL parameter contains a valid Projectile Point ID.
 * 					req body contains same details as when creating a Projectile Point
 * @param {*} res - Response to client
 * @precond specified Projectile Point ID exists in the database
 * @postcond
 * 	Succesful: returns updated projectile point
 * 	Failure: Returns an error message related to the issue
 */
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
			logger.warn(`Projectile Point with ID ${id} was not found`);
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
		logger.error("Error updating ProjectilePoint:", error);
		res.json({ error: error.message });
	}
});

/**
 * DELETE: delete a single, EXISTING Projectile Point
 * @param {*} req - req URL parameter contains a valid Projectile POint ID
 * @param {*} res - response to client
 * @precond specified Projectile Point ID exists in the database
 * @postcond
 * 	Succesful: ProjectilePoint is deleted; empty response is sent
 *  Failure: Returns an error message related to the issue
 */
router.delete("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const result = await myDatabase.getRepository(ProjectilePoint).delete(id);
		if (result.affected > 0) {
			res.send();
		} else {
			logger.warn(`Projectile Point with ID${id} was not found`);
			res.json({ message: "ProjectilePoint not found" });
		}
	} catch (error) {
		logger.error("Error deleting ProjectilePoint:", error);
		res.json({ error: error.message });
	}
});

module.exports = router;
