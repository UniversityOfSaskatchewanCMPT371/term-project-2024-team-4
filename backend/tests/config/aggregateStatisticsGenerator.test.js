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
//const FileSystem = require("fs");

//NOTE: There is currently no test data to work with, so any tests that would use any test data
//      currently do not function properly
describe("Tests for the function: materialPercentage()", () => {
	test("Attempt to calculate percentages with an empty list", () => {
		const percentages = materialPercentage([]);
		expect(percentages).toBe(null);
	});

	test("Attempt to calculate percentages wssssssith a populated list expecting correct return", () => {
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
		expect(percentages).toEqual(null);
	});

	test("Attempt to calculate percentages with a populated list expecting correct return", () => {
		const projectile1 = {
			bladeShape: "Triangular",
			baseShape: "Straight",
			haftingShape: "Straight",
			crossSection: "Rhomboid",
		};

		const projectile2 = {
			bladeShape: "Excurvate",
			baseShape: "Concave",
			haftingShape: "Basally Concave",
			crossSection: "Lemicular",
		};

		const projectile3 = {
			bladeShape: "Incurvate",
			baseShape: "Convex",
			haftingShape: "Expanding",
			crossSection: "Plano-Convex",
		};

		const projectile4 = {
			bladeShape: "Ovate",
			baseShape: "Concave",
			haftingShape: "Contracting",
			crossSection: "Flutex",
		};

		const projectile5 = {
			bladeShape: "Incurvate",
			baseShape: "Straight",
			haftingShape: "Side-Notched",
			crossSection: "Flat",
		};

		const percentages = projectilePointPercentage([
			projectile1,
			projectile2,
			projectile3,
			projectile4,
			projectile5,
		]);
		expect(
			parseFloat(percentages.get("Blade Shape").get("Triangular")),
		).toEqual(0.2);
		expect(parseFloat(percentages.get("Blade Shape").get("Excurvate"))).toEqual(
			0.2,
		);
		expect(parseFloat(percentages.get("Blade Shape").get("Incurvate"))).toEqual(
			0.4,
		);
		expect(parseFloat(percentages.get("Blade Shape").get("Ovate"))).toEqual(
			0.2,
		);
		expect(parseFloat(percentages.get("Base Shape").get("Straight"))).toEqual(
			0.4,
		);
		expect(parseFloat(percentages.get("Base Shape").get("Concave"))).toEqual(
			0.4,
		);
		expect(parseFloat(percentages.get("Base Shape").get("Convex"))).toEqual(
			0.2,
		);
		expect(
			parseFloat(percentages.get("Hafting Shape").get("Straight")),
		).toEqual(0.2);
		expect(
			parseFloat(percentages.get("Hafting Shape").get("Basally Concave")),
		).toEqual(0.2);
		expect(
			parseFloat(percentages.get("Hafting Shape").get("Expanding")),
		).toEqual(0.2);
		expect(
			parseFloat(percentages.get("Hafting Shape").get("Contracting")),
		).toEqual(0.2);
		expect(
			parseFloat(percentages.get("Hafting Shape").get("Side-Notched")),
		).toEqual(0.2);
		expect(
			parseFloat(percentages.get("Cross Section").get("Rhomboid")),
		).toEqual(0.2);
		expect(
			parseFloat(percentages.get("Cross Section").get("Lemicular")),
		).toEqual(0.2);
		expect(
			parseFloat(percentages.get("Cross Section").get("Plano-Convex")),
		).toEqual(0.2);
		expect(parseFloat(percentages.get("Cross Section").get("Flutex"))).toEqual(
			0.2,
		);
		expect(parseFloat(percentages.get("Cross Section").get("Flat"))).toEqual(
			0.2,
		);
	});
});

describe("Tests for the function: averageProjectilePointDimensions()", () => {
	test("Calculate the average dimensions on an empty set of data", () => {
		const averageDimensions = averageProjectilePointDimensions([]);
		expect(averageDimensions).toEqual(null);
	});

	test("Calculate the average dimensions on a small set of data", () => {
		const projectilePoint1 = {
			id: 1,
			name: "projectilePoint1",
			location: "A place",
			description: "This is projectilePoint1, its neat",
			dimensions: [2.1, 6.7, 0.7],
			photo: "Imagine there is a link here",
			site: 1,
			artifactType: 1,
			culture: 1,
			bladeShape: 1,
			baseShape: 1,
			haftingShape: 1,
			crossSection: 1,
		};

		const projectilePoint2 = {
			id: 1,
			name: "projectilePoint2",
			location: "A place",
			description: "This is projectilePoint2, its neat",
			dimensions: [3.4, 7.2, 0.2],
			photo: "Imagine there is a link here",
			site: 1,
			artifactType: 2,
			culture: 2,
			bladeShape: 2,
			baseShape: 2,
			haftingShape: 2,
			crossSection: 2,
		};

		const projectilePoint3 = {
			id: 1,
			name: "projectilePoint3",
			location: "A place",
			description: "This is projectilePoint3, its neat",
			dimensions: [2.2, 5.0, 0.5],
			photo: "Imagine there is a link here",
			site: 1,
			artifactType: 3,
			culture: 3,
			bladeShape: 3,
			baseShape: 3,
			haftingShape: 3,
			crossSection: 3,
		};
		const averageDimensions = averageProjectilePointDimensions([
			projectilePoint1,
			projectilePoint2,
			projectilePoint3,
		]);
		expect(averageDimensions).toEqual([2.57, 6.3, 0.47]);
	});
});

const getSiteFromId = jest.fn();
const getCatalogueFromId = jest.fn();
const getArtifactTypeFromId = jest.fn();
jest.mock("../helperFiles/sitesHelper.js", () => ({
	getSiteFromId: jest.fn(),
	getCatalogueFromId: jest.fn(),
	getArtifactTypeFromId: jest.fn(),
}));

const catalogue1 = {
	id: 1,
	name: "Catalogue1",
	description: "This is Catalogue 1",
	sites: [site1, site2],
};

const site1 = {
	id: 1,
	name: "Site1",
	description: "This is Site 1",
	location: "This is Site 1's location",
	catalogue: catalogue1,
	region: region1,
	artifacts: [projectilePoint1, projectilePoint2, projectilePoint3],
};

const site2 = {
	id: 2,
	name: "Site2",
	description: "This is Site 2",
	location: "This is Site 2's location",
	catalogue: catalogue1,
	region: region1,
	artifacts: [projectilePoint4, projectilePoint5],
};

const region1 = {
	id: 1,
	name: "Region1",
	description: "This is Region 1",
	sites: [site1, site2],
};

//A bunch of mock test data to use for the aggregateStatisticsFunctions
const material1 = {
	id: 1,
	name: "Material1",
	description: "This is Material1",
	artifactType: artifactType1,
	artifacts: [projectilePoint1],
};

const material2 = {
	id: 1,
	name: "Material2",
	description: "This is Material2",
	artifactType: artifactType2,
	artifacts: [projectilePoint2],
};

const material3 = {
	id: 1,
	name: "Material3",
	description: "This is Material3",
	artifactType: artifactType3,
	artifacts: [projectilePoint3],
};

//ArtifactTypes

const artifactType1 = {
	id: "Lithic",
	materials: [material1],
	artifacts: [projectilePoint1],
};

const artifactType2 = {
	id: "Cermaic",
	materials: [material2],
	artifacts: [projectilePoint2, projectilePoint4],
};

const artifactType3 = {
	id: "Faunal",
	materials: [material3],
	artifacts: [projectilePoint3, projectilePoint5],
};

//Period

const period = {
	id: 1,
	name: "Period1",
	start: 1990,
	end: 2000,
	cultures: [culture1],
};

//Culture

const culture1 = {
	id: 1,
	name: "Culture1",
	period: period,
	projectilePoints: [projectilePoint1, projectilePoint2, projectilePoint3],
	bladeShapes: [bladeShape1, bladeShape2, bladeShape3],
	baseShapes: [baseShape1, baseShape2, baseShape3],
	haftingShapes: [haftingShape1, haftingShape2, haftingShape3],
	crossSections: [crossSection1, crossSection2, crossSection3],
};

//Blade Shapes

const bladeShape1 = {
	id: 1,
	name: "Triangular",
	cultures: [culture1],
	projectilePoints: [projectilePoint1],
};

const bladeShape2 = {
	id: 2,
	name: "Excurvate",
	cultures: [culture1],
	projectilePoints: [projectilePoint2, projectilePoint4],
};

const bladeShape3 = {
	id: 3,
	name: "Incurvate",
	cultures: [culture1],
	projectilePoints: [projectilePoint3, projectilePoint5],
};

//Base Shapes

const baseShape1 = {
	id: 1,
	name: "Straight",
	culture: [culture1],
	projectilePoints: [projectilePoint1, projectilePoint4],
};

const baseShape2 = {
	id: 2,
	name: "Concave",
	culture: [culture1],
	projectilePoints: [projectilePoint2, projectilePoint5],
};

const baseShape3 = {
	id: 3,
	name: "Convex",
	culture: [culture1],
	projectilePoints: [projectilePoint3],
};

//Hafting Shapes

const haftingShape1 = {
	id: 1,
	name: "Straight",
	culture: [culture1],
	projectilePoints: [projectilePoint1, projectilePoint5],
};

const haftingShape2 = {
	id: 2,
	name: "Expanding",
	culture: [culture1],
	projectilePoints: [projectilePoint2],
};

const haftingShape3 = {
	id: 3,
	name: "Contracting",
	culture: [culture1],
	projectilePoints: [projectilePoint2, projectilePoint4],
};

//Cross Sections

const crossSection1 = {
	id: 1,
	name: "Rhomboid",
	culture: [culture1],
	projectilePoints: [projectilePoint1],
};

const crossSection2 = {
	id: 2,
	name: "Lemicular",
	culture: [culture1],
	projectilePoints: [projectilePoint2, projectilePoint4],
};

const crossSection3 = {
	id: 3,
	name: "Flutex",
	culture: [culture1],
	projectilePoints: [projectilePoint3, projectilePoint5],
};

//Projectile Points

const projectilePoint1 = {
	id: 1,
	name: "projectilePoint1",
	location: "A place",
	description: "This is projectilePoint1, its neat",
	dimensions: [3.2, 4.8, 0.4],
	photo: "Imagine there is a link here",
	site: site1,
	artifactType: artifactType1,
	culture: culture1,
	bladeShape: bladeShape1,
	baseShape: baseShape1,
	haftingShape: haftingShape1,
	crossSection: crossSection1,
};

const projectilePoint2 = {
	id: 1,
	name: "projectilePoint2",
	location: "A place",
	description: "This is projectilePoint2, its neat",
	dimensions: [1.9, 6.2, 0.6],
	photo: "Imagine there is a link here",
	site: site1,
	artifactType: artifactType2,
	culture: culture1,
	bladeShape: bladeShape2,
	baseShape: baseShape2,
	haftingShape: haftingShape2,
	crossSection: crossSection2,
};

const projectilePoint3 = {
	id: 1,
	name: "projectilePoint3",
	location: "A place",
	description: "This is projectilePoint3, its neat",
	dimensions: [3.6, 3.9, 0.3],
	photo: "Imagine there is a link here",
	site: site1,
	artifactType: artifactType3,
	culture: culture1,
	bladeShape: bladeShape3,
	baseShape: baseShape3,
	haftingShape: haftingShape3,
	crossSection: crossSection3,
};

const projectilePoint4 = {
	id: 1,
	name: "projectilePoint5",
	location: "A place",
	description: "This is projectilePoint3, its neat",
	dimensions: [3.6, 3.9, 0.3],
	photo: "Imagine there is a link here",
	site: site2,
	artifactType: artifactType2,
	culture: culture1,
	bladeShape: bladeShape2,
	baseShape: baseShape1,
	haftingShape: haftingShape3,
	crossSection: crossSection2,
};

const projectilePoint5 = {
	id: 1,
	name: "projectilePoint5",
	location: "A place",
	description: "This is projectilePoint3, its neat",
	dimensions: [3.6, 3.9, 0.3],
	photo: "Imagine there is a link here",
	site: site2,
	artifactType: artifactType3,
	culture: culture1,
	bladeShape: bladeShape3,
	baseShape: baseShape2,
	haftingShape: haftingShape1,
	crossSection: crossSection3,
};

describe("Tests for function: aggregateSiteStatistics()", () => {
	beforeAll(() => {
		//TODO: if anything needs to be populated before these tests do here
	});

	afterAll(() => {
		//TODO: clean up of test data done here
	});

	test("Correctly acquiring the data?", () => {
		//initializing some dummy data to work with using a mock call of the get site route function

		//Materials
		//mock a return from getSiteFromId to test functionality.
		getSiteFromId.mockReturnValueOnce({
			site1,
		});

		//TODO: once the data is populated properly fill this out.
		const siteStatistics = aggregateSiteStatistics(1);
		expect(siteStatistics.get("MaterialData").get("MaterialCount")).toEqual(3);
		expect(siteStatistics.get("MaterialData").get("MaterialTypes")).toEqual([
			"Material1",
			"Material2",
			"Material3",
		]);
		expect(
			siteStatistics
				.get("MaterialData")
				.get("MaterialPercentages")
				.get("Material1"),
		).toEqual(0.33);
		expect(
			siteStatistics
				.get("MaterialData")
				.get("MaterialPercentages")
				.get("Material2"),
		).toEqual(0.33);
		expect(
			siteStatistics
				.get("MaterialData")
				.get("MaterialPercentages")
				.get("Material3"),
		).toEqual(0.33);
		expect(
			siteStatistics.get("Projectile Data").get("Projectile Count"),
		).toEqual(3);
		expect(
			siteStatistics.get("Projectile Data").get("Projectile Types"),
		).toEqual(["Lithic", "Ceramic", "Faunal"]);
		expect(
			siteStatistics
				.get("Projectile Data")
				.get("Projectile Types")
				.get("Blade Shape"),
		).toEqual(["Triangular", "Exurvate", "Incuvate"]);
		expect(
			siteStatistics
				.get("Projectile Data")
				.get("Projectile Types")
				.get("Base Shape"),
		).toEqual(["Straight", "Concave", "Convex"]);
		expect(
			siteStatistics
				.get("Projectile Data")
				.get("Projectile Types")
				.get("Hafting Shape"),
		).toEqual(["Straight", "Expanding", "Contracting"]);
		expect(
			siteStatistics
				.get("Projectile Data")
				.get("Projectile Types")
				.get("Cross Section"),
		).toEqual(["Rhomboid", "Lemicular", "Flutex"]);
		expect(
			siteStatistics.get("Projectile Data").get("Average Dimensions"),
		).toEqual([2.9, 4.97, 0.43]);
	});

	test("does it properly handle an empty input", () => {
		const siteStatistics = aggregateSiteStatistics();
		expect(siteStatistics).toEqual(null);
	});

	test("does it properly handle a site that doesnt exist", () => {
		getSiteFromId.mockReturnValueOnce("Site not found");
		const siteStatistics = aggregateSiteStatistics(3);
		expect(siteStatistics).toEqual("Site not found");
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
		getCatalogueFromId.mockReturnValueOnce(catalogue1);
		const catalogueStatistics = aggregateCatalogueStatistics(1);
		expect(
			catalogueStatistics.get("MaterialData").get("MaterialCount"),
		).toEqual(3);
		expect(
			catalogueStatistics.get("MaterialData").get("MaterialTypes"),
		).toEqual(["Material1", "Material2", "Material3"]);
		expect(
			catalogueStatistics
				.get("MaterialData")
				.get("MaterialPercentages")
				.get("Material1"),
		).toEqual(0.2);
		expect(
			catalogueStatistics
				.get("MaterialData")
				.get("MaterialPercentages")
				.get("Material2"),
		).toEqual(0.4);
		expect(
			catalogueStatistics
				.get("MaterialData")
				.get("MaterialPercentages")
				.get("Material3"),
		).toEqual(0.4);
		expect(
			catalogueStatistics.get("Projectile Data").get("Projectile Count"),
		).toEqual(5);
		expect(
			catalogueStatistics.get("Projectile Data").get("Projectile Types"),
		).toEqual(["Lithic", "Ceramic", "Faunal"]);
		expect(
			catalogueStatistics
				.get("Projectile Data")
				.get("Projectile Types")
				.get("Blade Shape"),
		).toEqual(["Triangular", "Exurvate", "Incuvate"]);
		expect(
			catalogueStatistics
				.get("Projectile Data")
				.get("Projectile Types")
				.get("Base Shape"),
		).toEqual(["Straight", "Concave", "Convex"]);
		expect(
			catalogueStatistics
				.get("Projectile Data")
				.get("Projectile Types")
				.get("Hafting Shape"),
		).toEqual(["Straight", "Expanding", "Contracting"]);
		expect(
			catalogueStatistics
				.get("Projectile Data")
				.get("Projectile Types")
				.get("Cross Section"),
		).toEqual(["Rhomboid", "Lemicular", "Flutex"]);
		expect(
			catalogueStatistics.get("Projectile Data").get("Average Dimensions"),
		).toEqual([3.18, 4.54, 0.38]);
	});

	test("does it properly handle an empty input", () => {
		const siteStatistics = aggregateCatalogueStatistics();
		expect(siteStatistics).toEqual(null);
	});

	test("does it properly handle a catalogue that doesnt exist", () => {
		getCatalogueFromId.mockReturnValueOnce("Catalogue not found");
		const siteStatistics = aggregateCatalogueStatistics(3);
		expect(siteStatistics).toEqual("Catalogue not found");
	});
});

describe("Tests for function: aggregatePointTypeStatistics()", () => {
	beforeAll(() => {
		//TODO: if anything needs to be populated before these tests do here
	});

	afterAll(() => {
		//TODO: clean up of test data done here
	});

	test("Correctly acquiring the data for a pointType?", () => {
		//TODO: once the data is populated properly fill this out.
		getArtifactTypeFromId.mockReturnValueOnce(artifactType3);
		const pointTypeStatistics = aggregatePointTypeStatistics(1);
		expect(
			pointTypeStatistics.get("Material Data").get("Material Count"),
		).toEqual(1);
		expect(
			pointTypeStatistics.get("Material Data").get("Material Types"),
		).toEqual(["Material1"]);
		expect(
			pointTypeStatistics
				.get("Material Data")
				.get("Material Percentages")
				.get("Material1"),
		).toEqual(1);
		expect(
			pointTypeStatistics.get("Projectile Data").get("Projectile Count"),
		).toEqual(2);
		expect(
			pointTypeStatistics
				.get("Projectile Data")
				.get("Projectile Types")
				.get("Blade Shape"),
		).toEqual(["Triangular"]);
		expect(
			pointTypeStatistics
				.get("Projectile Data")
				.get("Projectile Types")
				.get("Base Shape"),
		).toEqual(["Convex", "Concave"]);
		expect(
			pointTypeStatistics
				.get("Projectile Data")
				.get("Projectile Types")
				.get("Hafting Shape"),
		).toEqual(["Contracting", "Straight"]);
		expect(
			pointTypeStatistics
				.get("Projectile Data")
				.get("Projectile Types")
				.get("Cross Section"),
		).toEqual(["Flutex"]);
		expect(pointTypeStatistics.ProjectileData.AverageDimensions).toEqual([
			3.6, 3.6, 0.3,
		]);
	});

	test("does it properly handle an empty input", () => {
		const pointTypeStatistics = aggregatePointTypeStatistics();
		expect(pointTypeStatistics).toEqual(null);
	});

	test("does it properly handle a pointType that doesnt exist", () => {
		getArtifactTypeFromId.mockReturnValueOnce("ArtifactType not found");
		const pointTypeStatistics = aggregatePointTypeStatistics(51);
		expect(pointTypeStatistics).toEqual("ArtifactType not found");
	});
});
