const { Material, ArtifactType } = require("../dist/entity");
const myDatabase = require("../config/db");

/**
 * POST: Create a new Material
 * @param {*} req - req.body containing material: name, description, artifactTypeId
 * @precond req.body contains valid fields: name, description, artifactTypeId
 * @postcond
 *  Succesful: Returns newly created Material object
 * 	Failure: Returns error message based on what went wrong
 */
async function newMaterial(req) {
	const { name, description, artifactTypeId } = req.body;
	try {
		let artifactType = null;
		if (artifactTypeId) {
			artifactType = await myDatabase
				.getRepository(ArtifactType)
				.findOneBy({ id: artifactTypeId });
			if (!artifactType) {
				return "ArtifactType not found";
				// return res.json({ message: "ArtifactType not found" });
			}
		}

		const newMaterial = myDatabase.getRepository(Material).create({
			name,
			description,
			artifactType,
		});

		await myDatabase.getRepository(Material).save(newMaterial);
		return newMaterial;
		// res.json(newMaterial);
	} catch (error) {
		console.error("Error creating Material:", error);
		return error;
		// res.json({ error: error.message });
	}
}

/**
 * GET: Fetch ALL materials
 * @precond Database is accessible
 * @postcond
 * 	Succesful: Returns an array of all Material objects
 *  Failure: Returns an error message relating to issue
 */
async function getAllMaterials() {
	try {
		const materials = await myDatabase.getRepository(Material).find({
			relations: ["artifactType", "artifacts", "cultures"],
		});
		// res.json(materials);
		return materials;
	} catch (error) {
		console.error("Error fetching Materials:", error);
		return error;
		// res.json({ error: error.message });
	}
}

/**
 * GET: Fetch a SINGLE material using ID
 * @param {*} req - req URL parameter contains the id
 * @precond req URL parameter contains a valid ID in the database
 * @postcond
 * 	Succesful: Returns requested material object (given ID)
 *  Failure: Returns an error message relating to issue
 */
async function getMaterialById(req) {
	const { id } = req.params;
	try {
		const material = await myDatabase.getRepository(Material).findOne({
			where: { id },
			relations: ["artifactType", "artifacts", "cultures"],
		});
		if (!material) {
			return "Material not found";
			// res.json({ message: "Material not found" });
		} else {
			return material;
			// res.json(material);
		}
	} catch (error) {
		console.error("Error fetching Material:", error);
		return error;
		// res.json({ error: error.message });
	}
}

/**
 * PUT: Update a SINGLE material given the ID
 * @param {*} req - req URL parameters contain material ID. req body contains name, description, and artifactTypeID
 * @precond
 * 	- req URL Parameters: Material with given material ID exists in Database.
 *  - req.body: Must have a valid name, description, and artifactTypeID
 * @postcond
 * 	Succesful: Returns the updated Material object
 * 	Failure: Returns an error message relating to the issue
 */
async function updateMaterial(req) {
	const { id } = req.params;
	const { name, description, artifactTypeId } = req.body;
	try {
		let material = await myDatabase.getRepository(Material).findOneBy({ id });

		if (!material) {
			return "Material not found";
			// return res.json({ message: "Material not found" });
		}

		if (artifactTypeId) {
			const artifactType = await myDatabase
				.getRepository(ArtifactType)
				.findOneBy({ id: artifactTypeId });
			if (!artifactType) {
				return "ArtifactType not found";
				// return res.json({ message: "ArtifactType not found" });
			}
			material.artifactType = artifactType;
		}

		material.name = name;
		material.description = description;

		await myDatabase.getRepository(Material).save(material);
		// res.json(material);
		return material;
	} catch (error) {
		console.error("Error updating Material:", error);
		return error;
		// res.json({ error: error.message });
	}
}

/**
 * DELETE: Delete a SINGLE material given the ID
 * @param {*} req - req URL parameters contain material ID to delete
 * @precond Material with specified ID exists in the database
 * @postcond
 * 	Succesful: Material is deleted from database; empty response is sent
 * 	Failure: Returns an error message relating to the issue
 */
async function deleteMaterial(req) {
	const { id } = req.params;
	try {
		const deleteResult = await myDatabase.getRepository(Material).delete(id);
		if (deleteResult.affected > 0) {
			// res.send();
			return;
		} else {
			// res.json({ message: "Material not found" });
			return "Material not found";
		}
	} catch (error) {
		console.error("Error deleting Material:", error);
		return error;
		// res.json({ error: error.message });
	}
}

module.exports = {
	newMaterial,
	getAllMaterials,
	getMaterialById,
	updateMaterial,
	deleteMaterial,
};
