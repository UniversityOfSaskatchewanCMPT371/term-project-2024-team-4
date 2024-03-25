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

const {
	materialPercentage,
	projectilePointPercentage,
	averageProjectilePointDimensions,
	aggregateSiteStatistics,
	aggregateCatalogueStatistics,
	aggregatePointTypeStatistics,
} = require("../../controllers/aggregateStatisticsController");

const artifactTypesHelper = require("../../helperFiles/artifactTypesHelper");
const cataloguesHelper = require("../../helperFiles/cataloguesHelper");
const sitesHelper = require("../../helperFiles/sitesHelper");

describe("Tests for the function: materialPercentage()", () => {
	test("Attempt to calculate percentages with an empty list", async () => {
		const percentages = await materialPercentage([]);
		expect(percentages).toBe(null);
	});

	test("Attempt to calculate percentages wssssssith a populated list expecting correct return", async () => {
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
		const percentages = await materialPercentage(materialArray);
		expect(parseFloat(percentages.get("Type 1"))).toBe(0.25);
		expect(parseFloat(percentages.get("Type 2"))).toBe(0.25);
		expect(parseFloat(percentages.get("Type 3"))).toBe(0.25);
		expect(parseFloat(percentages.get("Type 4"))).toBe(0.25);
	});
});

describe("Tests for the function: projectilePointPercentage()", () => {
	test("Attempt to calculate percentages with an empty list", async () => {
		const percentages = await projectilePointPercentage([]);
		expect(percentages).toEqual(null);
	});

	test("Attempt to calculate percentages with a populated list expecting correct return", async () => {
		const projectile1 = {
			bladeShape: { name: "Triangular" },
			baseShape: { name: "Straight" },
			haftingShape: { name: "Straight" },
			crossSection: { name: "Rhomboid" },
		};

		const projectile2 = {
			bladeShape: { name: "Excurvate" },
			baseShape: { name: "Concave" },
			haftingShape: { name: "Basally Concave" },
			crossSection: { name: "Lemicular" },
		};

		const projectile3 = {
			bladeShape: { name: "Incurvate" },
			baseShape: { name: "Convex" },
			haftingShape: { name: "Expanding" },
			crossSection: { name: "Plano-Convex" },
		};

		const projectile4 = {
			bladeShape: { name: "Ovate" },
			baseShape: { name: "Concave" },
			haftingShape: { name: "Contracting" },
			crossSection: { name: "Flutex" },
		};

		const projectile5 = {
			bladeShape: { name: "Incurvate" },
			baseShape: { name: "Straight" },
			haftingShape: { name: "Side-Notched" },
			crossSection: { name: "Flat" },
		};

		const percentages = await projectilePointPercentage([
			projectile1,
			projectile2,
			projectile3,
			projectile4,
			projectile5,
		]);
		// expect(percentages["Blade Shape"]["Triangular"]).toEqual("0.20");
		expect(percentages.get("Blade Shape").get("Triangular")).toEqual("0.20");
		// expect(percentages["Blade Shape"]["Excurvate"]).toEqual("0.20");
		expect(percentages.get("Blade Shape").get("Excurvate")).toEqual("0.20");
		// expect(percentages["Blade Shape"]["Incurvate"]).toEqual("0.40");
		expect(percentages.get("Blade Shape").get("Incurvate")).toEqual("0.40");
		// expect(percentages["Blade Shape"]["Ovate"]).toEqual("0.20");
		expect(percentages.get("Blade Shape").get("Ovate")).toEqual("0.20");
		// expect(percentages["Base Shape"]["Straight"]).toEqual("0.40");
		expect(percentages.get("Base Shape").get("Straight")).toEqual("0.40");
		// expect(percentages["Base Shape"]["Concave"]).toEqual("0.40");
		expect(percentages.get("Base Shape").get("Concave")).toEqual("0.40");
		// expect(percentages["Base Shape"]["Convex"]).toEqual("0.20");
		expect(percentages.get("Base Shape").get("Convex")).toEqual("0.20");
		// expect(percentages["Hafting Shape"]["Straight"]).toEqual("0.20");
		expect(percentages.get("Hafting Shape").get("Straight")).toEqual("0.20");
		// expect(percentages["Hafting Shape"]["Basally Concave"]).toEqual("0.20");
		expect(percentages.get("Hafting Shape").get("Basally Concave")).toEqual(
			"0.20",
		);
		// expect(percentages["Hafting Shape"]["Expanding"]).toEqual("0.20");
		expect(percentages.get("Hafting Shape").get("Expanding")).toEqual("0.20");
		// expect(percentages["Hafting Shape"]["Contracting"]).toEqual("0.20");
		expect(percentages.get("Hafting Shape").get("Contracting")).toEqual("0.20");
		// expect(percentages["Hafting Shape"]["Side Notched"]).toEqual("0.20");
		expect(percentages.get("Hafting Shape").get("Side-Notched")).toEqual(
			"0.20",
		);
		// expect(percentages["Cross Section"]["Rhomboid"]).toEqual("0.20");
		expect(percentages.get("Cross Section").get("Rhomboid")).toEqual("0.20");
		// expect(percentages["Cross Section"]["Lemicular"]).toEqual("0.20");
		expect(percentages.get("Cross Section").get("Lemicular")).toEqual("0.20");
		// expect(percentages["Cross Section"]["Plano-Convex"]).toEqual("0.20");
		expect(percentages.get("Cross Section").get("Plano-Convex")).toEqual(
			"0.20",
		);
		// expect(percentages["Cross Section"]["Flutex"]).toEqual("0.20");
		expect(percentages.get("Cross Section").get("Flutex")).toEqual("0.20");
		// expect(percentages["Cross Section"]["Flat"]).toEqual("0.20");
		expect(percentages.get("Cross Section").get("Flat")).toEqual("0.20");
	});
});

describe("Tests for the function: averageProjectilePointDimensions()", () => {
	test("Calculate the average dimensions on an empty set of data", async () => {
		const averageDimensions = await averageProjectilePointDimensions([]);
		expect(averageDimensions).toEqual(null);
	});

	test("Calculate the average dimensions on a small set of data", async () => {
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
		const averageDimensions = await averageProjectilePointDimensions([
			projectilePoint1,
			projectilePoint2,
			projectilePoint3,
		]);
		expect(averageDimensions).toEqual([2.57, 6.3, 0.47]);
	});
});

let catalogue1 = {
	id: 1,
	name: "Catalogue1",
	description: "This is Catalogue 1",
	sites: [],
};

let site1 = {
	id: 1,
	name: "Site1",
	description: "This is Site 1",
	location: "This is Site 1's location",
	catalogue: 1,
	region: 1,
	artifacts: [],
};

let site2 = {
	id: 2,
	name: "Site2",
	description: "This is Site 2",
	location: "This is Site 2's location",
	catalogue: 1,
	region: 1,
	artifacts: [],
};

let region1 = {
	id: 1,
	name: "Region1",
	description: "This is Region 1",
	sites: [site1, site2],
};

//A bunch of mock test data to use for the aggregateStatisticsFunctions
let material1 = {
	id: 1,
	name: "Material1",
	description: "This is Material1",
	artifactType: 1,
	artifacts: [],
};

let material2 = {
	id: 1,
	name: "Material2",
	description: "This is Material2",
	artifactType: 1,
	artifacts: [],
};

let material3 = {
	id: 1,
	name: "Material3",
	description: "This is Material3",
	artifactType: 1,
	artifacts: [],
};

//ArtifactTypes

let artifactType1 = {
	id: "Lithic",
	materials: [material1],
	artifacts: [],
};

let artifactType2 = {
	id: "Ceramic",
	materials: [material2],
	artifacts: [],
};

let artifactType3 = {
	id: "Faunal",
	materials: [material3],
	artifacts: [],
};

//Period

let period = {
	id: 1,
	name: "Period1",
	start: 1990,
	end: 2000,
	cultures: [],
};

//Blade Shapes

let bladeShape1 = {
	id: 1,
	name: "Triangular",
	cultures: [],
	projectilePoints: [],
};

let bladeShape2 = {
	id: 2,
	name: "Excurvate",
	cultures: [],
	projectilePoints: [],
};

let bladeShape3 = {
	id: 3,
	name: "Incurvate",
	cultures: [],
	projectilePoints: [],
};

//Base Shapes

let baseShape1 = {
	id: 1,
	name: "Straight",
	cultures: [],
	projectilePoints: [],
};

let baseShape2 = {
	id: 2,
	name: "Concave",
	cultures: [],
	projectilePoints: [],
};

let baseShape3 = {
	id: 3,
	name: "Convex",
	cultures: [],
	projectilePoints: [],
};

//Hafting Shapes

let haftingShape1 = {
	id: 1,
	name: "Straight",
	cultures: [],
	projectilePoints: [],
};

let haftingShape2 = {
	id: 2,
	name: "Expanding",
	cultures: [],
	projectilePoints: [],
};

let haftingShape3 = {
	id: 3,
	name: "Contracting",
	cultures: [],
	projectilePoints: [],
};

//Cross Sections

let crossSection1 = {
	id: 1,
	name: "Rhomboid",
	cultures: [],
	projectilePoints: [],
};

let crossSection2 = {
	id: 2,
	name: "Lemicular",
	cultures: [],
	projectilePoints: [],
};

let crossSection3 = {
	id: 3,
	name: "Flutex",
	cultures: [],
	projectilePoints: [],
};

//Culture

let culture1 = {
	id: 1,
	name: "Culture1",
	period: period,
	projectilePoints: [],
	bladeShapes: [bladeShape1, bladeShape2, bladeShape3],
	baseShapes: [baseShape1, baseShape2, baseShape3],
	haftingShapes: [haftingShape1, haftingShape2, haftingShape3],
	crossSections: [crossSection1, crossSection2, crossSection3],
};

//Projectile Points

let projectilePoint1 = {
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

let projectilePoint2 = {
	id: 2,
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

let projectilePoint3 = {
	id: 3,
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

let projectilePoint4 = {
	id: 4,
	name: "projectilePoint5",
	location: "A place",
	description: "This is projectilePoint4, its neat",
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

let projectilePoint5 = {
	id: 5,
	name: "projectilePoint5",
	location: "A place",
	description: "This is projectilePoint5, its neat",
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

//Do connections of above objects
catalogue1.sites.push(site1, site2);
site1.catalogue = catalogue1;
site1.region = region1;
site1.artifacts.push(projectilePoint1, projectilePoint2, projectilePoint3);
site2.catalogue = catalogue1;
site2.region = region1;
site2.artifacts.push(projectilePoint4, projectilePoint5);
material1.artifactType = artifactType1;
material1.artifacts.push(projectilePoint1);
material2.artifactType = artifactType2;
material2.artifacts.push(projectilePoint2, projectilePoint4);
material3.artifactType = artifactType3;
material3.artifacts.push(projectilePoint3, projectilePoint5);
artifactType1.artifacts.push(projectilePoint1);
artifactType2.artifacts.push(projectilePoint2, projectilePoint4);
artifactType3.artifacts.push(projectilePoint1, projectilePoint5);
period.cultures.push(culture1);
culture1.projectilePoints.push(
	projectilePoint1,
	projectilePoint2,
	projectilePoint3,
	projectilePoint4,
	projectilePoint5,
);
bladeShape1.cultures.push(culture1);
bladeShape1.projectilePoints.push(projectilePoint1);
bladeShape2.cultures.push(culture1);
bladeShape2.projectilePoints.push(projectilePoint2, projectilePoint4);
bladeShape3.cultures.push(culture1);
bladeShape3.projectilePoints.push(projectilePoint1, projectilePoint5);
baseShape1.cultures.push(culture1);
baseShape1.projectilePoints.push(projectilePoint1, projectilePoint4);
baseShape2.cultures.push(culture1);
baseShape2.projectilePoints.push(projectilePoint2, projectilePoint5);
baseShape3.cultures.push(culture1);
baseShape3.projectilePoints.push(projectilePoint3);
haftingShape1.cultures.push(culture1);
haftingShape1.projectilePoints.push(projectilePoint1, projectilePoint5);
haftingShape2.cultures.push(culture1);
haftingShape2.projectilePoints.push(projectilePoint2);
haftingShape3.cultures.push(culture1);
haftingShape3.projectilePoints.push(projectilePoint3, projectilePoint4);
crossSection1.cultures.push(culture1);
crossSection1.projectilePoints.push(projectilePoint1);
crossSection2.cultures.push(culture1);
crossSection2.projectilePoints.push(projectilePoint2, projectilePoint4);
crossSection3.cultures.push(culture1);
crossSection3.projectilePoints.push(projectilePoint3, projectilePoint5);

describe("Tests for function: aggregateSiteStatistics()", () => {
	test("Correctly acquiring the data?", async () => {
		//initializing some dummy data to work with using a mock call of the get site route function
		// let body = {
		// 	id: 1,
		// 	name: "Site1",
		// 	description: "This is Site 1",
		// 	location: "This is Site 1's location",
		// 	catalogue: catalogue1,
		// 	region: region1,
		// 	artifacts: [projectilePoint1, projectilePoint2, projectilePoint3],
		// };

		sitesHelper.getSiteFromId = jest.fn().mockReturnValueOnce({
			id: 1,
			name: "Site1",
			description: "This is Site 1",
			location: "This is Site 1's location",
			catalogue: catalogue1,
			region: region1,
			artifacts: [projectilePoint1, projectilePoint2, projectilePoint3],
		});

		const siteStatistics = await aggregateSiteStatistics(1);
		expect(siteStatistics.get("Material Data").get("Material Count")).toEqual(
			3,
		);
		expect(siteStatistics.get("Material Data").get("Material Types")).toEqual([
			"Material1",
			"Material2",
			"Material3",
		]);
		expect(
			siteStatistics
				.get("Material Data")
				.get("Material Percentages")
				.get("Material1"),
		).toEqual("0.33");
		expect(
			siteStatistics
				.get("Material Data")
				.get("Material Percentages")
				.get("Material2"),
		).toEqual("0.33");
		expect(
			siteStatistics
				.get("Material Data")
				.get("Material Percentages")
				.get("Material3"),
		).toEqual("0.33");
		expect(
			siteStatistics.get("Projectile Data").get("Projectile Count"),
		).toEqual(3);
		expect(
			siteStatistics.get("Projectile Data").get("Projectile Types"),
		).toEqual(["Lithic", "Ceramic", "Faunal"]);
		expect(
			siteStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Blade Shape")
				.get("Triangular"),
		).toEqual("0.33");
		expect(
			siteStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Blade Shape")
				.get("Excurvate"),
		).toEqual("0.33");
		expect(
			siteStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Blade Shape")
				.get("Incurvate"),
		).toEqual("0.33");
		expect(
			siteStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Base Shape")
				.get("Straight"),
		).toEqual("0.33");
		expect(
			siteStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Base Shape")
				.get("Concave"),
		).toEqual("0.33");
		expect(
			siteStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Base Shape")
				.get("Convex"),
		).toEqual("0.33");
		expect(
			siteStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Hafting Shape")
				.get("Straight"),
		).toEqual("0.33");
		expect(
			siteStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Hafting Shape")
				.get("Expanding"),
		).toEqual("0.33");
		expect(
			siteStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Hafting Shape")
				.get("Contracting"),
		).toEqual("0.33");
		expect(
			siteStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Cross Section")
				.get("Rhomboid"),
		).toEqual("0.33");
		expect(
			siteStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Cross Section")
				.get("Lemicular"),
		).toEqual("0.33");
		expect(
			siteStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Cross Section")
				.get("Flutex"),
		).toEqual("0.33");
		expect(
			siteStatistics.get("Projectile Data").get("Average Dimensions"),
		).toEqual([2.9, 4.97, 0.43]);
	});

	test("does it properly handle an empty input", async () => {
		const siteStatistics = await aggregateSiteStatistics();
		expect(siteStatistics).toEqual(null);
	});

	test("does it properly handle a site that doesnt exist", async () => {
		sitesHelper.getSiteFromId = jest.fn().mockReturnValueOnce("Site not found");
		const siteStatistics = await aggregateSiteStatistics(3);
		expect(siteStatistics).toEqual("Site not found");
	});
});

describe("Tests for function: aggregateCatalogueStatistics()", () => {
	test("Correctly acquiring the data for a catalogue?", async () => {
		// let body = {
		// 	id: 1,
		// 	name: "Catalogue1",
		// 	description: "This is Catalogue 1",
		// 	sites: [site1, site2],
		// };

		cataloguesHelper.getCatalogueFromId = jest.fn().mockReturnValueOnce({
			id: 1,
			name: "Catalogue1",
			description: "This is Catalogue 1",
			sites: [site1, site2],
		});
		console.log("Correctly acquiring the data for a catalogue?");
		const catalogueStatistics = await aggregateCatalogueStatistics(1);
		console.log(catalogueStatistics);
		console.log(
			catalogueStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Blade Shape"),
		);
		console.log(
			catalogueStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Base Shape"),
		);
		console.log(
			catalogueStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Hafting Shape"),
		);
		console.log(
			catalogueStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Cross Section"),
		);
		expect(
			catalogueStatistics.get("Material Data").get("Material Count"),
		).toEqual(5);
		expect(
			catalogueStatistics.get("Material Data").get("Material Types"),
		).toEqual(["Material1", "Material2", "Material3"]);
		expect(
			catalogueStatistics
				.get("Material Data")
				.get("Material Percentages")
				.get("Material1"),
		).toEqual("0.20");
		expect(
			catalogueStatistics
				.get("Material Data")
				.get("Material Percentages")
				.get("Material2"),
		).toEqual("0.40");
		expect(
			catalogueStatistics
				.get("Material Data")
				.get("Material Percentages")
				.get("Material3"),
		).toEqual("0.40");
		expect(
			catalogueStatistics.get("Projectile Data").get("Projectile Count"),
		).toEqual(5);
		expect(
			catalogueStatistics.get("Projectile Data").get("Projectile Types"),
		).toEqual(["Lithic", "Ceramic", "Faunal"]);
		expect(
			catalogueStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Blade Shape")
				.get("Triangular"),
		).toEqual("0.20");
		expect(
			catalogueStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Blade Shape")
				.get("Excurvate"),
		).toEqual("0.40");
		expect(
			catalogueStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Blade Shape")
				.get("Incurvate"),
		).toEqual("0.40");
		expect(
			catalogueStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Base Shape")
				.get("Convex"),
		).toEqual("0.20");
		expect(
			catalogueStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Base Shape")
				.get("Straight"),
		).toEqual("0.40");
		expect(
			catalogueStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Base Shape")
				.get("Concave"),
		).toEqual("0.40");
		expect(
			catalogueStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Hafting Shape")
				.get("Expanding"),
		).toEqual("0.20");
		expect(
			catalogueStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Hafting Shape")
				.get("Contracting"),
		).toEqual("0.40");
		expect(
			catalogueStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Hafting Shape")
				.get("Straight"),
		).toEqual("0.40");
		expect(
			catalogueStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Cross Section")
				.get("Rhomboid"),
		).toEqual("0.20");
		expect(
			catalogueStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Cross Section")
				.get("Lemicular"),
		).toEqual("0.40");
		expect(
			catalogueStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Cross Section")
				.get("Flutex"),
		).toEqual("0.40");
		expect(
			catalogueStatistics.get("Projectile Data").get("Average Dimensions"),
		).toEqual([3.18, 4.54, 0.38]);
	});

	test("does it properly handle an empty input", async () => {
		const siteStatistics = await aggregateCatalogueStatistics();
		expect(siteStatistics).toEqual(null);
	});

	test("does it properly handle a catalogue that doesnt exist", async () => {
		cataloguesHelper.getCatalogueFromId = jest
			.fn()
			.mockReturnValueOnce("Catalogue not found");
		const siteStatistics = await aggregateCatalogueStatistics(99999999999);
		expect(siteStatistics).toEqual("Catalogue not found");
	});
});

describe("Tests for function: aggregatePointTypeStatistics()", () => {
	test("Correctly acquiring the data for a pointType?", async () => {
		artifactTypesHelper.getArtifactTypeFromId = jest.fn().mockReturnValueOnce({
			id: "Ceramic",
			materials: [material2],
			artifacts: [projectilePoint2, projectilePoint4],
		});
		const pointTypeStatistics = await aggregatePointTypeStatistics(1);
		expect(
			pointTypeStatistics.get("Material Data").get("Material Count"),
		).toEqual(2);
		expect(
			pointTypeStatistics.get("Material Data").get("Material Types"),
		).toEqual(["Material2"]);
		expect(
			pointTypeStatistics
				.get("Material Data")
				.get("Material Percentages")
				.get("Material2"),
		).toEqual("1.00");
		expect(
			pointTypeStatistics.get("Projectile Data").get("Projectile Count"),
		).toEqual(2);
		expect(
			pointTypeStatistics.get("Projectile Data").get("Projectile Types"),
		).toEqual(["Ceramic"]);
		expect(
			pointTypeStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Blade Shape")
				.get("Excurvate"),
		).toEqual("1.00");
		expect(
			pointTypeStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Base Shape")
				.get("Concave"),
		).toEqual("0.50");
		expect(
			pointTypeStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Base Shape")
				.get("Straight"),
		).toEqual("0.50");
		expect(
			pointTypeStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Hafting Shape")
				.get("Expanding"),
		).toEqual("0.50");
		expect(
			pointTypeStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Hafting Shape")
				.get("Contracting"),
		).toEqual("0.50");
		expect(
			pointTypeStatistics
				.get("Projectile Data")
				.get("Projectile Percentages")
				.get("Cross Section")
				.get("Lemicular"),
		).toEqual("1.00");
		expect(
			pointTypeStatistics.get("Projectile Data").get("Average Dimensions"),
		).toEqual([2.75, 5.05, 0.45]);
	});

	test("does it properly handle an empty input", async () => {
		const pointTypeStatistics = await aggregatePointTypeStatistics();
		expect(pointTypeStatistics).toEqual(null);
	});

	test("does it properly handle a pointType that doesnt exist", async () => {
		artifactTypesHelper.getArtifactTypeFromId = jest
			.fn()
			.mockReturnValueOnce("ArtifactType not found");
		const pointTypeStatistics =
			await aggregatePointTypeStatistics(999999999999999);
		expect(pointTypeStatistics).toEqual("ArtifactType not found");
	});
});
