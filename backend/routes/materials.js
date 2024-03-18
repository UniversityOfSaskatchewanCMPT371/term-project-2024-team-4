const { Material, ArtifactType } = require("../dist/entity");
const express = require("express");
const router = express.Router();
const myDatabase = require("../config/db");
const { logger } = require("../config/logger");

// POST: create a new Material
/**
 * POST: Create a new Material
 * @param {*} req - req.body containing material: name, description, artifactTypeId
 * @param {*} res - response to client
 * @precond req.body contains valid fields: name, description, artifactTypeId
 * @postcond
 *  Succesful: Returns newly created Material object
 * 	Failure: Returns error message based on what went wrong
 */
router.post("/", async (req, res) => {
	const { name, description, artifactTypeId } = req.body;
	try {
		let artifactType = null;
		if (artifactTypeId) {
			artifactType = await myDatabase
				.getRepository(ArtifactType)
				.findOneBy({ id: artifactTypeId });
			if (!artifactType) {
				return res.json({ message: "ArtifactType not found" });
			}
		}

		const newMaterial = myDatabase.getRepository(Material).create({
			name,
			description,
			artifactType,
		});

		await myDatabase.getRepository(Material).save(newMaterial);
		res.json(newMaterial);
	} catch (error) {
		logger.error("Error creating Material:", error);
		res.json({ error: error.message });
	}
});

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
	try {
		const materials = await myDatabase.getRepository(Material).find({
			relations: ["artifactType", "artifacts"],
		});
		res.json(materials);
	} catch (error) {
		logger.error("Error fetching Materials:", error);
		res.json({ error: error.message });
	}
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
	const { id } = req.params;
	try {
		const material = await myDatabase.getRepository(Material).findOne({
			where: { id },
			relations: ["artifactType", "artifacts"],
		});
		if (!material) {
			logger.warn(`Material with ID${id} was not found in the database`);
			res.json({ message: "Material not found" });
		} else {
			res.json(material);
		}
	} catch (error) {
		logger.error("Error fetching Material:", error);
		res.json({ error: error.message });
	}
});

// PUT: Update a single Material
/**
 * PUT: Update a SINGLE material given the ID
 * @param {*} req - req URL parameters contain material ID. req body contains name, description, and artifactTypeID
 * @param {*} res - response to client
 * @precond
 * 	- req URL Parameters: Material with given material ID exists in Database.
 *  - req.body: Must have a valid name, description, and artifactTypeID
 * @postcond
 * 	Succesful: Returns the updated Material object
 * 	Failure: Returns an error message relating to the issue
 */
router.put("/:id", async (req, res) => {
	const { id } = req.params;
	const { name, description, artifactTypeId } = req.body;
	try {
		let material = await myDatabase.getRepository(Material).findOneBy({ id });

		if (!material) {
			logger.warn(`Material with ID${id} was not found in the database`);
			return res.json({ message: "Material not found" });
		}

		if (artifactTypeId) {
			const artifactType = await myDatabase
				.getRepository(ArtifactType)
				.findOneBy({ id: artifactTypeId });
			if (!artifactType) {
				return res.json({ message: "ArtifactType not found" });
			}
			material.artifactType = artifactType;
		}

		material.name = name;
		material.description = description;

		await myDatabase.getRepository(Material).save(material);
		res.json(material);
	} catch (error) {
		logger.error("Error updating Material:", error);
		res.json({ error: error.message });
	}
});

/**
 * DELETE: Delete a SINGLE material given the ID
 * @param {*} req - req URL parameters contain material ID to delete
 * @param {*} res - response to the client
 * @precond Material with specified ID exists in the database
 * @postcond
 * 	Succesful: Material is deleted from database; empty response is sent
 * 	Failure: Returns an error message relating to the issue
 */

router.delete("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const deleteResult = await myDatabase.getRepository(Material).delete(id);
		if (deleteResult.affected > 0) {
			res.send();
		} else {
			logger.warn(`Material with ID${id} was not found in the database`);
			res.json({ message: "Material not found" });
		}
	} catch (error) {
		logger.error("Error deleting Material:", error);
		res.json({ error: error.message });
	}
});

module.exports = router;
