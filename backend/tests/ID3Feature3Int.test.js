const db = require("../config/db.js");
const {
	aggregateSiteStatistics,
	aggregateCatalogueStatistics,
	aggregatePointTypeStatistics,
} = require("../controllers/aggregateStatisticsController");

beforeAll(async () => {
	await db.initialize();
});

describe("Testing aggregateCatalogueStatistics().", () => {
	describe("Testing on an empty catalogue", () => {
		it("Should return null when aggregateCatalogueStatistics() is not given a catalogue Id as an argument", async () => {
			const catStats = await aggregateCatalogueStatistics();
			expect(catStats).toBe(null);
		});
		it("Should return a string saying the catalogue is not found when passed a nonexistent catalogue Id", async () => {
			const catStats = await aggregateCatalogueStatistics(44);
			expect(catStats).toBe("Catalogue not found");
		});
		it("Should have entries of all 0 or null for an empty catalogue", async () => {
			const catStats = await aggregateCatalogueStatistics(1);
			expect(catStats.get("Material Data").get("Material Count")).toBe(0);
			expect(catStats.get("Material Data").get("Material Types").length).toBe(
				0,
			);
			expect(catStats.get("Material Data").get("Material Percentages")).toBe(
				null,
			);
			expect(catStats.get("Projectile Data").get("Projectile Count")).toBe(0);
			expect(catStats.get("Projectile Data").get("Blade Shapes").length).toBe(
				0,
			);
			expect(catStats.get("Projectile Data").get("Base Shapes").length).toBe(0);
			expect(catStats.get("Projectile Data").get("Hafting Shapes").length).toBe(
				0,
			);
			expect(catStats.get("Projectile Data").get("Cross Sections").length).toBe(
				0,
			);
			expect(
				catStats.get("Projectile Data").get("Projectile Percentages"),
			).toBe(null);
			expect(
				catStats.get("Projectile Data").get("Projectile Types").length,
			).toBe(0);
			expect(catStats.get("Projectile Data").get("Averge Dimensions")).toBe(
				null,
			);
		});
	});
});

describe("Testing aggregateSiteStatistics().", () => {
	describe("Testing on an empty Site", () => {
		it("Should return null when given no site Id as input.", async () => {
			const siteStats = await aggregateSiteStatistics();
			expect(siteStats).toBe(null);
		});

		it("Should return a string saying the site was not found when given a nonexistent site Id.", async () => {
			const siteStats = await aggregateSiteStatistics(876345);
			expect(siteStats).toBe("Site not found");
		});

		it("Should have entries of all 0 or null for an empty site.", async () => {
			const siteStats = await aggregateSiteStatistics(1);
			expect(siteStats.get("Material Data").get("Material Count")).toBe(0);
			expect(siteStats.get("Material Data").get("Material Types").length).toBe(
				0,
			);
			expect(siteStats.get("Material Data").get("Material Percentages")).toBe(
				null,
			);
			expect(siteStats.get("Projectile Data").get("Projectile Count")).toBe(0);
			expect(siteStats.get("Projectile Data").get("Blade Shapes").length).toBe(
				0,
			);
			expect(siteStats.get("Projectile Data").get("Base Shapes").length).toBe(
				0,
			);
			expect(
				siteStats.get("Projectile Data").get("Hafting Shapes").length,
			).toBe(0);
			expect(
				siteStats.get("Projectile Data").get("Cross Sections").length,
			).toBe(0);
			expect(
				siteStats.get("Projectile Data").get("Projectile Percentages"),
			).toBe(null);
			expect(
				siteStats.get("Projectile Data").get("Projectile Types").length,
			).toBe(0);
			expect(siteStats.get("Projectile Data").get("Averge Dimensions")).toBe(
				null,
			);
		});
	});
});

describe("Testing aggregatePointTypeStatistics()", () => {
	describe("Testing on empty catalogue", () => {
		it("Should return null when not given an artifact type as input", async () => {
			const pointStats = await aggregatePointTypeStatistics();
			expect(pointStats).toBe(null);
		});

		it("Should return a string saying the artifact type was not found when given a nonexistent point type or a point type not in the catalogue", async () => {
			const fakePointStats =
				await aggregatePointTypeStatistics("Not a real point");
			const noPointStats =
				await aggregatePointTypeStatistics("Embarras Bi-point");
			expect(fakePointStats).toBe("ArtifactType not found");
			expect(noPointStats).toBe("ArtifactType not found");
		});

		it("Should return values of 1 for a point type that is the only entry", async () => {
			const pointStats = await aggregatePointTypeStatistics("Cody Knife");
			expect(pointStats.get("Material Data").get("Material Count")).toBe(1);
			expect(pointStats.get("Material Data").get("Material Types").length).toBe(
				1,
			);
			expect(pointStats.get("Projectile Data").get("Projectile Count")).toBe(1);
			expect(pointStats.get("Projectile Data").get("Blade Shapes").length).toBe(
				1,
			);
			expect(pointStats.get("Projectile Data").get("Base Shapes").length).toBe(
				1,
			);
			expect(
				pointStats.get("Projectile Data").get("Hafting Shapes").length,
			).toBe(1);
			expect(
				pointStats.get("Projectile Data").get("Cross Sections").length,
			).toBe(1);
			expect(
				pointStats.get("Projectile Data").get("Projectile Types").length,
			).toBe(1);
		});
	});
});
