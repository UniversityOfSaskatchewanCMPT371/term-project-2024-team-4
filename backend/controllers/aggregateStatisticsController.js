/**
 * Contains function calls for calculating aggregate statistics
 */

const { logger } = require("../config/logger.js");
const assert = require("node:assert/strict");
const sitesHelper = require("../helperFiles/sitesHelper.js");
const cataloguesHelper = require("../helperFiles/cataloguesHelper.js");
const artifactTypesHelper = require("../helperFiles/artifactTypesHelper.js");

/**
 * Takes an array of materials and calculates the percent split of the total
 * e.g. a list of 16 materials 4 of each type, and there exist 4 different types of materials
 *      return: {"Material1":[0.25], "Material2":[0.25], "Material3":[0.25], "Material4":[0.25]}
 * @param {Array} materialArray an array containing a list of artifact materials.
 * @returns {Map} a map containing the keys for the Materials and their percentages
 */
function materialPercentage(materialArray) {
	assert.notEqual(materialArray, null);
	assert.equal(Array.isArray(materialArray), true);

	if (materialArray.length > 0) {
		//var currMaterial = materialArray[0];
		const materialCountMap = new Map();
		for (let i = 0; i < materialArray.length; i++) {
			//if the current material doesnt exist in the Map, add it with a value of 1.
			var currMaterial = materialArray[i];
			if (!materialCountMap.has(currMaterial)) {
				materialCountMap.set(currMaterial, 1);
			}
			//if it is in the map, increase its count by 1.
			else {
				const newMaterialCount = materialCountMap.get(currMaterial) + 1;
				//.set is supposed to update the value, but for some reason it doesn't in this loop, so i have to delete the key then update it.
				materialCountMap.delete(currMaterial);
				materialCountMap.set(currMaterial, newMaterialCount);
			}
		}
		const materialPercentageMap = new Map();
		//iterate through map entries and calculate percentages.
		for (let [key, value] of materialCountMap.entries()) {
			materialPercentageMap.set(key, (value / materialArray.length).toFixed(2));
		}
		return materialPercentageMap;
	} else {
		logger.debug("materialPercentage() was given an empty array.");
		return null;
	}
}

/**
 * Takes an array of Projectiles and calculates the percent split of the total
 * e.g. a list of
 *      return: {"Blade Shape": {"Triangular": 0.25, "Excurvate": 0.25, "Incurvate": 0.25, "Ovate": 0.25},
 * 				 "Base Shape": {"Straight": 0.33, "Concave": 0.33, "Convex": 0.33},
 * 				 "Cross Section": {"Rhombiod": 0.17, "Lemicular": 0.17, "Plano-Convex": 0.17,
 * 								   "Flutex": 0.17, "Median Ridged": 0.17, "Flat": 0.17}}
 * This differs from materialPercentage, since there is a predefined list of projectile types to choose from
 * @param {Array} projectilePointArray an array containing a list of projectile point types.
 * @returns {Map} a map containing the keys for the Projectiles and their percentages
 */
function projectilePointPercentage(projectilePointArray) {
	const pointPercentageMap = new Map();
	const bladeShapeCountMap = new Map();
	const baseShapeCountMap = new Map();
	const haftingShapeCountMap = new Map();
	const crossSectionCountMap = new Map();

	if (projectilePointArray.length > 0) {
		for (let i = 0; i < projectilePointArray.length; i++) {
			assert.equal(Object.hasOwn(projectilePointArray[i], "bladeShape"), true);
			assert.equal(Object.hasOwn(projectilePointArray[i], "baseShape"), true);
			assert.equal(
				Object.hasOwn(projectilePointArray[i], "haftingShape"),
				true,
			);
			assert.equal(
				Object.hasOwn(projectilePointArray[i], "crossSection"),
				true,
			);
			const currProjectile = projectilePointArray[i];

			//bools to make sure that a shape type isnt updated more than once.
			var checkBladeShape = false;
			var checkBaseShape = false;
			var checkHaftingShape = false;
			var checkCrossSection = false;

			if (
				currProjectile.bladeShape &&
				!bladeShapeCountMap.has(currProjectile.bladeShape.name)
			) {
				bladeShapeCountMap.set(currProjectile.bladeShape.name, 1);
				checkBladeShape = true;
			} else if (currProjectile.bladeShape && checkBladeShape === false) {
				//increase bladeshape count for given bladeshape, if it hasnt already been updated.
				const newBladeShapeCount =
					bladeShapeCountMap.get(currProjectile.bladeShape.name) + 1;
				bladeShapeCountMap.delete(currProjectile.bladeShape.name);
				bladeShapeCountMap.set(
					currProjectile.bladeShape.name,
					newBladeShapeCount,
				);
			}
			if (
				currProjectile.baseShape &&
				!baseShapeCountMap.has(currProjectile.baseShape.name)
			) {
				baseShapeCountMap.set(currProjectile.baseShape.name, 1);
				checkBaseShape = true;
			} else if (currProjectile.baseShape && checkBaseShape === false) {
				const newBaseShapeCount =
					baseShapeCountMap.get(currProjectile.baseShape.name) + 1;
				baseShapeCountMap.delete(currProjectile.baseShape.name);
				baseShapeCountMap.set(currProjectile.baseShape.name, newBaseShapeCount);
			}
			if (
				currProjectile.haftingShape &&
				!haftingShapeCountMap.has(currProjectile.haftingShape.name)
			) {
				haftingShapeCountMap.set(currProjectile.haftingShape.name, 1);
				checkHaftingShape = true;
			} else if (currProjectile.haftingShape && checkHaftingShape === false) {
				const newHaftingShapeCount =
					haftingShapeCountMap.get(currProjectile.haftingShape.name) + 1;
				haftingShapeCountMap.delete(currProjectile.haftingShape.name);
				haftingShapeCountMap.set(
					currProjectile.haftingShape.name,
					newHaftingShapeCount,
				);
			}
			if (
				currProjectile.crossSection &&
				!crossSectionCountMap.has(currProjectile.crossSection.name)
			) {
				crossSectionCountMap.set(currProjectile.crossSection.name, 1);
				checkCrossSection = true;
			} else if (currProjectile.crossSection && checkCrossSection === false) {
				const newCrossSectionCount =
					crossSectionCountMap.get(currProjectile.crossSection.name) + 1;
				crossSectionCountMap.delete(currProjectile.crossSection.name);
				crossSectionCountMap.set(
					currProjectile.crossSection.name,
					newCrossSectionCount,
				);
			}
		}

		//init empty percentage maps
		const bladeShapePercentageMap = new Map();
		const baseShapePercentageMap = new Map();
		const haftingShapePercentageMap = new Map();
		const crossSectionPercentageMap = new Map();

		//NOTE: there is probably a better way to do this. but im short on time.
		//populate percentage maps using the countmaps.
		for (let [key, value] of bladeShapeCountMap.entries()) {
			bladeShapePercentageMap.set(
				key,
				(value / projectilePointArray.length).toFixed(2),
			);
		}
		for (let [key, value] of baseShapeCountMap.entries()) {
			baseShapePercentageMap.set(
				key,
				(value / projectilePointArray.length).toFixed(2),
			);
		}
		for (let [key, value] of haftingShapeCountMap.entries()) {
			haftingShapePercentageMap.set(
				key,
				(value / projectilePointArray.length).toFixed(2),
			);
		}
		for (let [key, value] of crossSectionCountMap.entries()) {
			crossSectionPercentageMap.set(
				key,
				(value / projectilePointArray.length).toFixed(2),
			);
		}

		pointPercentageMap.set("Blade Shape", bladeShapePercentageMap);
		pointPercentageMap.set("Base Shape", baseShapePercentageMap);
		pointPercentageMap.set("Hafting Shape", haftingShapePercentageMap);
		pointPercentageMap.set("Cross Section", crossSectionPercentageMap);

		return pointPercentageMap;
	} else {
		logger.debug("projectilePointPercentage was given an empty array");
		return null;
	}
}

/**
 * NOTE: this function may change based on understanding of how the dimensions are taken and saved
 *
 * Takes an array of Artifacts and calculates the average dimensions of the set.
 * e.g. [[2.10, 6.70, 0.30], [3.40, 7.20, 0.60], [2.20, 5.00, 0.70]] ([x, y, z])
 *      return: [2.57, 6.3, 5.33]
 * @param {Array} artifactArray an array containing the average dimensions of artifacts.
 * @returns {Map} a list containing the average values of [x, y, z]
 */
function averageProjectilePointDimensions(artifactArray) {
	assert.notEqual(artifactArray, null);
	assert.equal(Array.isArray(artifactArray), true);
	//init a new set of dimensions
	const averageDimensionArray = new Array(0.0, 0.0, 0.0);
	if (artifactArray.length > 0) {
		for (let i = 0; i < artifactArray.length; i++) {
			var currDimensions = artifactArray[i].dimensions;
			averageDimensionArray[0] += currDimensions[0];
			averageDimensionArray[1] += currDimensions[1];
			averageDimensionArray[2] += currDimensions[2];
		}
		//get tthe average and round to 2 decimal places.
		averageDimensionArray[0] = parseFloat(
			(averageDimensionArray[0] / artifactArray.length).toFixed(2),
		);
		averageDimensionArray[1] = parseFloat(
			(averageDimensionArray[1] / artifactArray.length).toFixed(2),
		);
		averageDimensionArray[2] = parseFloat(
			(averageDimensionArray[2] / artifactArray.length).toFixed(2),
		);
		return averageDimensionArray;
	} else {
		return null;
	}
}

/**
 * NOTE: the return of this function may be adjusted
 *
 * Given a site Id, calculate the aggregate statistics for that site
 * @param siteId (a number related to a specific site)
 * @returns {Map} a map containing the keys:  {"Material Data":{"Material Count":[int], "Material Types":[String], "Material Percentages":[floats]},
 *                                             "Projectile Data":{"Projectile Count":[int], "Projectile Shapes": {"Base Shapes": [String], "Blade Shapes": [String], "Hafting Shapes": [String], "Cross Sections": [String]},
 * 											   "Projectile Types":[String], "Projectile Percentages":[floats], "Average Dimensions":[float]}}
 */
async function aggregateSiteStatistics(siteId) {
	if (siteId === undefined) {
		console.debug("aggregateCatalogueStatistics() received an empty input");
		return null;
	}
	const siteSatisticsMap = new Map();
	const materialDataMap = new Map();
	const projectileDataMap = new Map();

	const currentSiteRes = await sitesHelper.getSiteFromId({
		params: { id: siteId },
	});
	if (
		currentSiteRes instanceof assert.AssertionError ||
		currentSiteRes === "Site not found"
	) {
		console.debug(
			"aggregateSiteStatistics() received a catalog that doesnt exist",
		);
		return "Site not found";
	}
	if (currentSiteRes instanceof Error) {
		console.error("aggregateCatalogueStatistics() encountered an error");
		return currentSiteRes;
	}
	const { artifacts } = currentSiteRes;
	console.log("new 251: " + currentSiteRes.artifacts.artifactType);

	//contains a list of each type of material, no duplicates
	const materialTypeArray = new Array();
	//contains every material, can have duplicates.
	const materialArray = new Array();

	//init all the maps
	const projectileShapeMap = new Map();
	const projectileTypeArray = new Array();
	const bladeShapeArray = new Array();
	const baseShapeArray = new Array();
	const haftingShapeArray = new Array();
	const crossSectionArray = new Array();
	//Materials are stored in the Artifact Type
	for (let i = 0; i < artifacts.length; i++) {
		const currentArtifact = artifacts[i];
		assert.equal(Object.hasOwn(artifacts[i], "artifactType"), true);
		assert.equal(Object.hasOwn(artifacts[i].artifactType, "id"), true);

		//the artifact type contains a list of materials
		for (let j = 0; j < currentArtifact.artifactType.materials.length; j++) {
			const currentMaterial = currentArtifact.artifactType.materials[j];

			materialArray.push(currentMaterial.name);
			//only add a material to the array if it hasnt been added already.
			if (materialTypeArray.indexOf(currentMaterial.name) == -1) {
				materialTypeArray.push(currentMaterial.name);
			}
		}
		if (
			currentArtifact.artifactType &&
			projectileTypeArray.indexOf(currentArtifact.artifactType.id) == -1
		) {
			projectileTypeArray.push(currentArtifact.artifactType.id);
		}
		if (
			currentArtifact.bladeShape &&
			bladeShapeArray.indexOf(currentArtifact.bladeShape.name) == -1
		) {
			bladeShapeArray.push(currentArtifact.bladeShape.name);
		}
		if (
			currentArtifact.baseShape &&
			baseShapeArray.indexOf(currentArtifact.baseShape.name) == -1
		) {
			baseShapeArray.push(currentArtifact.baseShape.name);
		}
		if (
			currentArtifact.haftingShape &&
			haftingShapeArray.indexOf(currentArtifact.haftingShape.name) == -1
		) {
			haftingShapeArray.push(currentArtifact.haftingShape.name);
		}
		if (
			currentArtifact.crossSection &&
			crossSectionArray.indexOf(currentArtifact.crossSection.name) == -1
		) {
			crossSectionArray.push(currentArtifact.crossSection.name);
		}
	}
	//add material data to materialDataMap
	materialDataMap.set("Material Count", materialArray.length);
	materialDataMap.set("Material Types", materialTypeArray);
	materialDataMap.set(
		"Material Percentages",
		materialPercentage(materialArray),
	);
	//add projectile data to projectileDataMap
	projectileDataMap.set("Projectile Count", artifacts.length);
	projectileShapeMap.set("Blade Shapes", bladeShapeArray);
	projectileShapeMap.set("Base Shapes", bladeShapeArray);
	projectileShapeMap.set("Hafting Shapes", haftingShapeArray);
	projectileShapeMap.set("Cross Sections", crossSectionArray);
	projectileDataMap.set("Projectile Shapes", projectileShapeMap);
	projectileDataMap.set(
		"Projectile Percentages",
		projectilePointPercentage(artifacts),
	);
	projectileDataMap.set("Projectile Types", projectileTypeArray);
	projectileDataMap.set(
		"Average Dimensions",
		averageProjectilePointDimensions(artifacts),
	);
	//populate siteStatisticsMap
	siteSatisticsMap.set("Material Data", materialDataMap);
	siteSatisticsMap.set("Projectile Data", projectileDataMap);
	return siteSatisticsMap;
}

/**
 * Given a catalogue Id, calculate the aggregate statistics for that catalogue
 * @param catalogueId (a number related to a specific catalogue)
 * @returns {Map} a map containing the keys: {"Material Data":{"Material Count":[int], "Material Types":[String], "Material Percentages":[floats]},
 *                                             "Projectile Data":{"Projectile Count":[int], "Projectile Shapes": {"Base Shapes": [String], "Blade Shapes": [String], "Hafting Shapes": [String], "Cross Sections": [String]},
 * 											   "Projectile Types":[String], "Projectile Percentages":[floats], "Average Dimensions":[float]}}
 */
async function aggregateCatalogueStatistics(catalogueId) {
	if (catalogueId === undefined) {
		console.debug("aggregateCatalogueStatistics() received an empty input");
		return null;
	}
	const catalogueStatisticsMap = new Map();
	const materialDataMap = new Map();
	const projectileDataMap = new Map();

	const currentCatalogueRes = cataloguesHelper.getCatalogueFromId({
		params: { id: catalogueId },
	});
	const cat = await currentCatalogueRes;
	if (cat instanceof assert.AssertionError || cat === "Catalogue not found") {
		console.debug(
			"aggregateCatalogueStatistics() received a catalog that doesnt exist",
		);
		return "Catalogue not found";
	}
	if (cat instanceof Error) {
		console.error("aggregateCatalogueStatistics() encountered an error");
		return cat;
	}
	console.log("355: " + cat);
	const { sites } = cat;
	console.log("357: " + sites);

	//contains a list of each type of material, no duplicates
	const materialTypeArray = new Array();
	//contains every material, can have duplicates. needed for material percentage.
	const materialArray = new Array();
	//contains every artifact, can have duplicates
	const artifactArray = new Array();

	const projectileShapeMap = new Map();
	const projectileTypeArray = new Array();
	const bladeShapeArray = new Array();
	const baseShapeArray = new Array();
	const haftingShapeArray = new Array();
	const crossSectionArray = new Array();

	var artifactCount = 0;

	for (let i = 0; i < sites.length; i++) {
		assert.equal(Object.hasOwn(sites[i], "artifacts"), true);
		const currentSite = sites[i];
		for (let j = 0; j < currentSite.artifacts.length; j++) {
			assert.equal(
				Object.hasOwn(currentSite.artifacts[j], "artifactType"),
				true,
			);
			assert.equal(
				Object.hasOwn(currentSite.artifacts[j].artifactType, "id"),
				true,
			);
			artifactCount += 1;
			const currentArtifact = currentSite.artifacts[j];
			artifactArray.push(currentArtifact);
			//the artifact type contains a list of materials
			for (let k = 0; k < currentArtifact.artifactType.materials.length; k++) {
				const currentMaterial = currentArtifact.artifactType.materials[k];
				materialArray.push(currentMaterial.name);
				//only add a material to the array if it hasnt been added already.
				if (materialTypeArray.indexOf(currentMaterial.name) == -1) {
					materialTypeArray.push(currentMaterial.name);
				}
			}
			if (
				currentArtifact.artifactType &&
				projectileTypeArray.indexOf(currentArtifact.artifactType.id) == -1
			) {
				projectileTypeArray.push(currentArtifact.artifactType.id);
			}
			if (
				currentArtifact.bladeShape &&
				bladeShapeArray.indexOf(currentArtifact.bladeShape.name) == -1
			) {
				bladeShapeArray.push(currentArtifact.bladeShape.name);
			}
			if (
				currentArtifact.baseShape &&
				baseShapeArray.indexOf(currentArtifact.baseShape.name) == -1
			) {
				baseShapeArray.push(currentArtifact.baseShape.name);
			}
			if (
				currentArtifact.haftingShape &&
				haftingShapeArray.indexOf(currentArtifact.haftingShape.name) == -1
			) {
				haftingShapeArray.push(currentArtifact.haftingShape.name);
			}
			if (
				currentArtifact.crossSection &&
				crossSectionArray.indexOf(currentArtifact.crossSection.name) == -1
			) {
				crossSectionArray.push(currentArtifact.crossSection.name);
			}
		}
	}
	materialDataMap.set("Material Count", materialArray.length);
	materialDataMap.set("Material Types", materialTypeArray);
	materialDataMap.set(
		"Material Percentages",
		materialPercentage(materialArray),
	);
	projectileDataMap.set("Projectile Count", artifactCount);
	projectileShapeMap.set("Blade Shapes", bladeShapeArray);
	projectileShapeMap.set("Base Shapes", baseShapeArray);
	projectileShapeMap.set("Hafting Shapes", haftingShapeArray);
	projectileShapeMap.set("Cross Sections", crossSectionArray);
	projectileDataMap.set("Projectile Shapes", projectileShapeMap);
	projectileDataMap.set(
		"Projectile Percentages",
		projectilePointPercentage(artifactArray),
	);
	projectileDataMap.set("Projectile Types", projectileTypeArray);
	projectileDataMap.set(
		"Average Dimensions",
		averageProjectilePointDimensions(artifactArray),
	);
	catalogueStatisticsMap.set("Material Data", materialDataMap);
	catalogueStatisticsMap.set("Projectile Data", projectileDataMap);

	return catalogueStatisticsMap;
}

//TODO: Not now, not enough time, but there is some repeated code that can be placed into a seperate call function. specifically, in aggregatePointTypeStatistics() and aggregateSiteStatistics(),
//some code parses a list of artifacts and complites data about them in the same way, a function could be written to somplify it and make it more modular.

/**
 * Given a point type, calculate the aggregate statistics for that point type
 * @param {String} pointType
 * @returns {Map} a map containing the keys: {"MaterialData":{"MaterialCount":[int], "MaterialTypes":[String], "MaterialPercentages":[floats]},
 *                                             "ProjectileData":{"ProjectileCount":[int], "ProjectileTypes":[String], "ProjectilePercentages":[floats], "AverageDimensions":[float]}}
 */
async function aggregatePointTypeStatistics(pointType) {
	if (pointType === undefined) {
		console.debug("aggregateCatalogueStatistics() received an empty input");
		return null;
	}

	const pointTypeStatisticsMap = new Map();
	const materialDataMap = new Map();
	const projectileDataMap = new Map();

	const currentPointTypeRes = await artifactTypesHelper.getArtifactTypeFromId({
		params: { id: pointType },
	});
	if (
		currentPointTypeRes instanceof assert.AssertionError ||
		currentPointTypeRes === "ArtifactType not found"
	) {
		console.debug(
			"aggregatePointTypeStatistics() received an ArtifactType that doesnt exist",
		);
		return "ArtifactType not found";
	}
	if (currentPointTypeRes instanceof Error) {
		console.error("aggregateCatalogueStatistics() encountered an error");
		return currentPointTypeRes;
	}
	const { artifacts } = currentPointTypeRes;

	//contains a list of each type of material, no duplicates
	const materialTypeArray = new Array();
	//contains every material, can have duplicates. needed for material percentage.
	const materialArray = new Array();
	//contains every artifact, can have duplicates

	//init all the maps
	const projectileShapeMap = new Map();
	const projectileTypeArray = new Array();
	const bladeShapeArray = new Array();
	const baseShapeArray = new Array();
	const haftingShapeArray = new Array();
	const crossSectionArray = new Array();
	//Materials are stored in the Artifact Type
	//TODO: maybe put this loop into a seperate function call, its used a couple times elsewhere  ***
	for (let i = 0; i < artifacts.length; i++) {
		assert.equal(Object.hasOwn(artifacts[i], "artifactType"), true);
		assert.equal(Object.hasOwn(artifacts[i].artifactType, "id"), true);
		const currentArtifact = artifacts[i];
		//the artifact type contains a list of materials
		for (let j = 0; j < currentArtifact.artifactType.materials.length; j++) {
			const currentMaterial = currentArtifact.artifactType.materials[j];
			materialArray.push(currentMaterial.name);
			//only add a material to the array if it hasnt been added already.
			if (materialTypeArray.indexOf(currentMaterial.name) == -1) {
				materialTypeArray.push(currentMaterial.name);
			}
		}
		if (
			currentArtifact.artifactType &&
			projectileTypeArray.indexOf(currentArtifact.artifactType.id) == -1
		) {
			projectileTypeArray.push(currentArtifact.artifactType.id);
		}
		if (
			currentArtifact.bladeShape &&
			bladeShapeArray.indexOf(currentArtifact.bladeShape.name) == -1
		) {
			bladeShapeArray.push(currentArtifact.bladeShape.name);
		}
		if (
			currentArtifact.baseShape &&
			baseShapeArray.indexOf(currentArtifact.baseShape.name) == -1
		) {
			baseShapeArray.push(currentArtifact.baseShape.name);
		}
		if (
			currentArtifact.haftingShape &&
			haftingShapeArray.indexOf(currentArtifact.haftingShape.name) == -1
		) {
			haftingShapeArray.push(currentArtifact.haftingShape.name);
		}
		if (
			currentArtifact.crossSection &&
			crossSectionArray.indexOf(currentArtifact.crossSection.name) == -1
		) {
			crossSectionArray.push(currentArtifact.crossSection.name);
		}
	}
	//add material data to materialDataMap
	materialDataMap.set("Material Count", materialArray.length);
	materialDataMap.set("Material Types", materialTypeArray);
	materialDataMap.set(
		"Material Percentages",
		materialPercentage(materialArray),
	);
	//add projectile data to projectileDataMap
	projectileDataMap.set("Projectile Count", artifacts.length);
	projectileShapeMap.set("Blade Shapes", bladeShapeArray);
	projectileShapeMap.set("Base Shapes", bladeShapeArray);
	projectileShapeMap.set("Hafting Shapes", haftingShapeArray);
	projectileShapeMap.set("Cross Sections", crossSectionArray);
	projectileDataMap.set("Projectile Shapes", projectileShapeMap);
	projectileDataMap.set(
		"Projectile Percentages",
		projectilePointPercentage(artifacts),
	);
	projectileDataMap.set("Projectile Types", projectileTypeArray);
	projectileDataMap.set(
		"Average Dimensions",
		averageProjectilePointDimensions(artifacts),
	);
	//populate siteStatisticsMap
	pointTypeStatisticsMap.set("Material Data", materialDataMap);
	pointTypeStatisticsMap.set("Projectile Data", projectileDataMap);
	return pointTypeStatisticsMap;
}

module.exports = {
	materialPercentage,
	projectilePointPercentage,
	averageProjectilePointDimensions,
	aggregateSiteStatistics,
	aggregateCatalogueStatistics,
	aggregatePointTypeStatistics,
};
