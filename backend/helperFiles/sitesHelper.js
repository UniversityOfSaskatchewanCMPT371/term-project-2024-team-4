const { Site } = require("../dist/entity");
const myDatabase = require("../config/db");

/**
 *
 * @param {*} req
 */
async function newSite(req) {
	const { name, description, location, catalogueId, regionId } = req.body;
	try {
		const siteRepository = await myDatabase.getRepository(Site);
		const newSite = siteRepository.create({
			name,
			description,
			location,
			catalogue: { id: catalogueId },
			region: { id: regionId },
		});
		await siteRepository.save(newSite);
		return newSite;
		//res.json(newSite);
	} catch (error) {
		console.error("Error creating new Site:", error);
		return error;
		//res.json({ error: error.message });
	}
}

/**
 *
 */
async function getAllSites() {
	try {
		const siteRepository = await myDatabase.getRepository(Site);
		const sites = await siteRepository.find({
			relations: ["catalogue", "region"],
		});
		return sites;
		//res.json(sites);
	} catch (error) {
		console.error("Error fetching Sites:", error);
		return error;
		//res.json({ error: error.message });
	}
}

/**
 *
 * @param {*} req
 */
async function getSiteFromId(req) {
	try {
		const siteRepository = await myDatabase.getRepository(Site);
		const site = await siteRepository.findOne({
			where: { id: parseInt(req.params.id) },
			relations: ["catalogue", "region", "artifacts"],
		});
		if (site) {
			return site;
			//res.json(site);
		} else {
			return "Site not found";
			//res.send("Site not found");
		}
	} catch (error) {
		console.error("Error fetching Site:", error);
		return error;
		//res.json({ error: error.message });
	}
}

/**
 *
 * @param {*} req
 */
async function updateSite(req) {
	const { name, description, location, catalogueId, regionId } = req.body;
	try {
		const siteRepository = await myDatabase.getRepository(Site);
		let siteToUpdate = await siteRepository.findOneBy({
			id: parseInt(req.params.id),
		});
		if (siteToUpdate) {
			siteToUpdate.name = name;
			siteToUpdate.description = description;
			siteToUpdate.location = location;
			siteToUpdate.catalogue = { id: catalogueId };
			siteToUpdate.region = { id: regionId };
			await siteRepository.save(siteToUpdate);
			return siteToUpdate;
			//res.json(siteToUpdate);
		} else {
			return "Site not found";
			//res.json({ message: "Site not found" });
		}
	} catch (error) {
		console.error("Error updating Site:", error);
		return error;
		//res.json({ error: error.message });
	}
}

/**
 *
 * @param {*} req
 */
async function deleteSite(req) {
	try {
		const siteRepository = await myDatabase.getRepository(Site);
		const deleteResult = await siteRepository.delete(parseInt(req.params.id));
		if (deleteResult.affected > 0) {
			return;
			//res.send();
		} else {
			return "Site not found";
			//res.json({ message: "Site not found" });
		}
	} catch (error) {
		console.error("Error deleting Site:", error);
		return error;
		//res.json({ error: error.message });
	}
}

module.exports = {
	newSite,
	getAllSites,
	getSiteFromId,
	updateSite,
	deleteSite,
};
