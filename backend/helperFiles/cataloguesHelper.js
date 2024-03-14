const { Catalogue } = require("../dist/entity");
const myDatabase = require("../config/db");

/**
 *
 * @returns
 */
async function getAllCatalogues() {
	console.log("Getting all Catalogues");
	try {
		const catalogueRepository = await myDatabase.getRepository(Catalogue);
		const catalogues = await catalogueRepository.find();
		return catalogues;
		//res.json(catalogues);
	} catch (error) {
		console.error("Error fetching catalogues:", error);
		return error;
		//res.json({ error: error.message });
	}
}

/**
 *
 * @param {*} req
 */
async function createNewCatalogue(req) {
	console.log("Creating new Catalogue: " + req.body);
	const { name, description } = req.body;
	try {
		const catalogueRepository = await myDatabase.getRepository(Catalogue);
		const newCatalogue = catalogueRepository.create({ name, description });
		await catalogueRepository.save(newCatalogue);
		return newCatalogue;
		//res.json(newCatalogue);
	} catch (error) {
		console.error("Error creating new catalogue:", error);
		return error;
		//res.json({ error: error.message });
	}
}

/**
 *
 * @param {*} req
 */
async function getCatalogueFromId(req) {
	console.log("Getting catalogue from Id: " + req.params.id);
	try {
		const catalogueRepository = await myDatabase.getRepository(Catalogue);
		const catalogue = await catalogueRepository.findOne({
			where: { id: parseInt(req.params.id) },
			relations: [
				"sites",
				"sites.artifacts",
				"sites.artifacts.artifactType",
				"sites.artifacts.artifactType.materials",
				"sites.artifacts.bladeShape",
				"sites.artifacts.baseShape",
				"sites.artifacts.haftingShape",
				"sites.artifacts.crossSection",
			],
		});

		if (catalogue) {
			console.log("CH 56: " + catalogue.sites);
			return catalogue;
			//res.json(catalogue);
		} else {
			return "Catalogue not found";
			//res.send("Catalogue not found");
		}
	} catch (error) {
		console.error("Error fetching catalogue:", error);
		return error;
		//res.json({ error: error.message });
	}
}

/**
 *
 * @param {*} req
 */
async function updateCatalogue(req) {
	console.log("Updating Catalogue Id: " + req.params);
	const { id } = req.params;
	const { name, description } = req.body;
	try {
		const catalogueRepository = await myDatabase.getRepository(Catalogue);
		let catalogueToUpdate = await catalogueRepository.findOneBy({
			id: parseInt(id),
		});
		if (catalogueToUpdate) {
			catalogueToUpdate.name = name;
			catalogueToUpdate.description = description;
			await catalogueRepository.save(catalogueToUpdate);
			return catalogueToUpdate;
			//res.json(catalogueToUpdate);
		} else {
			return "Catalogue not found";
			//res.json({ message: "Catalogue not found" });
		}
	} catch (error) {
		console.error("Error updating catalogue:", error);
		return error;
		//res.json({ error: error.message });
	}
}

/**
 *
 * @param {*} req
 */
async function deleteCatalogue(req) {
	console.log("Deleting Catalogue Id: " + req.params.id);
	const id = parseInt(req.params.id);
	try {
		const catalogueRepository = await myDatabase.getRepository(Catalogue);
		const deleteResult = await catalogueRepository.delete(id);
		if (deleteResult.affected > 0) {
			return;
			//res.send();
		} else {
			return "Catalogue not found";
			//res.json({ message: "Catalogue not found" });
		}
	} catch (error) {
		console.error("Error deleting catalogue:", error);
		return error;
		//res.json({ error: error.message });
	}
}

module.exports = {
	getAllCatalogues,
	createNewCatalogue,
	getCatalogueFromId,
	updateCatalogue,
	deleteCatalogue,
};
