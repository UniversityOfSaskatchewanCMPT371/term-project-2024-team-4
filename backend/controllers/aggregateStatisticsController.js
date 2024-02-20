/**
 * Contains function calls for calculating aggregate statistics
 *
 * Currently just stubs for test calls.
 */

/**
 * Takes an array of materials and calculates the percent split of the total
 * e.g. a list of 16 materials 4 of each type, and there exist 4 different types of materials
 *      return: {"Material1":[0.25], "Material2":[0.25], "Material3":[0.25], "Material4":[0.25]}
 * @param {Array} materialArray an array containing a list of materials.
 * @returns a dictionary containing the keys for the Materials and their percentages
 */
function materialPercentage(materialArray) {
	//TODO: Code the materialPercentage function
	logger.info("Running materialPercentage()");
	return null;
}

/**
 * Takes an array of Projectiles and calculates the percent split of the total
 * e.g. a list of 16 Projectiles 4 of each type, and there exist 4 different types of projectile points
 *      return: {"Projectile1":[0.25], "Projectile2":[0.25], "Projectile3":[0.25], "Projectile4":[0.25]}
 * @param {Array} projectilePointArray
 * @returns a dictionary containing the keys for the Projectiles and their percentages
 */
function projectilePointPercentage(projectilePointArray) {
	//TODO: Code the projectilePointPercentage function
	logger.info("Running projectilePointPercentage()");
	return null;
}

/**
 * NOTE: this function may change based on understanding of how the dimensions are taken and saved
 *
 * Takes an array of Artifacts and calculates the average dimensions of the set.
 * e.g. [[2.10, 6.70, 0.30], [3.40, 7.20, 0.60], [2.20, 5.00, 0.70]] ([x, y, z])
 *      return: [2.57, 6.3, 5.33]
 * @param {Array} artifactArray
 * @returns a list containing the average values of [x, y, z]
 */
function averageProjectilePointDimensions(artifactArray) {
	//TODO: code the averageProjectilePointDimensions function
	logger.info("Running averageProjectilePointDimensions()");
	return null;
}

/**
 * NOTE: the return of this function may be adjusted
 *
 * Given a site Id, calculate the aggregate statistics for that site
 * @param siteId (a number related to a specific site)
 * @returns a dictionary containing the keys: {"MaterialData":{"MaterialCount":[int], "MaterialTypes":[String], "MaterialPercentages":[floats]},
 *                                             "ProjectileData":{"ProjectileCount":[int], "ProjectileTypes":[String], "ProjectilePercentages":[floats], "AverageDimensions":[float]}}
 */
function aggregateSiteStatistics(siteId) {
	//TODO: code the aggregateSiteStatistics function
	logger.info("Running aggregateSiteStatistics()");
	return null;
}

/**
 * NOTE: the return of this function may be adjusted
 *
 * Given a catalogue Id, calculate the aggregate statistics for that catalogue
 * @param catalogueId (a number related to a specific catalogue)
 * @returns a dictionary containing the keys: {"MaterialData":{"MaterialCount":[int], "MaterialTypes":[String], "MaterialPercentages":[floats]},
 *                                             "ProjectileData":{"ProjectileCount":[int], "ProjectileTypes":[String], "ProjectilePercentages":[floats], "AverageDimensions":[float]}}
 */
function aggregateCatalogueStatistics(catalogueId) {
	//TODO: code the aggregateCatalogueStatistics function
	logger.info("Running aggregateSiteStatistics()");
	return null;
}

/**
 * Given a point type, calculate the aggregate statistics for that point type
 * @param {String} pointType
 * @returns a dictionary containing the keys: {"MaterialData":{"MaterialCount":[int], "MaterialTypes":[String], "MaterialPercentages":[floats]},
 *                                             "ProjectileData":{"ProjectileCount":[int], "ProjectileTypes":[String], "ProjectilePercentages":[floats], "AverageDimensions":[float]}}
 */
function aggregatePointTypeStatistics(pointType) {
	//TODO: code the aggregateCatalogueStatistics function
	logger.info(
		"Running aggregatePointTypeStatistics on pointType: " + pointType,
	);
	return null;
}
