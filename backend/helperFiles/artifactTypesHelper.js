const { ArtifactType } = require("../dist/entity");
const myDatabase = require("../config/db");

/**
 *
 * @param {*} req
 */
async function newArtifactType(req) {
	const { id } = req.body; // 'Lithic', 'Ceramic', or 'Faunal'
	try {
		const artifactTypeRepository = await myDatabase.getRepository(ArtifactType);
		// Validate the id
		if (!["Lithic", "Ceramic", "Faunal"].includes(id)) {
			return "Invalid ArtifactType ID.";
			//return res.json({ message: "Invalid ArtifactType ID." });
		}
		// Check if the ArtifactType already exists
		const existingType = await artifactTypeRepository.findOneBy({ id });
		if (existingType) {
			return "ArtifactType already exists.";
			//return res.json({ message: "ArtifactType already exists." });
		}
		const artifactType = artifactTypeRepository.create({ id });
		await artifactTypeRepository.save(artifactType);
		return artifactType;
		//res.json(artifactType);
	} catch (error) {
		console.error("Error creating ArtifactType:", error);
		return error;
		//res.json({ error: error.message });
	}
}

/**
 *
 * @param {*} req
 */
async function getAllArtifactTypes() {
	try {
		const artifactTypeRepository = await myDatabase.getRepository(ArtifactType);
		const artifactTypes = await artifactTypeRepository.find({
			relations: ["materials", "artifacts"],
		});
		return artifactTypes;
		//res.json(artifactTypes);
	} catch (error) {
		console.error("Error fetching ArtifactTypes:", error);
		return error;
		//res.json({ error: error.message });
	}
}

/**
 *
 * @param {*} req
 */
async function getArtifactTypeFromId(req) {
	const { id } = req.params;
	try {
		const artifactTypeRepository = await myDatabase.getRepository(ArtifactType);
		const artifactType = await artifactTypeRepository.findOne({
			where: { id },
			relations: ["materials", "artifacts"],
		});
		if (artifactType) {
			return artifactType;
			//res.json(artifactType);
		} else {
			return "ArtifactType not found";
			//res.json({ message: "ArtifactType not found" });
		}
	} catch (error) {
		console.error("Error fetching ArtifactType:", error);
		return error;
		//res.json({ error: error.message });
	}
}

/**
 *
 * @param {*} req
 */
async function deleteArtifactType(req) {
	const { id } = req.params;
	try {
		const artifactTypeRepository = await myDatabase.getRepository(ArtifactType);
		const result = await artifactTypeRepository.delete(id);
		if (result.affected > 0) {
			return;
			//res.send();
		} else {
			return "ArtifactType not found";
			//res.json({ message: "ArtifactType not found" });
		}
	} catch (error) {
		console.error("Error deleting ArtifactType:", error);
		return error;
		//res.json({ error: error.message });
	}
}

module.exports = {
	newArtifactType,
	getAllArtifactTypes,
	getArtifactTypeFromId,
	deleteArtifactType,
};
