/*
Initializes database with default/starting values:
- Create catalogue
- Create predefined artifact types
- Create base user, (test user if in development)
*/

const dataSource = require("./db");
const { Catalogue, ArtifactType } = require("../dist/entity");
const { logger } = require("./logger");

/**
 * Main function to call specific initialization functions
 * @precond necessary database schema must be initialized:
 * 	- Catalogue
 * 	- Artifact Types
 * 	- Users
 */
async function initializeDefaults() {
	await initializeDefaultCatalogue();
	await initializeArtifactTypes();
}

/**
 * Initializes default catalogue in the database if it does not exist
 * @precond 
 * 	- Catalogue table schema is generated
 * 	- There is no existing catalogue
 * @postcond Creates a catalogue with ID1
 */
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

/**
 * Initializes default artifact types in the database if they don't exist
 * @precond 
 * 	- ArtifactType table schema is generated
 * 	- There are no existing Artifact Types in the table
 * @postcond Creates artifact types from ID1-ID3: [Lithic, Ceramic, Faunal]
 */
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
