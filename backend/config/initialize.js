const dataSource = require("./db");
const { Catalogue } = require("../dist/entity");
const { logger } = require("./logger");

async function initializeDefaultCatalogue() {
	try {
		const catalogueRepository = dataSource.getRepository(Catalogue);
		const defaultCatalogueExists = await catalogueRepository.findOneBy({
			name: "Default Catalogue",
		});

		if (!defaultCatalogueExists) {
			logger.info("Creating default catalogue...");
			const defaultCatalogue = catalogueRepository.create({
				name: "Default Catalogue",
				description: "This is the default catalogue.",
			});
			await catalogueRepository.save(defaultCatalogue);
			logger.info("Default catalogue created.");
		} else {
			logger.info("Default catalogue already exists.");
		}
	} catch (error) {
		logger.error(
			"Failed to connect to the database or create default catalogue:",
			error,
		);
	}
}

module.exports = initializeDefaultCatalogue;
