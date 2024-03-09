import { screen, render, fireEvent } from "@testing-library/react";
import { expect, vi } from "vitest";
import StatisticsPage from "../src/components/App";

describe("Statistics page tests", () => {
	test("Render statistics page correctly", () => {
		render(<StatisticsPage />);

		//Test if the search bar is on the screen
		const searchBar = screen.getByLabelText("Search");
		expect(searchBar).toBeInTheDocument();

		//Test if the button to generate statistics is on the screen
		const statisticButton = screen.getByText("Generate Statistics");
		expect(statisticButton).toBeInTheDocument();

		//Test if the sort dropdown is on the screen
		const sortOption = screen.getByLabelText("Sort");
		expect(sortOption).toBeInTheDocument();

		//Test if the filter dropdown is on the screen
		const filterOption = screen.getByLabelText("Filter");
		expect(filterOption).toBeInTheDocument();

		//Test if the area for the list of points (with column headers) is on the screen
		const listArea = screen.getByText("Point name");
		expect(listArea).toBeInTheDocument();
	});

	test("Updates searchValue state when input for search bar changes", () => {
		const searchInput = screen.getByLabelText("Search");

		//Changes the value in the search bar and ensures it properly changes
		fireEvent.change(searchInput, { target: { value: "New value" } });
		expect(searchInput.value).toBe("New value");
	});

	test("Calls handleSortChange() when the selection for sorting changes", () => {
		const handleSortChangeMock = vi.fn();
		const sortSelection = screen.getByLabelText("Sort");

		//Changes the dropdown selection for the sort dropdown
		fireEvent.change(sortSelection, { target: { value: "Name" } });
		expect(handleSortChangeMock).toHaveBeenCalled();
		expect(sortSelection.value).toBe("Name");
	});

	test("Calls handleFiterChange() when the selection for filtering changes", () => {
		const handleFilterChangeMock = vi.fn();
		const filterSelection = screen.getByLabelText("Filter");

		//Changes the dropdown selection for the filter dropdown
		expect(handleFilterChangeMock).toHaveBeenCalled();
		fireEvent.change(filterSelection, { target: { value: "Period" } });
		expect(filterSelection.value).toBe("Period");
	});

	test("Render statistics modal correctly", () => {
		//Click on the generate statistics button to open the modal
		fireEvent.click(screen.getByText("Generate Statistics"));

		//Checks if the title is on the screen
		const titleText = screen.getByText("Statistics");
		expect(titleText).toBeInTheDocument();

		//Checks if the area for statistics about materials is on the screen
		const materialArea = screen.getByText("Material Statistics");
		expect(materialArea).toBeInTheDocument();

		//Checks if the area for statistics about the catalogued points is on the screen
		const pointTypeArea = screen.getByText("Point Statistics");
		expect(pointTypeArea).toBeInTheDocument();
	});
});
