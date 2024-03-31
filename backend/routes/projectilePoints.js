const express = require("express");
const router = express.Router();
const projectilePointsHelper = require("../helperFiles/projectilePointsHelper.js");
const authenticateAdmin = require("../middleware/authenticate.js");
const {
	validate,
	artifactValidationRules,
} = require("../middleware/sanitize.js");

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
 * @precond A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @postcond
 * 	Succesful: Returns newly created Projectile Point with 201 status code
 * 	Failure: Error; 500 status code
 */
router.post(
	"/",
	authenticateAdmin,
	artifactValidationRules(),
	validate,
	async (req, res) => {
		const newProjectilePoint =
			await projectilePointsHelper.newProjectilePoint(req);
		if (newProjectilePoint instanceof Error) {
			return res.status(500).json({ error: newProjectilePoint.message });
		}
		return res.status(201).json(newProjectilePoint);
	},
);

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
	const projectilePoints =
		await projectilePointsHelper.getAllProjectilePoints();
	if (projectilePoints instanceof Error) {
		return res.json({ error: projectilePoints.message });
	}
	return res.json(projectilePoints);
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
	const projectilePoint =
		await projectilePointsHelper.getProjectilePointFromId(req);
	if (projectilePoint === "ProjectilePoint not found") {
		return res.json({ message: "ProjectilePoint not found" });
	}
	if (projectilePoint instanceof Error) {
		return res.json({ error: projectilePoint.message });
	}
	return res.json(projectilePoint);
});

/**
 * PUT: Update a SINGLE, EXISTING Projectile Point
 * @param {*} req - req URL parameter contains a valid Projectile Point ID.
 * 					req body contains same details as when creating a Projectile Point
 * @param {*} res - Response to client
 * @precond specified Projectile Point ID exists in the database
 * @precond A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @postcond
 * 	Succesful: returns updated projectile point
 * 	Failure: Returns an error message related to the issue
 */
router.put(
	"/:id",
	authenticateAdmin,
	artifactValidationRules(),
	validate,
	async (req, res) => {
		const projectilePoint =
			await projectilePointsHelper.updateProjectilePoint(req);
		if (projectilePoint === "ProjectilePoint not found") {
			return res.json({ message: "ProjectilePoint not found" });
		}
		if (projectilePoint instanceof Error) {
			return res.json({ error: projectilePoint.message });
		}
		return res.json(projectilePoint);
	},
);

/**
 * DELETE: delete a single, EXISTING Projectile Point
 * @param {*} req - req URL parameter contains a valid Projectile POint ID
 * @param {*} res - response to client
 * @precond specified Projectile Point ID exists in the database
 * @precond A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @postcond
 * 	Succesful: ProjectilePoint is deleted; empty response is sent
 *  Failure: Returns an error message related to the issue
 */
router.delete("/:id", authenticateAdmin, async (req, res) => {
	const result = await projectilePointsHelper.deleteProjectilePoint(req);
	if (result === "ProjectilePoint not found") {
		return res.json({ message: "ProjectilePoint not found" });
	}
	if (result instanceof Error) {
		return res.json({ error: result.message });
	}
});

module.exports = router;
