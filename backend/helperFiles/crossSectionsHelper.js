const { CrossSection } = require("../dist/entity");
const myDatabase = require("../config/db");
const assert = require("node:assert/strict");
const { logger } = require("../config/logger.js");

/**
 *
 */
async function newCrossSection(req) {
	const { name } = req.body;
	try {
		assert(name, "CrossSection name is required.");
		const crossSectionRepository = await myDatabase.getRepository(CrossSection);
		const newCrossSection = crossSectionRepository.create({ name });
		await crossSectionRepository.save(newCrossSection);
		// res.json(newCrossSection);
		logger.info(`New CrossSection created: ${name}`);
		return newCrossSection;
	} catch (error) {
		logger.error(`Error creating new CrossSection: ${error.message}`);
		// res
		// 	.status(error instanceof assert.AssertionError ? 400 : 500)
		// 	.json({ error: error.message });
	}
}

/**
 *
 */
async function getAllCrossSections() {
	try {
		const crossSectionRepository = await myDatabase.getRepository(CrossSection);
		const crossSections = await crossSectionRepository.find({
			relations: ["cultures", "projectilePoints"],
		});
		assert(crossSections.length > 0, "No CrossSections found.");
		// res.json(crossSections);
		logger.info("Fetched all CrossSections.");
		return crossSections;
	} catch (error) {
		logger.error(`Error fetching CrossSections: ${error.message}`);
		return error;
		// res.status(500).json({ error: error.message });
	}
}

/**
 *
 */
async function getCrossSectionById(req) {
	try {
		const id = parseInt(req.params.id);
		assert(!isNaN(id), "Invalid ID provided");
		const crossSectionRepository = await myDatabase.getRepository(CrossSection);
		const crossSection = await crossSectionRepository.findOne({
			where: { id },
			relations: ["cultures", "projectilePoints"],
		});
		assert(crossSection, "CrossSection not found");
		// res.json(crossSection);
		logger.info(`Fetched CrossSection with ID: ${id}`);
		return crossSection;
	} catch (error) {
		logger.error(
			`Error fetching CrossSection with ID ${req.params.id}: ${error.message}`,
		);
		return error;
		// res.status(500).json({ error: error.message });
	}
}

/**
 *
 */
async function updateCrossSection(req) {
	const { id } = req.params;
	const { name } = req.body;
	try {
		const idInt = parseInt(id);
		assert(!isNaN(idInt) && name, "Valid ID and name are required.");
		const crossSectionRepository = await myDatabase.getRepository(CrossSection);
		let crossSectionToUpdate = await crossSectionRepository.findOneBy({
			id: idInt,
		});
		assert(crossSectionToUpdate, "CrossSection not found");
		crossSectionToUpdate.name = name;
		await crossSectionRepository.save(crossSectionToUpdate);
		// res.json(crossSectionToUpdate);
		logger.info(`Updated CrossSection with ID: ${id}`);
		return crossSectionToUpdate; //temp fix
	} catch (error) {
		logger.error(`Error updating CrossSection with ID ${id}: ${error.message}`);
		return error;
		// res.status(500).json({ error: error.message });
	}
}

/**
 *
 */
async function deleteCrossSection(req) {
	const id = parseInt(req.params.id);
	try {
		assert(!isNaN(id), "Invalid ID provided for deletion");
		const crossSectionRepository = await myDatabase.getRepository(CrossSection);
		const deleteResult = await crossSectionRepository.delete(id);
		assert(deleteResult.affected > 0, "CrossSection not found for deletion");
		// res.status(204).send(); // No Content
		logger.info(`Deleted CrossSection with ID: ${id}`);
		return;
	} catch (error) {
		logger.error(`Error deleting CrossSection with ID ${id}: ${error.message}`);
		return error;
		// res.status(500).json({ error: error.message });
	}
}

module.exports = {
	newCrossSection,
	getAllCrossSections,
	getCrossSectionById,
	updateCrossSection,
	deleteCrossSection,
};
