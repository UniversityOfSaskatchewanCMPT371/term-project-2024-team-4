const { Material, ArtifactType } = require("../dist/entity");
const myDatabase = require("../config/db");

/**
 *
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
 *
 */
async function getAllMaterials() {
	try {
		const materials = await myDatabase.getRepository(Material).find({
			relations: ["artifactType", "artifacts"],
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
 *
 */
async function getMaterialById(req) {
	const { id } = req.params;
	try {
		const material = await myDatabase.getRepository(Material).findOne({
			where: { id },
			relations: ["artifactType", "artifacts"],
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
 *
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
 *
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
