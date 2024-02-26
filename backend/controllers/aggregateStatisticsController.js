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

	if (materialArray.length != 0) {
		//var currMaterial = materialArray[0];
		const materialCountMap = new Map();
		materialCountMap.set("Total", 0);
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
			//increase total count
			const newTotal = materialCountMap.get("Total") + 1;
			//.set is supposed to update the value, but for some reason it doesn't in this loop, so i have to delete the key then update it.
			materialCountMap.delete("Total");
			materialCountMap.set("Total", newTotal);
		}
		const materialPercentageMap = new Map();
		//iterate through map entries and calculate percentages.
		for (let [key, value] of materialCountMap.entries()) {
			materialPercentageMap.set(key, value / materialCountMap.get("Total"));
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
 * e.g. a list of 16 Projectiles 4 of each type, and there exist 4 different types of projectile points
 *      return: {"Projectile1":[0.25], "Projectile2":[0.25], "Projectile3":[0.25], "Projectile4":[0.25]}
 * @param {Array} projectilePointArray an array containing a list of projectile point types.
 * @returns {Map} a map containing the keys for the Projectiles and their percentages
 */
function projectilePointPercentage(projectilePointArray) {
	//TODO: Code the projectilePointPercentage function
	logger.info(
		"Running projectilePointPercentage() with value: " + projectilePointArray,
	);
	return null;
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
	return null;
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
