const dataSource = require("./db");
const { Catalogue } = require("../dist/entity");

async function initializeDefaultCatalogue() {
	try {
		const catalogueRepository = dataSource.getRepository(Catalogue);
		const defaultCatalogueExists = await catalogueRepository.findOneBy({
			name: "Default Catalogue",
		});

		if (!defaultCatalogueExists) {
			console.log("Creating default catalogue...");
			const defaultCatalogue = catalogueRepository.create({
				name: "Default Catalogue",
				description: "This is the default catalogue.",
			});
			await catalogueRepository.save(defaultCatalogue);
			console.log("Default catalogue created.");
		} else {
			console.log("Default catalogue already exists.");
		}
	} catch (error) {
		console.error(
			"Failed to connect to the database or create default catalogue:",
			error,
		);
	}
}

module.exports = initializeDefaultCatalogue;
