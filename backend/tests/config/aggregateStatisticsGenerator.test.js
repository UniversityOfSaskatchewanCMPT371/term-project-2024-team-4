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

import {
	materialPercentage,
	projectilePointPercentage,
	averageProjectilePointDimensions,
	aggregateSiteStatistics,
	aggregateCatalogueStatistics,
	aggregatePointTypeStatistics,
} from "../../controllers/aggregateStatisticsController";

//NOTE: There is currently no test data to work with, so any tests that would use any test data
//      currently do not function properly
describe("Tests for the function: materialPercentage()", () => {
	beforeAll(() => {
		//TODO: if anything needs to be populated before these tests do here
	});

	afterAll(() => {
		//TODO: clean up of test data done here
	});

	test("Attempt to calculate percentages with an empty list", () => {
		percentages = materialPercentage([]);
		expect(percentages).toEqual([]);
	});

	test("Attempt to calculate percentages with a populated list expecting correct return", () => {
		//TODO: Populate with actual data [materialName, count]
		percentages = materialPercentage([
			[Type1, 5],
			[Type2, 5],
			[Type3, 5],
			[Type4, 5],
		]);
		expect(percentages).toEqual([
			{ Type1: [0.25], Type2: [0.25], Type3: [0.25], Type4: [0.25] },
		]);
	});

	test("Attempt to calculate percentages with a large populated list expecting correct return", () => {
		//TODO: Populate with actual data [materialName, count], and with a large amount of data.
		percentages = materialPercentage([
			[Type1, 5],
			[Type2, 5],
			[Type3, 5],
			[Type4, 5],
			[Type5, 5],
			[Type6, 5],
			[Type7, 5],
			[Type8, 5],
			[Type9, 5],
			[Type10, 5],
			[Type11, 5],
			[Type12, 5],
			[Type13, 5],
			[Type14, 5],
		]); //NOTE: probably more than this lmao
		expect(percentages).toEqual([
			{
				Type1: [0.25],
				Type2: [0.25],
				Type3: [0.25],
				Type4: [0.25],
				Type5: [0.25],
				Type6: [0.25],
				Type7: [0.25],
				Type8: [0.25],
				Type9: [0.25],
				Type10: [0.25],
				Type11: [0.25],
				Type12: [0.25],
				Type13: [0.25],
				Type14: [0.25],
			},
		]);
	});
});

describe("Tests for the function: projectilePointPercentage()", () => {
	beforeAll(() => {
		//TODO: if anything needs to be populated before these tests do here
	});

	afterAll(() => {
		//TODO: clean up of test data done here
	});

	test("Attempt to calculate percentages with an empty list", () => {
		percentages = projectilePointPercentage([]);
		expect(percentages).toEqual([]);
	});

	test("Attempt to calculate percentages with a populated list expecting correct return", () => {
		//TODO: Populate with actual data [projectileName, count]
		percentages = projectilePointPercentage([
			[Type1, 5],
			[Type2, 5],
			[Type3, 5],
			[Type4, 5],
		]);
		expect(percentages).toEqual([
			{ Type1: [0.25], Type2: [0.25], Type3: [0.25], Type4: [0.25] },
		]);
	});

	test("Attempt to calculate percentages with a large populated list expecting correct return", () => {
		//TODO: Populate with actual data [projectileName, count], and with a large amount of data. and maybe using some file to make it look better
		//NOTE: probably more than this lmao,
		percentages = projectilePointPercentage([
			[Type1, 5],
			[Type2, 5],
			[Type3, 5],
			[Type4, 5],
			[Type5, 5],
			[Type6, 5],
			[Type7, 5],
			[Type8, 5],
			[Type9, 5],
			[Type10, 5],
			[Type11, 5],
			[Type12, 5],
			[Type13, 5],
			[Type14, 5],
		]);
		expect(percentages).toEqual([
			{
				Type1: [0.07],
				Type2: [0.07],
				Type3: [0.07],
				Type4: [0.07],
				Type5: [0.07],
				Type6: [0.07],
				Type7: [0.07],
				Type8: [0.07],
				Type9: [0.07],
				Type10: [0.07],
				Type11: [0.07],
				Type12: [0.07],
				Type13: [0.07],
				Type14: [0.07],
			},
		]);
	});
});

describe("Tests for the function: averageProjectilePointDimensions()", () => {
	beforeAll(() => {
		//TODO: if anything needs to be populated before these tests do here
	});

	afterAll(() => {
		//TODO: clean up of test data done here
	});

	test("Calculate the average dimensions on an empty set of data", () => {
		averageDimensions = averageProjectilePointDimensions([]);
		expect(averageDimensions).toEqual([0, 0, 0]);
	});

	test("Calculate the average dimensions on a small set of data", () => {
		averageDimensions = averageProjectilePointDimensions([
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
		siteStatistics = aggregateSiteStatistics(1);
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
		siteStatistics = aggregateSiteStatistics(2);
		expect(siteStatistics.MaterialData.MaterialCount).toEqual([]);
		expect(siteStatistics.MaterialData.MaterialTypes).toEqual([]);
		expect(siteStatistics.MaterialData.MaterialPercentages).toEqual([]);
		expect(siteStatistics.ProjectileData.ProjectileCount).toEqual([]);
		expect(siteStatistics.ProjectileData.ProjectileTypes).toEqual([]);
		expect(siteStatistics.ProjectileData.ProjectilePercentages).toEqual([]);
		expect(siteStatistics.ProjectileData.AverageDimensions).toEqual([]);
	});

	test("does it properly handle an empty input", () => {
		siteStatistics = aggregateSiteStatistics();
		expect(siteStatistics.MaterialData.MaterialCount).toEqual([]);
		expect(siteStatistics.MaterialData.MaterialTypes).toEqual([]);
		expect(siteStatistics.MaterialData.MaterialPercentages).toEqual([]);
		expect(siteStatistics.ProjectileData.ProjectileCount).toEqual([]);
		expect(siteStatistics.ProjectileData.ProjectileTypes).toEqual([]);
		expect(siteStatistics.ProjectileData.ProjectilePercentages).toEqual([]);
		expect(siteStatistics.ProjectileData.AverageDimensions).toEqual([]);
	});

	test("does it properly handle a site that doesnt exist", () => {
		siteStatistics = aggregateSiteStatistics(-192349582399827345692);
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
		catalogueStatistics = aggregateCatalogueStatistics(1);
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
		catalogueStatistics = aggregateCatalogueStatistics(2);
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
		catalogueStatistics = aggregateCatalogueStatistics();
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
		catalogueStatistics = aggregateCatalogueStatistics(-192349582399827345692);
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
		pointTypeStatistics = aggregatePointTypeStatistics(1);
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
		pointTypeStatistics = aggregatePointTypeStatistics(2);
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
		pointTypeStatistics = aggregatePointTypeStatistics();
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
		pointTypeStatistics = aggregatePointTypeStatistics(-192349582399827345692);
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
