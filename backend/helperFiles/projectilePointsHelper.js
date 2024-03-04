const {
	ProjectilePoint,
	Culture,
	BladeShape,
	BaseShape,
	HaftingShape,
	CrossSection,
} = require("../dist/entity");
const myDatabase = require("../config/db");

/**
 *
 * @param {*} req
 */
async function newProjectilePoint(req) {
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

	console.log("Creating new Projectile Point: " + req.body);

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
		return projectilePoint;
		//res.status(201).json(projectilePoint);
	} catch (error) {
		console.error("Error creating ProjectilePoint:", error);
		return error;
		//res.status(500).json({ error: error.message });
	}
}

/**
 *
 */
async function getAllProjectilePoints() {
	console.log("Getting all Projectile Points");
	try {
		const projectilePoints = await myDatabase
			.getRepository(ProjectilePoint)
			.find({
				relations: [
					"culture",
					"bladeShape",
					"baseShape",
					"haftingShape",
					"crossSection",
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
 *
 * @param {*} req
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
					"culture",
					"bladeShape",
					"baseShape",
					"haftingShape",
					"crossSection",
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
 *
 * @param {*} req
 */
async function updateProjectilePoint(req) {
	const { id } = req.params;
	console.log("Updating Projectile Point Id: " + id);
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

		return projectilePoint;
		//res.json(projectilePoint);
	} catch (error) {
		console.error("Error updating ProjectilePoint:", error);
		return error;
		//res.json({ error: error.message });
	}
}

/**
 *
 * @param {*} req
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
