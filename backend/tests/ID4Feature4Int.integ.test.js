const db = require("../config/db.js");
const {
	aggregateSiteStatistics,
	aggregateCatalogueStatistics,
	aggregatePointTypeStatistics,
} = require("../controllers/aggregateStatisticsController.js");
const assert = require("node:assert/strict");

const sitesHelper = require("../helperFiles/sitesHelper.js");
const cataloguesHelper = require("../helperFiles/cataloguesHelper.js");
// const artifactTypesHelper = require("../helperFiles/artifactTypesHelper.js");
// const projectilePointsHelper = require("../helperFiles/projectilePointsHelper.js");
// const assert = require("node:assert/strict");

//helper for compareing maps.
function compareMaps(map1, map2) {
	let testVal;
	if (map1.size !== map2.size) {
		return false;
	}
	for (let [key, val] of map1) {
		testVal = map2.get(key);
		// in cases of an undefined value, make sure the key
		// actually exists on the object so there are no false positives
		if (testVal != val || (testVal === undefined && !map2.has(key))) {
			if (testVal instanceof Map && val instanceof Map) {
				console.log("Entering Map: " + key);
				return compareMaps(testVal, val);
			}
			console.log(
				"Key: " + key + "\n" + "	Value: " + testVal + " does not equal: " + val,
			);
			return false;
		}
	}
	return true;
}

beforeAll(async () => {
	await db.initialize();
});

describe("Testing aggregateCatalogueStatistics().", () => {
	describe("Testing on an empty catalogue", () => {
		test("Should return null when aggregateCatalogueStatistics() is not given a catalogue Id as an argument", async () => {
			const catStats = await aggregateCatalogueStatistics();
			expect(catStats).toBe(null);
		});

		test("Should return a string saying the catalogue is not found when passed a nonexistent catalogue Id", async () => {
			const catStats = await aggregateCatalogueStatistics(999999999);
			expect(catStats).toBe("Catalogue not found");
		});

		test("Should have entries of all 0 or null for an empty catalogue", async () => {
			const createdCatalog = await cataloguesHelper.newCatalogue({
				body: {
					name: "Empty Test Catalogue",
					description: "This is an empty Test Catalogue",
				},
			});
			const testCatalogueCreate = await cataloguesHelper.getCatalogueFromId({
				params: { id: createdCatalog.id },
			});
			console.log("line 53: " + testCatalogueCreate);
			assert.equal(testCatalogueCreate.name, "Empty Test Catalogue");
			assert.equal(
				testCatalogueCreate.description,
				"This is an empty Test Catalogue",
			);

			const catStats = await aggregateCatalogueStatistics(createdCatalog.id);
			expect(catStats.get("Material Data").get("Material Count")).toBe(0);
			expect(catStats.get("Material Data").get("Material Types").length).toBe(
				0,
			);
			expect(catStats.get("Material Data").get("Material Percentages")).toBe(
				null,
			);
			expect(catStats.get("Projectile Data").get("Projectile Count")).toBe(0);
			expect(catStats.get("Projectile Data").has("Blade Shapes")).toBe(false);
			expect(catStats.get("Projectile Data").has("Base Shapes")).toBe(false);
			expect(catStats.get("Projectile Data").has("Hafting Shapes")).toBe(false);
			expect(catStats.get("Projectile Data").has("Cross Sections")).toBe(false);
			expect(
				catStats.get("Projectile Data").get("Projectile Percentages"),
			).toBe(null);
			expect(
				catStats.get("Projectile Data").get("Projectile Types").length,
			).toBe(0);
			expect(catStats.get("Projectile Data").get("Averge Dimensions")).toBe(
				undefined,
			);

			await cataloguesHelper.deleteCatalogue({
				params: { id: createdCatalog.id },
			});
			const testCatalogue = await cataloguesHelper.getCatalogueFromId({
				params: { id: createdCatalog.id },
			});
			console.log("line 42: " + testCatalogue);
			assert.equal(testCatalogue.message, "Catalogue not found");
		});
	});

	/**
	 * cannot call the creation of a region here in the backend, so i cannot create, then delete,
	 * 		a populated catalogue automatically, as region needs to exist for a site to exist.
	 */
	/**
	 * so the database ***MUST*** be prepopulated for these tests to function.
	 */
	describe("Testing on a small, populated Catalogue", () => {
		test("On a Catalogue with one site that has one Projectile Point and one Site", async () => {
			//create test catalogue

			const catStats = await aggregateCatalogueStatistics(1);

			console.log("F3.test line 101: " + catStats);

			const compareMap = new Map();
			const materialDataMap = new Map();
			const materialPercentages = new Map();
			const projectileDataMap = new Map();
			const projectileShapes = new Map();
			const projectilePercentages = new Map();

			materialDataMap.set("Material Count", 1);
			materialPercentages.set("Test Lithic Material", 1.0);
			materialDataMap.set("Material Percentages", materialPercentages);
			materialDataMap.set("Material Types", ["Test Lithic Material"]);

			const bladeShapePercentage = new Map();
			bladeShapePercentage.set("Test Blade Shape", "1.00");
			const baseShapePercentage = new Map();
			baseShapePercentage.set("Test Base Shape", "1.00");
			const haftingShapePercentage = new Map();
			haftingShapePercentage.set("Test Hafting Shape", "1.00");
			const crossSectionPercentage = new Map();
			crossSectionPercentage.set("Test Cross Section", "1.00");

			projectileDataMap.set("Projectile Count", 1);
			projectileShapes.set("Blade Shapes", ["Test Blade Shape"]);
			projectileShapes.set("Base Shapes", ["Test Base Shape"]);
			projectileShapes.set("Hafting Shapes", ["Test Hafting Shape"]);
			projectileShapes.set("Cross Sections", ["Test Cross Section"]);
			projectilePercentages.set("Blade Shape", bladeShapePercentage);
			projectilePercentages.set("Base Shape", baseShapePercentage);
			projectilePercentages.set("Hafting Shape", haftingShapePercentage);
			projectilePercentages.set("Cross Section", crossSectionPercentage);
			projectileDataMap.set("Projectile Types", ["Test Lithic Material"]);
			projectileDataMap.set("Average Dimensions", [1.0, 1.0, 1.0]);

			compareMap.set("Projectile Data", projectileDataMap);
			compareMap.set("Material Data", materialDataMap);

			expect(compareMaps(catStats, compareMap)).toBe(true);
		});
	});
});

describe("Testing aggregateSiteStatistics().", () => {
	describe("Testing on an empty Site", () => {
		test("Should return null when given no site Id as input.", async () => {
			const siteStats = await aggregateSiteStatistics();
			expect(siteStats).toBe(null);
		});

		test("Should return a string saying the site was not found when given a nonexistent site Id.", async () => {
			const siteStats = await aggregateSiteStatistics(876345);
			expect(siteStats).toBe("Site not found");
		});

		test("Should have entries of all 0 or null for an empty site.", async () => {
			const createdSite = await sitesHelper.newSite({
				body: {
					name: "Empty Test Site",
					description: "This is an empty test site description.",
					location: "This is a test site location",
					catalogueId: 1,
					regionId: 1,
				},
			});
			const testSiteCreate = await sitesHelper.getSiteFromId({
				params: { id: createdSite.id },
			});
			console.log("line 53: " + testSiteCreate);
			assert.equal(testSiteCreate.name, "Empty Test Site");
			assert.equal(
				testSiteCreate.description,
				"This is an empty test site description.",
			);

			const siteStats = await aggregateSiteStatistics(createdSite.id);
			expect(siteStats.get("Material Data").get("Material Count")).toBe(0);
			expect(siteStats.get("Material Data").get("Material Types").length).toBe(
				0,
			);
			expect(siteStats.get("Material Data").get("Material Percentages")).toBe(
				null,
			);
			expect(siteStats.get("Projectile Data").get("Projectile Count")).toBe(0);
			expect(siteStats.get("Projectile Data").has("Blade Shapes")).toBe(false);
			expect(siteStats.get("Projectile Data").has("Base Shapes")).toBe(false);
			expect(siteStats.get("Projectile Data").has("Hafting Shapes")).toBe(
				false,
			);
			expect(siteStats.get("Projectile Data").has("Cross Sections")).toBe(
				false,
			);
			expect(
				siteStats.get("Projectile Data").get("Projectile Percentages"),
			).toBe(null);
			expect(
				siteStats.get("Projectile Data").get("Projectile Types").length,
			).toBe(0);
			expect(siteStats.get("Projectile Data").get("Averge Dimensions")).toBe(
				undefined,
			);

			await sitesHelper.deleteSite({
				params: { id: createdSite.id },
			});
			const testCatalogue = await sitesHelper.getSiteFromId({
				params: { id: createdSite.id },
			});
			console.log("line 42: " + testCatalogue);
			assert.equal(testCatalogue, "Site not found");
		});
	});
	describe("Testing on a small, populated Site", () => {
		test("On a Site with one site that has one Projectile Point", async () => {
			//create test catalogue

			const siteStats = await aggregateSiteStatistics(1);

			console.log("F3.test line 237: " + siteStats);

			const compareMap = new Map();
			const materialDataMap = new Map();
			const materialPercentages = new Map();
			const projectileDataMap = new Map();
			const projectileShapes = new Map();
			const projectilePercentages = new Map();

			materialDataMap.set("Material Count", 1);
			materialPercentages.set("Test Lithic Material", 1.0);
			materialDataMap.set("Material Percentages", materialPercentages);
			materialDataMap.set("Material Types", ["Test Lithic Material"]);

			const bladeShapePercentage = new Map();
			bladeShapePercentage.set("Test Blade Shape", "1.00");
			const baseShapePercentage = new Map();
			baseShapePercentage.set("Test Base Shape", "1.00");
			const haftingShapePercentage = new Map();
			haftingShapePercentage.set("Test Hafting Shape", "1.00");
			const crossSectionPercentage = new Map();
			crossSectionPercentage.set("Test Cross Section", "1.00");

			projectileDataMap.set("Projectile Count", 1);
			projectileShapes.set("Blade Shapes", ["Test Blade Shape"]);
			projectileShapes.set("Base Shapes", ["Test Base Shape"]);
			projectileShapes.set("Hafting Shapes", ["Test Hafting Shape"]);
			projectileShapes.set("Cross Sections", ["Test Cross Section"]);
			projectilePercentages.set("Blade Shape", bladeShapePercentage);
			projectilePercentages.set("Base Shape", baseShapePercentage);
			projectilePercentages.set("Hafting Shape", haftingShapePercentage);
			projectilePercentages.set("Cross Section", crossSectionPercentage);
			projectileDataMap.set("Projectile Types", ["Test Lithic Material"]);
			projectileDataMap.set("Average Dimensions", [1.0, 1.0, 1.0]);

			compareMap.set("Projectile Data", projectileDataMap);
			compareMap.set("Material Data", materialDataMap);

			expect(compareMaps(siteStats, compareMap)).toBe(true);
		});
	});
});

describe("Testing aggregatePointTypeStatistics()", () => {
	describe("Testing on empty catalogue", () => {
		test("Should return null when not given an artifact type as input", async () => {
			const pointStats = await aggregatePointTypeStatistics();
			expect(pointStats).toBe(null);
		});

		test("Should return a string saying the artifact type was not found when given a nonexistent point type or a point type not in the catalogue", async () => {
			const fakePointStats =
				await aggregatePointTypeStatistics("Not a real point");
			const noPointStats =
				await aggregatePointTypeStatistics("Embarras Bi-point");
			expect(fakePointStats).toBe("ArtifactType not found");
			expect(noPointStats).toBe("ArtifactType not found");
		});

		test("Should return values of 1 for a point type that is the only entry", async () => {
			const pointStats = await aggregatePointTypeStatistics("Faunal");

			expect(pointStats.get("Material Data").get("Material Count")).toBe(0);
			expect(pointStats.get("Material Data").get("Material Types").length).toBe(
				0,
			);
			expect(pointStats.get("Material Data").get("Material Percentages")).toBe(
				null,
			);
			expect(pointStats.get("Projectile Data").get("Projectile Count")).toBe(0);
			expect(pointStats.get("Projectile Data").has("Blade Shapes")).toBe(false);
			expect(pointStats.get("Projectile Data").has("Base Shapes")).toBe(false);
			expect(pointStats.get("Projectile Data").has("Hafting Shapes")).toBe(
				false,
			);
			expect(pointStats.get("Projectile Data").has("Cross Sections")).toBe(
				false,
			);
			expect(
				pointStats.get("Projectile Data").get("Projectile Percentages"),
			).toBe(null);
			expect(
				pointStats.get("Projectile Data").get("Projectile Types").length,
			).toBe(0);
			expect(pointStats.get("Projectile Data").get("Averge Dimensions")).toBe(
				undefined,
			);
		});
	});
	describe("Testing on a Point Type with a single Projectile Point", () => {
		/**
		 * This test is failing as the route related to he artifactTypes dont have the updated
		 * relations (Brayden, Adam and Babz know what this means)
		 */
		test("On a Point Type that has one Projectile Point", async () => {
			//create test catalogue

			const pointStats = await aggregatePointTypeStatistics("Lithic");

			console.log("F3.test line 237: " + pointStats);

			const compareMap = new Map();
			const materialDataMap = new Map();
			const materialPercentages = new Map();
			const projectileDataMap = new Map();
			const projectileShapes = new Map();
			const projectilePercentages = new Map();

			materialDataMap.set("Material Count", 1);
			materialPercentages.set("Test Lithic Material", 1.0);
			materialDataMap.set("Material Percentages", materialPercentages);
			materialDataMap.set("Material Types", ["Test Lithic Material"]);

			const bladeShapePercentage = new Map();
			bladeShapePercentage.set("Test Blade Shape", "1.00");
			const baseShapePercentage = new Map();
			baseShapePercentage.set("Test Base Shape", "1.00");
			const haftingShapePercentage = new Map();
			haftingShapePercentage.set("Test Hafting Shape", "1.00");
			const crossSectionPercentage = new Map();
			crossSectionPercentage.set("Test Cross Section", "1.00");

			projectileDataMap.set("Projectile Count", 1);
			projectileShapes.set("Blade Shapes", ["Test Blade Shape"]);
			projectileShapes.set("Base Shapes", ["Test Base Shape"]);
			projectileShapes.set("Hafting Shapes", ["Test Hafting Shape"]);
			projectileShapes.set("Cross Sections", ["Test Cross Section"]);
			projectilePercentages.set("Blade Shape", bladeShapePercentage);
			projectilePercentages.set("Base Shape", baseShapePercentage);
			projectilePercentages.set("Hafting Shape", haftingShapePercentage);
			projectilePercentages.set("Cross Section", crossSectionPercentage);
			projectileDataMap.set("Projectile Types", ["Test Lithic Material"]);
			projectileDataMap.set("Average Dimensions", [1.0, 1.0, 1.0]);

			compareMap.set("Projectile Data", projectileDataMap);
			compareMap.set("Material Data", materialDataMap);

			expect(compareMaps(pointStats, compareMap)).toBe(true);
		});
	});
});
