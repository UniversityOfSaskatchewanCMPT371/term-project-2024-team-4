const {
	ProjectilePoint,
	Culture,
	BladeShape,
	BaseShape,
	HaftingShape,
	CrossSection,
	Material,
} = require("../dist/entity");
const myDatabase = require("../config/db");

/**
 * POST: Create a new ProjectilePoint
 * This endpoint handles the creation of a new ProjectilePoint.
 * It extracts various properties from the request body, including related entities like Culture and BladeShape.
 * Each related entity is fetched from the database to ensure it exists before associating it with the new ProjectilePoint.
 */
async function newProjectilePoint(req) {
	const {
		name,
		location,
		description,
		dimensions,
		siteId,
		artifactTypeId,
		cultureId,
		bladeShapeId,
		baseShapeId,
		haftingShapeId,
		crossSectionId,
		materialId,
	} = req.body;

	const photo = req.file ? req.file.path : null;

	console.log("Creating new Projectile Point: " + JSON.stringify(req.body));

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
		const material = await myDatabase
			.getRepository(Material)
			.findOneBy({ id: materialId });

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
		projectilePoint.material = material;

		// Set properties directly and through fetched entities
		// Save the new instance to the database
		await myDatabase.getRepository(ProjectilePoint).save(projectilePoint);
		return projectilePoint;
		//res.status(201).json(projectilePoint);
	} catch (error) {
		console.error("Error creating ProjectilePoint:", error);
		return error;
		//res.status(500).json({ error: error.message });
	}
}

/**
 * GET: Fetch ALL Projectile Points
 * Retrieves all projectile points including their related entities
 * @precond Database is accessible
 * @postcond
 * 	Succesful: Returns an array of ALL projectile points
 *	Failure: Returns an error message
 */
async function getAllProjectilePoints() {
	console.log("Getting all Projectile Points");
	try {
		const projectilePoints = await myDatabase
			.getRepository(ProjectilePoint)
			.find({
				relations: [
					"site",
					"artifactType",
					"culture",
					"culture.period",
					"bladeShape",
					"baseShape",
					"haftingShape",
					"crossSection",
					"material",
				],
			});
		return projectilePoints;
		//res.json(projectilePoints);
	} catch (error) {
		console.error("Error fetching ProjectilePoints:", error);
		return error;
		//res.json({ error: error.message });
	}
}

/**
 * GET: Fetch a SINGLE projectile point given an ID
 * @param {*} req - req URL parameter contains a valid projectile point ID
 * @precond the given projectile point ID exists in the database
 * @postcond
 * 	Succesful: Returns requested Projectile Point
 * 	Failure: Returns an error message related to the issue
 */
async function getProjectilePointFromId(req) {
	const { id } = req.params;
	console.log("Getting Projectile Point from Id: " + 1);
	try {
		const projectilePoint = await myDatabase
			.getRepository(ProjectilePoint)
			.findOne({
				where: { id },
				relations: [
					"site",
					"artifactType",
					"culture",
					"culture.period",
					"bladeShape",
					"baseShape",
					"haftingShape",
					"crossSection",
					"culture.period",
					"material",
				],
			});
		if (!projectilePoint) {
			return "ProjectilePoint not found";
			//return res.json({ message: "ProjectilePoint not found" });
		}
		return projectilePoint;
		//res.json(projectilePoint);
	} catch (error) {
		console.error("Error fetching ProjectilePoint:", error);
		return error;
		//res.json({ error: error.message });
	}
}

/**
 * PUT: Update a SINGLE, EXISTING Projectile Point
 * @param {*} req - req URL parameter contains a valid Projectile Point ID.
 * 					req body contains same details as when creating a Projectile Point
 * @precond specified Projectile Point ID exists in the database
 * @postcond
 * 	Succesful: returns updated projectile point
 * 	Failure: Returns an error message related to the issue
 */
async function updateProjectilePoint(req) {
	const { id } = req.params;
	console.log("Updating Projectile Point Id: " + id);

	const {
		name,
		location,
		description,
		dimensions,
		siteId,
		artifactTypeId,
		cultureId,
		bladeShapeId,
		baseShapeId,
		haftingShapeId,
		crossSectionId,
		materialId,
	} = req.body;

	// Initialize photo variable
	let photo;

	// Check if file is provided
	if (req.file) {
		photo = req.file.path;
	}

	try {
		// Fetch the existing ProjectilePoint entity
		let projectilePoint = await myDatabase
			.getRepository(ProjectilePoint)
			.findOneBy({ id });
		if (!projectilePoint) {
			return "ProjectilePoint not found";
			//return res.json({ message: "ProjectilePoint not found" });
		}

		// Update the basic Artifact properties
		projectilePoint.name = name;
		projectilePoint.location = location;
		projectilePoint.description = description;
		projectilePoint.dimensions = dimensions;
		projectilePoint.photo = photo;
		projectilePoint.site = { id: siteId };
		projectilePoint.artifactType = { id: artifactTypeId };
		projectilePoint.material = { id: materialId };

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
		projectilePoint.material = await myDatabase
			.getRepository(Material)
			.findOneBy({ id: materialId });

		// Save the updated entity
		await myDatabase.getRepository(ProjectilePoint).save(projectilePoint);

		return projectilePoint;
		//res.json(projectilePoint);
	} catch (error) {
		console.error("Error updating ProjectilePoint:", error);
		return error;
		//res.json({ error: error.message });
	}
}

/**
 * DELETE: delete a single, EXISTING Projectile Point
 * @param {*} req - req URL parameter contains a valid Projectile POint ID
 * @precond specified Projectile Point ID exists in the database
 * @postcond
 * 	Succesful: ProjectilePoint is deleted; empty response is sent
 *  Failure: Returns an error message related to the issue
 */
async function deleteProjectilePoint(req) {
	const { id } = req.params;
	console.log("Deleting Projectile Point Id: " + id);
	try {
		const result = await myDatabase.getRepository(ProjectilePoint).delete(id);
		if (result.affected > 0) {
			return;
			//res.send();
		} else {
			return "ProjectilePoint not found";
			//res.json({ message: "ProjectilePoint not found" });
		}
	} catch (error) {
		console.error("Error deleting ProjectilePoint:", error);
		return error;
		//res.json({ error: error.message });
	}
}

module.exports = {
	newProjectilePoint,
	getAllProjectilePoints,
	getProjectilePointFromId,
	updateProjectilePoint,
	deleteProjectilePoint,
};
