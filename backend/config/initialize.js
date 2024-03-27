const dataSource = require("./db");
const { Catalogue, ArtifactType } = require("../dist/entity");
const { logger } = require("./logger");

async function initializeDefaults() {
	await initializeDefaultCatalogue();
	await initializeArtifactTypes();
}

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

async function initializeArtifactTypes() {
	try {
		const artifactTypeRepository = dataSource.getRepository(ArtifactType);
		const types = ["Lithic", "Ceramic", "Faunal"];

		for (const type of types) {
			const typeExists = await artifactTypeRepository.findOneBy({ id: type });
			if (!typeExists) {
				logger.info(`Creating artifact type: ${type}...`);
				const artifactType = artifactTypeRepository.create({ id: type });
				await artifactTypeRepository.save(artifactType);
				logger.info(`${type} artifact type created.`);
			} else {
				logger.info(`${type} artifact type already exists.`);
			}
		}
	} catch (error) {
		logger.error("Failed to create artifact types:", error);
	}
}

module.exports = initializeDefaults;
