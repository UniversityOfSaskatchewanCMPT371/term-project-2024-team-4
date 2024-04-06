import { describe, it, expect } from "vitest";
import { sortData } from "../src/sortUtils";

// Sample data for sites (e.g. newest/oldest/alphabetical)
const sampleData = [
	{ id: 1, name: "Delta", createdDate: "2022-01-02" },
	{ id: 2, name: "Alpha", createdDate: "2022-01-01" },
	{ id: 3, name: "Charlie", createdDate: "2022-01-03" },
	{ id: 4, name: "Bravo", createdDate: "2022-01-04" },
];

// Sample data for projectiles (e.g. newest/oldest/numerical)
const sampleData_projectiles = [
	{ id: 4, name: "Alpha-4" },
	{ id: 2, name: "Alpha-2" },
	{ id: 1, name: "Alpha-1" },
	{ id: 3, name: "Alpha-3" },
];

describe("Sorting Utility Function (sortData)", () => {
	it("should handle empty array without throwing error", () => {
		const sorted = sortData([], "newest");
		expect(sorted).toEqual([]);
	});

	it("should maintain the original order of items with equal date", () => {
		const sameDateData = [
			{ id: 1, name: "Charlie", createdDate: "2022-01-01" },
			{ id: 2, name: "Bravo", createdDate: "2022-01-01" },
		];
		const sorted = sortData([...sameDateData], "oldest");
		expect(sorted.map((item) => item.id)).toEqual([1, 2]);
	});

	it("should sort by newest date correctly", () => {
		const sorted = sortData([...sampleData], "newest");
		expect(sorted.map((item) => item.id)).toEqual([4, 3, 1, 2]);
	});

	it("should sort by oldest date correctly", () => {
		const sorted = sortData([...sampleData], "oldest");
		expect(sorted.map((item) => item.id)).toEqual([2, 1, 3, 4]);
	});

	it("should sort by alphabetically ascending order correctly", () => {
		const sorted = sortData([...sampleData], "alphabetical_ascending");
		expect(sorted.map((item) => item.id)).toEqual([2, 4, 3, 1]);
	});

	it("should sort by alphabetically descending order correctly", () => {
		const sorted = sortData([...sampleData], "alphabetical_descending");
		expect(sorted.map((item) => item.id)).toEqual([1, 3, 4, 2]);
	});

	it("should sort by numerically ascending order correctly", () => {
		const sorted = sortData([...sampleData_projectiles], "numeric_ascending");
		expect(sorted.map((item) => item.id)).toEqual([1, 2, 3, 4]);
	});

	it("should sort by numerically descending order correctly", () => {
		const sorted = sortData([...sampleData_projectiles], "numeric_descending");
		expect(sorted.map((item) => item.id)).toEqual([4, 3, 2, 1]);
	});

	it("should return the original array if an invalid sort value is provided", () => {
		const originalData = [...sampleData];
		const sorted = sortData(sampleData, "invalid_sort");
		expect(sorted).toEqual(originalData);
	});
});
