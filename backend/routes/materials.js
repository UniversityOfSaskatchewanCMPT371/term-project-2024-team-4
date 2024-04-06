const express = require("express");
const router = express.Router();
const materialsHelper = require("../helperFiles/materialsHelper.js");
const authenticateAdmin = require("../middleware/authenticate.js");
const {
	validate,
	nameDescValidationRules,
} = require("../middleware/sanitize.js");

/**
 * POST: Create a new Material
 * @param {*} req - req.body containing material: name, description, artifactTypeId
 * @param {*} res - response to client
 * @precond req.body contains valid fields: name, description, artifactTypeId
 * @precond A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @postcond
 *  Succesful: Returns newly created Material object
 * 	Failure: Returns error message based on what went wrong
 */
router.post(
	"/",
	authenticateAdmin,
	nameDescValidationRules(),
	validate,
	async (req, res) => {
		const response = await materialsHelper.newMaterial(req);
		if (response === "ArtifactType not found") {
			return res.json({ message: "ArtifactType not found" });
		}
		if (response instanceof Error) {
			return res.json({ error: response.message });
		}
		return res.json(response);
	},
);

/**
 * GET: Fetch ALL materials
 * @param {*} req - unused
 * @param {*} res - response to client containing all materials
 * @precond Database is accessible
 * @postcond
 * 	Succesful: Returns an array of all Material objects
 *  Failure: Returns an error message relating to issue
 */
router.get("/", async (req, res) => {
	const response = await materialsHelper.getAllMaterials();
	if (response instanceof Error) {
		return res.json({ error: response.message });
	}
	return res.json(response);
});

/**
 * GET: Fetch a SINGLE material using ID
 * @param {*} req - req URL parameter contains the id
 * @param {*} res - response client contains a single material
 * @precond req URL parameter contains a valid ID in the database
 * @postcond
 * 	Succesful: Returns requested material object (given ID)
 *  Failure: Returns an error message relating to issue
 */
router.get("/:id", async (req, res) => {
	const response = await materialsHelper.getMaterialById(req);
	if (response === "Material not found") {
		return res.json({ message: "Material not found" });
	}
	if (response instanceof Error) {
		return res.json({ error: response.message });
	}
	return res.json(response);
});

// PUT: Update a single Material
/**
 * PUT: Update a SINGLE material given the ID
 * @param {*} req - req URL parameters contain material ID. req body contains name, description, and artifactTypeID
 * @param {*} res - response to client
 * @precond
 * 	- req URL Parameters: Material with given material ID exists in Database.
 *  - req.body: Must have a valid name, description, and artifactTypeID
 * @precond A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @postcond
 * 	Succesful: Returns the updated Material object
 * 	Failure: Returns an error message relating to the issue
 */
router.put(
	"/:id",
	authenticateAdmin,
	nameDescValidationRules(),
	validate,
	async (req, res) => {
		const response = await materialsHelper.updateMaterial(req);
		if (response === "Material not found") {
			return res.json({ message: "Material not found" });
		}
		if (response === "ArtifactType not found") {
			return res.json({ message: "ArtifactType not found" });
		}
		if (response instanceof Error) {
			return res.json({ error: response.message });
		}
		return res.json(response);
	},
);

/**
 * DELETE: Delete a SINGLE material given the ID
 * @param {*} req - req URL parameters contain material ID to delete
 * @param {*} res - response to the client
 * @precond Material with specified ID exists in the database
 * @precond A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @postcond
 * 	Succesful: Material is deleted from database; empty response is sent
 * 	Failure: Returns an error message relating to the issue
 */

router.delete("/:id", authenticateAdmin, async (req, res) => {
	const response = await materialsHelper.deleteMaterial(req);
	if (response === "Material not found") {
		return res.json({ message: "Material not found" });
	}
	if (response instanceof Error) {
		return res.json({ error: response.message });
	}
	return res.send();
});

module.exports = router;
