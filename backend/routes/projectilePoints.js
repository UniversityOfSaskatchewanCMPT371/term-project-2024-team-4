const express = require("express");
const router = express.Router();
const projectilePointsHelper = require("../helperFiles/projectilePointsHelper.js");
/**
 * Middleware for handling file upload using Multer.
 * @module multerMiddleware
 */
const multer = require("multer");
const path = require("path");

/**
 * Configures disk storage options for Multer.
 * @constant {object}
 * @default
 */
const storage = multer.diskStorage({
	/**
	 * Specifies the destination directory for storing uploaded files.
	 * @type {string}
	 */
	destination: "./uploads/",
	/**
	 * Generates a filename for the uploaded file.
	 * @param {object} req - The HTTP request object.
	 * @param {object} file - The uploaded file object.
	 * @param {function} cb - The callback function to return the filename.
	 */
	filename: function (req, file, cb) {
		cb(
			null,
			file.fieldname + "-" + Date.now() + path.extname(file.originalname),
		);
	},
});
// Multer middleware
const upload = multer({ storage });
const authenticateAdmin = require("../middleware/authenticate.js");
const {
	validate,
	artifactValidationRules,
} = require("../middleware/sanitize.js");

/**
 * Handles POST requests to create a new ProjectilePoint.
 * This endpoint creates a new ProjectilePoint entity, extracting necessary properties from the request body.
 * It also fetches related entities such as Culture and BladeShape from the database to ensure their existence before association.
 * @function
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {object} - The HTTP response containing the created ProjectilePoint entity or an error message.
 */
router.post(
	"/",
	authenticateAdmin,
	artifactValidationRules(),
	validate,
	upload.single("photo"),
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
	upload.single("photo"),
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
	return res.send();
});

module.exports = router;
