/* eslint-disable indent */
const {
	Culture,
	Period,
	HaftingShape,
	CrossSection,
	BaseShape,
	BladeShape,
	Material,
} = require("../dist/entity");
const myDatabase = require("../config/db");
const assert = require("node:assert/strict");
const { logger } = require("../config/logger.js");

/**
 * POST: Creates a new Culture.
 * @param req Express request object, expecting 'name' and 'periodId' in the request body.
 * @pre 'name' field must be provided and 'periodId' must reference an existing Period.
 * @post A new Culture entity associated with the specified Period is created in the database.
 * @return Returns the newly created Culture object or an error message if creation fails.
 */
async function newCulture(req) {
	const { name, periodId } = req.body;
	try {
		assert(name, "Name is required.");
		assert(periodId, "Period ID is required.");
		const cultureRepository = await myDatabase.getRepository(Culture);
		const period = await myDatabase
			.getRepository(Period)
			.findOneBy({ id: periodId });
		assert(period, "Period not found.");

		const newCulture = cultureRepository.create({ name, period });
		await cultureRepository.save(newCulture);
		// res.status(201).json(newCulture);
		logger.info(`New Culture created: ${name}`);
		return newCulture;
	} catch (error) {
		logger.error(`Error creating new Culture: ${error.message}`);
		return error;
		// res
		// 	.status(error instanceof assert.AssertionError ? 404 : 400)
		// 	.json({ error: error.message });
	}
}

/**
 * GET: Fetches all Cultures.
 * @pre None.
 * @post Retrieves all Culture entities from the database including their related data.
 * @return Returns an array of Culture objects or an error message if there is a fetch failure.
 */
async function getAllCultures() {
	try {
		const cultureRepository = await myDatabase.getRepository(Culture);
		const cultures = await cultureRepository.find({
			relations: [
				"period",
				"projectilePoints",
				"bladeShapes",
				"baseShapes",
				"haftingShapes",
				"crossSections",
				"materials",
			],
		});
		assert(cultures.length > 0, "No Cultures found.");
		// res.json(cultures);
		logger.info("Fetched all Cultures.");
		return cultures;
	} catch (error) {
		logger.error(`Error fetching Cultures: ${error.message}`);
		return error;
		// res.status(500).json({ error: error.message });
	}
}

/**
 * GET: Fetches a Culture by ID.
 * @param req Express request object, expecting 'id' as a route parameter.
 * @pre The Culture with the given ID must exist in the database.
 * @post Retrieves a specific Culture from the database based on its ID including related data.
 * @return Returns a Culture object or a message indicating the Culture was not found.
 */
async function getCultureById(req) {
	logger.info("Getting culture by id: " + req.params.id);
	try {
		const id = parseInt(req.params.id);
		assert(!isNaN(id), "Invalid ID provided");
		const cultureRepository = await myDatabase.getRepository(Culture);
		const culture = await cultureRepository.findOne({
			where: { id },
			relations: [
				"period",
				"projectilePoints",
				"bladeShapes",
				"bladeShapes.cultures",
				"baseShapes",
				"baseShapes.cultures",
				"haftingShapes",
				"haftingShapes.cultures",
				"crossSections",
				"crossSections.cultures",
				"materials",
				"materials.cultures",
			],
		});
		assert(culture, "Culture not found.");
		// res.json(culture);
		logger.info(`Fetched Culture with ID: ${id}`);
		return culture;
	} catch (error) {
		logger.error(
			`Error fetching Culture with ID ${req.params.id}: ${error.message}`,
		);
		return error;
		// res.status(500).json({ error: error.message });
	}
}

/**
 * PUT: Updates an existing Culture.
 * @param req Express request object containing the new 'name', 'periodId', 'bladeShapes', 'baseShapes', 'haftingShapes', 'crossSections', and 'materials' for the Culture.
 * @pre The Culture with the given ID must exist in the database, and 'periodId' must reference an existing Period if provided.
 * @post Updates and returns the specified Culture in the database.
 * @return Returns the updated Culture object or a message indicating the Culture or Period was not found.
 */
async function updateCulture(req) {
	const { id } = req.params;
	logger.info("Updating Culture with id: " + id);
	const {
		name,
		periodId,
		bladeShapes,
		baseShapes,
		haftingShapes,
		crossSections,
		materials,
	} = req.body;
	try {
		const idInt = parseInt(id);
		assert(!isNaN(idInt), "Invalid ID provided.");
		assert(name, "Updated name is required.");

		const cultureRepository = await myDatabase.getRepository(Culture);
		let cultureToUpdate = await cultureRepository.findOneBy({ id: idInt });
		assert(cultureToUpdate, "Culture not found.");

		if (periodId) {
			const period = await myDatabase
				.getRepository(Period)
				.findOneBy({ id: periodId });
			assert(period, "Period not found.");
			cultureToUpdate.period = period;
		}

		//go through given hafting shapes, get their objects and store it in an array for updating.
		//have to do this 4 times, once for each shape.
		logger.info(Array(haftingShapes));
		const haftingShapeObjArray = new Array();
		if (haftingShapes) {
			for (let i = 0; i < haftingShapes.length; i++) {
				let currentId = parseInt(haftingShapes[i]);
				let currentHaftingShape;
				//check if the current index is just an id, or a hafting shape object with an id key.
				assert(
					!isNaN(currentId) || Object.hasOwn(haftingShapes[i], "id"),
					"Index " +
						i +
						" of the given haftingShape array is not a hafting shape object or an id.",
				);
				//check if its an id
				if (isNaN(currentId) && Object.hasOwn(haftingShapes[i], "id")) {
					currentId = parseInt(haftingShapes[i].id);
				} else if (isNaN(currentId) && !Object.hasOwn(haftingShapes[i], "id")) {
					logger.debug(
						"Index " +
							i +
							" of the given haftingShape array is not a hafting shape object or an id. But passed assertion",
					);
					continue;
				}
				currentHaftingShape = currentId
					? await myDatabase
							.getRepository(HaftingShape)
							.findOneBy({ id: currentId })
					: null;
				if (currentHaftingShape != null) {
					haftingShapeObjArray.push(currentHaftingShape);
				}
			}
		}

		//go through given blade shapes, get their objects and store it in an array for updating.
		logger.info(Array(bladeShapes));
		const bladeShapeObjArray = new Array();
		if (bladeShapes) {
			for (let i = 0; i < bladeShapes.length; i++) {
				let currentId = parseInt(bladeShapes[i]);
				let currentBladeShape;
				//check if the current index is just an id, or a hafting shape object with an id key.
				assert(
					!isNaN(currentId) || Object.hasOwn(bladeShapes[i], "id"),
					"Index " +
						i +
						" of the given haftingShape array is not a hafting shape object or an id.",
				);
				//if its not an id, check if the object has an id key and set that as the currentid
				if (isNaN(currentId) && Object.hasOwn(bladeShapes[i], "id")) {
					currentId = parseInt(bladeShapes[i].id);
				} else if (isNaN(currentId) && !Object.hasOwn(bladeShapes[i], "id")) {
					logger.debug(
						"Index " +
							i +
							" of the given bladeShape array is not a hafting shape object or an id. But passed assertion",
					);
					continue;
				}
				currentBladeShape = currentId
					? await myDatabase
							.getRepository(BladeShape)
							.findOneBy({ id: currentId })
					: null;
				if (currentBladeShape != null) {
					bladeShapeObjArray.push(currentBladeShape);
				}
			}
		}

		//go through given base shapes, get their objects and store it in an array for updating.
		logger.info(Array(baseShapes));
		const baseShapeObjArray = new Array();
		if (baseShapes) {
			for (let i = 0; i < baseShapes.length; i++) {
				let currentId = parseInt(baseShapes[i]);
				let currentBaseShape;
				//check if the current index is just an id, or a hafting shape object with an id key.
				assert(
					!isNaN(currentId) || Object.hasOwn(baseShapes[i], "id"),
					"Index " +
						i +
						" of the given haftingShape array is not a hafting shape object or an id.",
				);
				//check if its an id
				if (isNaN(currentId) && Object.hasOwn(baseShapes[i], "id")) {
					currentId = parseInt(baseShapes[i].id);
				} else if (isNaN(currentId) && !Object.hasOwn(baseShapes[i], "id")) {
					logger.debug(
						"Index " +
							i +
							" of the given baseShape array is not a hafting shape object or an id. But passed assertion",
					);
					continue;
				}
				currentBaseShape = currentId
					? await myDatabase
							.getRepository(BaseShape)
							.findOneBy({ id: currentId })
					: null;
				if (currentBaseShape != null) {
					baseShapeObjArray.push(currentBaseShape);
				}
			}
		}

		//go through given base shapes, get their objects and store it in an array for updating.
		logger.info(Array(crossSections));
		const crossSectionObjArray = new Array();
		if (crossSections) {
			for (let i = 0; i < crossSections.length; i++) {
				let currentId = parseInt(crossSections[i]);
				let currentCrossSection;
				//check if the current index is just an id, or a hafting shape object with an id key.
				assert(
					!isNaN(currentId) || Object.hasOwn(crossSections[i], "id"),
					"Index " +
						i +
						" of the given haftingShape array is not a hafting shape object or an id.",
				);
				//check if its an id
				if (isNaN(currentId) && Object.hasOwn(crossSections[i], "id")) {
					currentId = parseInt(crossSections[i].id);
				} else if (isNaN(currentId) && !Object.hasOwn(crossSections[i], "id")) {
					logger.debug(
						"Index " +
							i +
							" of the given crossSection array is not a hafting shape object or an id. But passed assertion",
					);
					continue;
				}
				currentCrossSection = currentId
					? await myDatabase
							.getRepository(CrossSection)
							.findOneBy({ id: currentId })
					: null;
				if (currentCrossSection != null) {
					crossSectionObjArray.push(currentCrossSection);
				}
			}
		}

		logger.info(Array(materials));
		const materialObjArray = new Array();
		if (materials) {
			for (let i = 0; i < materials.length; i++) {
				let currentId = parseInt(materials[i]);
				let currentMaterial;
				//check if the current index is just an id, or a hafting shape object with an id key.
				assert(
					!isNaN(currentId) || Object.hasOwn(materials[i], "id"),
					"Index " +
						i +
						" of the given haftingShape array is not a hafting shape object or an id.",
				);
				//check if its an id
				if (isNaN(currentId) && Object.hasOwn(materials[i], "id")) {
					currentId = parseInt(materials[i].id);
				} else if (isNaN(currentId) && !Object.hasOwn(materials[i], "id")) {
					logger.debug(
						"Index " +
							i +
							" of the given material array is not a hafting shape object or an id. But passed assertion",
					);
					continue;
				}
				currentMaterial = currentId
					? await myDatabase
							.getRepository(Material)
							.findOneBy({ id: currentId })
					: null;
				if (currentMaterial != null) {
					materialObjArray.push(currentMaterial);
				}
			}
		}

		cultureToUpdate.name = name;
		cultureToUpdate.bladeShapes = bladeShapes
			? bladeShapeObjArray
			: cultureToUpdate.bladeShapes;
		cultureToUpdate.baseShapes = baseShapes
			? baseShapeObjArray
			: cultureToUpdate.baseShapes;
		cultureToUpdate.haftingShapes = haftingShapes
			? haftingShapeObjArray
			: cultureToUpdate.haftingShapes;
		cultureToUpdate.crossSections = crossSections
			? crossSectionObjArray
			: cultureToUpdate.crossSections;
		cultureToUpdate.materials = materials
			? materialObjArray
			: cultureToUpdate.materials;

		await cultureRepository.save(cultureToUpdate);
		// res.json(cultureToUpdate);
		logger.info(`Updated Culture with ID: ${id}`);
		return cultureToUpdate;
	} catch (error) {
		logger.error(`Error updating Culture with ID ${id}: ${error.message}`);
		return error;
		// res.status(500).json({ error: error.message });
	}
}

/**
 *
 */
async function deleteCulture(req) {
	const id = parseInt(req.params.id);
	try {
		assert(!isNaN(id), "Invalid ID provided for deletion");
		const cultureRepository = await myDatabase.getRepository(Culture);
		const deleteResult = await cultureRepository.delete(id);
		assert(deleteResult.affected > 0, "Culture not found for deletion");
		// res.status(204).send(); // No Content
		logger.info(`Deleted Culture with ID: ${id}`);
		return;
	} catch (error) {
		logger.error(`Error deleting Culture with ID ${id}: ${error.message}`);
		return error;
		// res.status(500).json({ error: error.message });
	}
}

module.exports = {
	newCulture,
	getAllCultures,
	getCultureById,
	updateCulture,
	deleteCulture,
};
