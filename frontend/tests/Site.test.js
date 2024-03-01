/* eslint-disable no-undef */
import { render, fireEvent, waitFor } from "@testing-library/react";
import Site from "./components/Site";

describe("Site component", () => {
	test("renders Site component with correct initial state", () => {
		const { getByText } = render(<Site props="site" />);

		expect(getByText("Loading...")).toBeInTheDocument();
	});

	test("displays search results correctly when data is fetched successfully", async () => {
		const mockData = [
			{ id: 1, name: "Name 1", location: "Location 1" },
			{ id: 2, name: "Name 2", location: "Location 2" },
		];

		jest.spyOn(global, "fetch").mockResolvedValueOnce({
			json: jest.fn().mockResolvedValueOnce(mockData),
		});

		const { findByText } = render(<Site props="site" />);

		await waitFor(() => {
			expect(global.fetch).toHaveBeenCalledTimes(1);
		});

		expect(await findByText("Name 1")).toBeInTheDocument();
		expect(await findByText("Location 1")).toBeInTheDocument();
		expect(await findByText("Name 2")).toBeInTheDocument();
		expect(await findByText("Location 2")).toBeInTheDocument();
	});

	test("calls handleSearch function with correct value when the search input changes", async () => {
		const { getByLabelText } = render(<Site props="site" />);

		const searchInput = getByLabelText("Search");

		fireEvent.change(searchInput, { target: { value: "search query" } });

		expect(global.console.log).toHaveBeenCalledWith(
			"Searching Site for:",
			"search query",
		);
	});

	test("calls handleSortChange function with correct value when the sort select input changes", async () => {
		const { getByLabelText } = render(<Site props="site" />);

		const sortSelect = getByLabelText("Sort");

		fireEvent.change(sortSelect, { target: { value: "descendant" } });

		expect(global.console.log).toHaveBeenCalledWith(
			"Sort value changed:",
			"descendant",
		);
	});

	test("calls handleFilterChange function with correct value when the filter select input changes", async () => {
		const { getByLabelText } = render(<Site props="site" />);

		const filterSelect = getByLabelText("Filter");

		fireEvent.change(filterSelect, { target: { value: "category1" } });

		expect(global.console.log).toHaveBeenCalledWith(
			"Filter value changed:",
			"category1",
		);
	});
});
