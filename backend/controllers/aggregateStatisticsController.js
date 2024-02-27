/**
 * Contains function calls for calculating aggregate statistics
 *
 * Currently just stubs for test calls.
 */

const { logger } = require("backend/config/logger.js");
const assert = require("node:assert/strict");

/**
 * Takes an array of materials and calculates the percent split of the total
 * e.g. a list of 16 materials 4 of each type, and there exist 4 different types of materials
 *      return: {"Material1":[0.25], "Material2":[0.25], "Material3":[0.25], "Material4":[0.25]}
 * @param {Array} materialArray an array containing a list of artifact materials.
 * @returns {Map} a map containing the keys for the Materials and their percentages
 */
function materialPercentage(materialArray) {
	//TODO: Code the materialPercentage function
	logger.info("Running materialPercentage() with value: " + materialArray);

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
		logger.info(materialPercentageMap.toString());
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
	//TODO: Code the projectilePointPercentage function
	logger.info(
		"Running projectilePointPercentage() with value: " + projectilePointArray,
	);

	//Blade Shapes: Triangular, excurvate, incurvate, ovate
	//Base Shapes: Straight, concave, convex
	//Hafting Shapes: ________, straight, basally convcave, expanding, contracting, corner-notched, side-notched, basal-notched, triangular un-notched
	//Cross Sections: rhomboid, Lemicular, plano-convex, flutex, median ridged, flat

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

			//bools to make sure that a shape type isnt updated mroe than once.
			var checkBladeShape = false;
			var checkBaseShape = false;
			var checkHaftingShape = false;
			var checkCrossSection = false;

			if (!bladeShapeCountMap.has(currProjectile.bladeShape)) {
				bladeShapeCountMap.set(currProjectile.bladeShape, 1);
				checkBladeShape = true;
			} else if (checkBladeShape === false) {
				//increase bladeshape count for given bladeshape, if it hasnt already been updated.
				const newBladeShapeCount =
					bladeShapeCountMap.get(currProjectile.bladeShape) + 1;
				bladeShapeCountMap.delete(currProjectile.bladeShape);
				bladeShapeCountMap.set(currProjectile.bladeShape, newBladeShapeCount);
			}
			if (!baseShapeCountMap.has(currProjectile.baseShape)) {
				baseShapeCountMap.set(currProjectile.baseShape, 1);
				checkBaseShape = true;
			} else if (checkBaseShape === false) {
				const newBaseShapeCount =
					baseShapeCountMap.get(currProjectile.baseShape) + 1;
				baseShapeCountMap.delete(currProjectile.baseShape);
				baseShapeCountMap.set(currProjectile.baseShape, newBaseShapeCount);
			}
			if (!haftingShapeCountMap.has(currProjectile.haftingShape)) {
				haftingShapeCountMap.set(currProjectile.haftingShape, 1);
				checkHaftingShape = true;
			} else if (checkHaftingShape === false) {
				const newHaftingShapeCount =
					haftingShapeCountMap.get(currProjectile.haftingShape) + 1;
				haftingShapeCountMap.delete(currProjectile.haftingShape);
				haftingShapeCountMap.set(
					currProjectile.haftingShape,
					newHaftingShapeCount,
				);
			}
			if (!crossSectionCountMap.has(currProjectile.crossSection)) {
				crossSectionCountMap.set(currProjectile.crossSection, 1);
				checkCrossSection = true;
			} else if (checkCrossSection === false) {
				const newCrossSectionCount =
					crossSectionCountMap.get(currProjectile.crossSection) + 1;
				crossSectionCountMap.delete(currProjectile.crossSection);
				crossSectionCountMap.set(
					currProjectile.crossSection,
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
	//TODO: code the averageProjectilePointDimensions function
	logger.info(
		"Running averageProjectilePointDimensions() with value: " + artifactArray,
	);

	assert.notEqual(artifactArray, null);
	assert.equal(Array.isArray(artifactArray), true);
	//TODO: add an assertion that the artifactArray is of the appropriate structure.
	//init a new set of dimensions
	const averageDimensionArray = new Array(0.0, 0.0);
	if (artifactArray.length > 0) {
		for (let i = 0; i < artifactArray.length; i++) {
			var currDimensions = artifactArray[i]; //TODO: this may need to be adjusted to the object sent in.
			averageDimensionArray[0] += currDimensions[0];
			averageDimensionArray[1] += currDimensions[1];
		}
		//get tthe average and round to 2 decimal places.
		averageDimensionArray[0] = parseFloat(
			(averageDimensionArray[0] / artifactArray.length).toFixed(2),
		);
		averageDimensionArray[1] = parseFloat(
			(averageDimensionArray[1] / artifactArray.length).toFixed(2),
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
 * @returns {Map} a map containing the keys:  {"MaterialData":{"MaterialCount":[int], "MaterialTypes":[String], "MaterialPercentages":[floats]},
 *                                             "ProjectileData":{"ProjectileCount":[int], "ProjectileTypes":[String], "ProjectilePercentages":[floats], "AverageDimensions":[float]}}
 */
function aggregateSiteStatistics(siteId) {
	//TODO: code the aggregateSiteStatistics function
	logger.info("Running aggregateSiteStatistics() with value: " + siteId);

	//TODO: MaterialCount
	//TODO: MaterialTypes
	//TODO: MaterialPercentages
	//TODO: ProjectileCount
	//TODO: ProjectileTypes
	//TODO: ProjectilePercentages
	//TODO: AverageDimensions

	return null;
}

/**
 * NOTE: the return of this function may be adjusted
 *
 * Given a catalogue Id, calculate the aggregate statistics for that catalogue
 * @param catalogueId (a number related to a specific catalogue)
 * @returns {Map} a map containing the keys: {"MaterialData":{"MaterialCount":[int], "MaterialTypes":[String], "MaterialPercentages":[floats]},
 *                                             "ProjectileData":{"ProjectileCount":[int], "ProjectileTypes":[String], "ProjectilePercentages":[floats], "AverageDimensions":[float]}}
 */
function aggregateCatalogueStatistics(catalogueId) {
	//TODO: code the aggregateCatalogueStatistics function
	logger.info("Running aggregateSiteStatistics() with value: " + catalogueId);
	return null;
}

/**
 * Given a point type, calculate the aggregate statistics for that point type
 * @param {String} pointType
 * @returns {Map} a map containing the keys: {"MaterialData":{"MaterialCount":[int], "MaterialTypes":[String], "MaterialPercentages":[floats]},
 *                                             "ProjectileData":{"ProjectileCount":[int], "ProjectileTypes":[String], "ProjectilePercentages":[floats], "AverageDimensions":[float]}}
 */
function aggregatePointTypeStatistics(pointType) {
	//TODO: code the aggregateCatalogueStatistics function
	logger.info(
		"Running aggregatePointTypeStatistics() on pointType: " + pointType,
	);
	return null;
}

module.exports = {
	materialPercentage,
	projectilePointPercentage,
	averageProjectilePointDimensions,
	aggregateSiteStatistics,
	aggregateCatalogueStatistics,
	aggregatePointTypeStatistics,
};
