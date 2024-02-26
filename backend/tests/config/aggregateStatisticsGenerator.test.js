/**
 * Unit test Suite for the aggregate statistics feature
 */

/**
 * Data that would be requested during Aggregate Statistics Generation
 *
 * Aggregate statistics
 *      - For Each Point Type
 *           - Average Dimensions
 *           - What % of the collection consists of what point type
 *      - For Each Site
 *          - Number of points
 *          - Type of points
 *              - % split of points
 *          - Materials
 *              - % split of materials
 *      - For A Catalogue
 *          - Number of Points
 *          - Type of points
 *               - % split of points
 *          - Materials
 *               - % split of materials
 *
 * Functions
 *      - materialPercentage
 *          - /Are the Percentages of the material types calculated properly?
 *          - /With an Empty List?
 *          - /With a large List?
 *      - projectilePointPercentage
 *          - /Are the Percentages of the point types calculated properly?
 *          - /With an Empty List?
 *          - /With a large List
 *      - averageProjectilePointDimensions
 *          - /Are the average dimensions calculated properly?
 *      - aggregateSiteStatistics
 *          - /is it getting the projectile/material %s?
 *          - /Is it getting the average dimensions of the points in the site?
 *          - /a site that doesnt exist?
 *          - /an existing site
 *          - /an existing large site
 *      - aggregateCatalogueStatistics
 *          - is it getting the projectile/material %s?
 *          - Is it getting the average dimensions of the points in the site?
 *          - a site that doesnt exist?
 *          - an existing site
 *          - an existing large site
 *      - aggregatePointTypeStatistics
 *          - is it getting the projectile/material %s?
 *          - Is it getting the average dimensions of the points in the site?
 *          - a site that doesnt exist?
 *          - an existing site
 *          - an existing large site
 */

/**
 * Materials:
 * 		Agate Jasper: https://projectilepoints.net/Materials/Agate%20Jasper.html
 * 			id: 1
 * 			name: "Agate Jasper"
 * 			description: "Agate Jasper is when both agate and jasper form together.
 * 						  The color ranges from yellow to brown or green.  Part if the material
 * 						  will be banded and be translucent while the remaining material will be
 * 						  mottled and opaque."
 *
 * 		Alberta Ironstone: https://projectilepoints.net/Materials/Alberta%20Ironstone.html
 * 			id: 2
 * 			name: "Alberta Ironstone"
 * 			description: "Alberta Ironstone ranges from a dark rusty brown to black."
 *
 * 		Alibates Chert: https://projectilepoints.net/Materials/Alibates%20Chert.html
 * 			id: 3
 * 			name: "Alibates Chert"
 * 			description: "Alibates Chert ranges in mottled or variegated with colors from most
 * 						  commonly reds, yellows, and oranges in iron rich areas to blues and dark
 * 						  greens in manganese rich areas. Burgundy and white variations are commonly
 * 						  called 'bacon strip' variety."
 *
 * 		Barger Gulch Chert: https://projectilepoints.net/Materials/Barger%20Gulch%20Chert.html
 * 			id: 4
 * 			name: "Barger Gulch Chert"
 * 			description: "Barger Gulch chert is similar to chalcedony with a translucent base with
 * 						  hues ranging from white to light yellow. Black dendric, starburst
 * 						  inclusions are present."
 */

/**
 * Artifacts:
 * 		Blackwater Side Notch: https://projectilepoints.net/Points/Blackwater.html
 * 			id: 1
 * 			name: "Blackwater Side Notch"
 * 			description:
 *
 * 		Athapaskan Notched: https://projectilepoints.net/Points/Athapaskan%20Notched.html
 *  		id: 2
 * 			name: "Athapaskan Notched"
 * 			description:
 *
 * 		Galt Side Notch: https://projectilepoints.net/Points/Galt.html
 * 			id: 3
 * 			name: "Galt Side Notch"
 * 			description:
 *
 * 		Gatecliff Stemmed: https://projectilepoints.net/Points/Gatecliff.html
 * 			id: 4
 * 			name: "Gatecliff Stemmed"
 * 			description:
 *
 * 		Alberta Stemmed: https://projectilepoints.net/Points/Alberta.html
 * 			id: 5
 * 			name: "Alberta Stemmed"
 * 			description:
 *
 * 		Silver Lake Stemmed: https://projectilepoints.net/Points/SIlver_Lake.html
 * 			id: 6
 * 			name: "Silver Lake Stemmed"
 * 			description:
 *
 * 		Humboldt Basal Notch: https://projectilepoints.net/Points/Humboldt_Basal.html
 * 			id: 7
 * 			name: "Humboldt Basal Notch"
 * 			description:
 *
 * 		Embarras Bi-Point: https://projectilepoints.net/Points/Embarras%20Bi-point.html
 * 			id: 8
 * 			name: "Embarras Bi-Point"
 * 			description:
 *
 * 		Cody Knife: https://projectilepoints.net/Points/Cody.html
 * 			id: 9
 * 			name: "Cody Knife"
 * 			description:
 */

const {
	materialPercentage,
	projectilePointPercentage,
	averageProjectilePointDimensions,
	aggregateSiteStatistics,
	aggregateCatalogueStatistics,
	aggregatePointTypeStatistics,
} = require("../../controllers/aggregateStatisticsController");

//NOTE: There is currently no test data to work with, so any tests that would use any test data
//      currently do not function properly
describe("Tests for the function: materialPercentage()", () => {
	test("Attempt to calculate percentages with an empty list", () => {
		const percentages = materialPercentage([]);
		expect(percentages).toBe(null);
	});

	test("Attempt to calculate percentages with a populated list expecting correct return", () => {
		const materialArray = new Array(
			"Type 1",
			"Type 1",
			"Type 1",
			"Type 1",
			"Type 1",
			"Type 2",
			"Type 2",
			"Type 2",
			"Type 2",
			"Type 2",
			"Type 3",
			"Type 3",
			"Type 3",
			"Type 3",
			"Type 3",
			"Type 4",
			"Type 4",
			"Type 4",
			"Type 4",
			"Type 4",
		);
		const percentages = materialPercentage(materialArray);
		expect(parseFloat(percentages.get("Type 1"))).toBe(0.25);
		expect(parseFloat(percentages.get("Type 2"))).toBe(0.25);
		expect(parseFloat(percentages.get("Type 3"))).toBe(0.25);
		expect(parseFloat(percentages.get("Type 4"))).toBe(0.25);
	});
});

describe("Tests for the function: projectilePointPercentage()", () => {
	test("Attempt to calculate percentages with an empty list", () => {
		const percentages = projectilePointPercentage([]);
		expect(percentages).toEqual([]);
	});

	test("Attempt to calculate percentages with a populated list expecting correct return", () => {
		const projectileArray = new Array(
			"Type 1",
			"Type 1",
			"Type 1",
			"Type 1",
			"Type 1",
			"Type 2",
			"Type 2",
			"Type 2",
			"Type 2",
			"Type 2",
			"Type 3",
			"Type 3",
			"Type 3",
			"Type 3",
			"Type 3",
			"Type 4",
			"Type 4",
			"Type 4",
			"Type 4",
			"Type 4",
		);
		const percentages = projectilePointPercentage(projectileArray);
		expect(percentages.get("Type 1")).toEqual(0.25);
		expect(percentages.get("Type 2")).toEqual(0.25);
		expect(percentages.get("Type 3")).toEqual(0.25);
		expect(percentages.get("Type 4")).toEqual(0.25);
	});
});

describe("Tests for the function: averageProjectilePointDimensions()", () => {
	test("Calculate the average dimensions on an empty set of data", () => {
		const averageDimensions = averageProjectilePointDimensions([]);
		expect(averageDimensions).toEqual(null);
	});

	test("Calculate the average dimensions on a small set of data", () => {
		const averageDimensions = averageProjectilePointDimensions([
			[2.1, 6.7, 0.3],
			[3.4, 7.2, 0.6],
			[2.2, 5.0, 0.7],
		]);
		expect(averageDimensions).toEqual([2.57, 6.3, 5.33]);
	});
});

describe("Tests for function: aggregateSiteStatistics()", () => {
	beforeAll(() => {
		//TODO: if anything needs to be populated before these tests do here
	});

	afterAll(() => {
		//TODO: clean up of test data done here
	});

	test("Correctly acquiring the data?", () => {
		//TODO: once the data is populated properly fill this out.
		const siteStatistics = aggregateSiteStatistics(1);
		expect(siteStatistics.MaterialData.MaterialCount).toEqual([]);
		expect(siteStatistics.MaterialData.MaterialTypes).toEqual([]);
		expect(siteStatistics.MaterialData.MaterialPercentages).toEqual([]);
		expect(siteStatistics.ProjectileData.ProjectileCount).toEqual([]);
		expect(siteStatistics.ProjectileData.ProjectileTypes).toEqual([]);
		expect(siteStatistics.ProjectileData.ProjectilePercentages).toEqual([]);
		expect(siteStatistics.ProjectileData.AverageDimensions).toEqual([]);
	});

	test("Correctly acquiring the data for a large site?", () => {
		//TODO: once the data is populated properly fill this out.
		const siteStatistics = aggregateSiteStatistics(2);
		expect(siteStatistics.MaterialData.MaterialCount).toEqual([]);
		expect(siteStatistics.MaterialData.MaterialTypes).toEqual([]);
		expect(siteStatistics.MaterialData.MaterialPercentages).toEqual([]);
		expect(siteStatistics.ProjectileData.ProjectileCount).toEqual([]);
		expect(siteStatistics.ProjectileData.ProjectileTypes).toEqual([]);
		expect(siteStatistics.ProjectileData.ProjectilePercentages).toEqual([]);
		expect(siteStatistics.ProjectileData.AverageDimensions).toEqual([]);
	});

	test("does it properly handle an empty input", () => {
		const siteStatistics = aggregateSiteStatistics();
		expect(siteStatistics.MaterialData.MaterialCount).toEqual([]);
		expect(siteStatistics.MaterialData.MaterialTypes).toEqual([]);
		expect(siteStatistics.MaterialData.MaterialPercentages).toEqual([]);
		expect(siteStatistics.ProjectileData.ProjectileCount).toEqual([]);
		expect(siteStatistics.ProjectileData.ProjectileTypes).toEqual([]);
		expect(siteStatistics.ProjectileData.ProjectilePercentages).toEqual([]);
		expect(siteStatistics.ProjectileData.AverageDimensions).toEqual([]);
	});

	test("does it properly handle a site that doesnt exist", () => {
		const siteStatistics = aggregateSiteStatistics(
			"This shouldn't exist lmao 89-0124389-01234890",
		);
		expect(siteStatistics.MaterialData.MaterialCount).toEqual([]);
		expect(siteStatistics.MaterialData.MaterialTypes).toEqual([]);
		expect(siteStatistics.MaterialData.MaterialPercentages).toEqual([]);
		expect(siteStatistics.ProjectileData.ProjectileCount).toEqual([]);
		expect(siteStatistics.ProjectileData.ProjectileTypes).toEqual([]);
		expect(siteStatistics.ProjectileData.ProjectilePercentages).toEqual([]);
		expect(siteStatistics.ProjectileData.AverageDimensions).toEqual([]);
	});
});

describe("Tests for function: aggregateCatalogueStatistics()", () => {
	beforeAll(() => {
		//TODO: if anything needs to be populated before these tests do here
	});

	afterAll(() => {
		//TODO: clean up of test data done here
	});

	test("Correctly acquiring the data for a catalogue?", () => {
		//TODO: once the data is populated properly fill this out.
		const catalogueStatistics = aggregateCatalogueStatistics(1);
		expect(catalogueStatistics.MaterialData.MaterialCount).toEqual([]);
		expect(catalogueStatistics.MaterialData.MaterialTypes).toEqual([]);
		expect(catalogueStatistics.MaterialData.MaterialPercentages).toEqual([]);
		expect(catalogueStatistics.ProjectileData.ProjectileCount).toEqual([]);
		expect(catalogueStatistics.ProjectileData.ProjectileTypes).toEqual([]);
		expect(catalogueStatistics.ProjectileData.ProjectilePercentages).toEqual(
			[],
		);
		expect(catalogueStatistics.ProjectileData.AverageDimensions).toEqual([]);
	});

	test("Correctly acquiring the data for a large catalogue?", () => {
		//TODO: once the data is populated properly fill this out.
		const catalogueStatistics = aggregateCatalogueStatistics(2);
		expect(catalogueStatistics.MaterialData.MaterialCount).toEqual([]);
		expect(catalogueStatistics.MaterialData.MaterialTypes).toEqual([]);
		expect(catalogueStatistics.MaterialData.MaterialPercentages).toEqual([]);
		expect(catalogueStatistics.ProjectileData.ProjectileCount).toEqual([]);
		expect(catalogueStatistics.ProjectileData.ProjectileTypes).toEqual([]);
		expect(catalogueStatistics.ProjectileData.ProjectilePercentages).toEqual(
			[],
		);
		expect(catalogueStatistics.ProjectileData.AverageDimensions).toEqual([]);
	});

	test("does it properly handle an empty input", () => {
		const catalogueStatistics = aggregateCatalogueStatistics();
		expect(catalogueStatistics.MaterialData.MaterialCount).toEqual([]);
		expect(catalogueStatistics.MaterialData.MaterialTypes).toEqual([]);
		expect(catalogueStatistics.MaterialData.MaterialPercentages).toEqual([]);
		expect(catalogueStatistics.ProjectileData.ProjectileCount).toEqual([]);
		expect(catalogueStatistics.ProjectileData.ProjectileTypes).toEqual([]);
		expect(catalogueStatistics.ProjectileData.ProjectilePercentages).toEqual(
			[],
		);
		expect(catalogueStatistics.ProjectileData.AverageDimensions).toEqual([]);
	});

	test("does it properly handle a site that doesnt exist", () => {
		const catalogueStatistics = aggregateCatalogueStatistics(
			"This shouldn't exist lmao 89-0124389-01234890",
		);
		expect(catalogueStatistics.MaterialData.MaterialCount).toEqual([]);
		expect(catalogueStatistics.MaterialData.MaterialTypes).toEqual([]);
		expect(catalogueStatistics.MaterialData.MaterialPercentages).toEqual([]);
		expect(catalogueStatistics.ProjectileData.ProjectileCount).toEqual([]);
		expect(catalogueStatistics.ProjectileData.ProjectileTypes).toEqual([]);
		expect(catalogueStatistics.ProjectileData.ProjectilePercentages).toEqual(
			[],
		);
		expect(catalogueStatistics.ProjectileData.AverageDimensions).toEqual([]);
	});
});

describe("Tests for function: aggregatePointTypeStatistics()", () => {
	beforeAll(() => {
		//TODO: if anything needs to be populated before these tests do here
	});

	afterAll(() => {
		//TODO: clean up of test data done here
	});

	test("Correctly acquiring the data for a catalogue?", () => {
		//TODO: once the data is populated properly fill this out.
		const pointTypeStatistics = aggregatePointTypeStatistics(1);
		expect(pointTypeStatistics.MaterialData.MaterialCount).toEqual([]);
		expect(pointTypeStatistics.MaterialData.MaterialTypes).toEqual([]);
		expect(pointTypeStatistics.MaterialData.MaterialPercentages).toEqual([]);
		expect(pointTypeStatistics.ProjectileData.ProjectileCount).toEqual([]);
		expect(pointTypeStatistics.ProjectileData.ProjectileTypes).toEqual([]);
		expect(pointTypeStatistics.ProjectileData.ProjectilePercentages).toEqual(
			[],
		);
		expect(pointTypeStatistics.ProjectileData.AverageDimensions).toEqual([]);
	});

	test("Correctly acquiring the data for a large catalogue?", () => {
		//TODO: once the data is populated properly fill this out.
		const pointTypeStatistics = aggregatePointTypeStatistics(2);
		expect(pointTypeStatistics.MaterialData.MaterialCount).toEqual([]);
		expect(pointTypeStatistics.MaterialData.MaterialTypes).toEqual([]);
		expect(pointTypeStatistics.MaterialData.MaterialPercentages).toEqual([]);
		expect(pointTypeStatistics.ProjectileData.ProjectileCount).toEqual([]);
		expect(pointTypeStatistics.ProjectileData.ProjectileTypes).toEqual([]);
		expect(pointTypeStatistics.ProjectileData.ProjectilePercentages).toEqual(
			[],
		);
		expect(pointTypeStatistics.ProjectileData.AverageDimensions).toEqual([]);
	});

	test("does it properly handle an empty input", () => {
		const pointTypeStatistics = aggregatePointTypeStatistics();
		expect(pointTypeStatistics.MaterialData.MaterialCount).toEqual([]);
		expect(pointTypeStatistics.MaterialData.MaterialTypes).toEqual([]);
		expect(pointTypeStatistics.MaterialData.MaterialPercentages).toEqual([]);
		expect(pointTypeStatistics.ProjectileData.ProjectileCount).toEqual([]);
		expect(pointTypeStatistics.ProjectileData.ProjectileTypes).toEqual([]);
		expect(pointTypeStatistics.ProjectileData.ProjectilePercentages).toEqual(
			[],
		);
		expect(pointTypeStatistics.ProjectileData.AverageDimensions).toEqual([]);
	});

	test("does it properly handle a site that doesnt exist", () => {
		const pointTypeStatistics = aggregatePointTypeStatistics(
			"This shouldn't exist lmao 89-0124389-01234890",
		);
		expect(pointTypeStatistics.MaterialData.MaterialCount).toEqual([]);
		expect(pointTypeStatistics.MaterialData.MaterialTypes).toEqual([]);
		expect(pointTypeStatistics.MaterialData.MaterialPercentages).toEqual([]);
		expect(pointTypeStatistics.ProjectileData.ProjectileCount).toEqual([]);
		expect(pointTypeStatistics.ProjectileData.ProjectileTypes).toEqual([]);
		expect(pointTypeStatistics.ProjectileData.ProjectilePercentages).toEqual(
			[],
		);
		expect(pointTypeStatistics.ProjectileData.AverageDimensions).toEqual([]);
	});
});
