import { screen, render, fireEvent } from "@testing-library/react";
import { test, expect } from "vitest";
import StatisticsPage from "../src/components/StatisticsPage.jsx";
import { MemoryRouter } from "react-router-dom";

test("Render statistics page correctly", async () => {
	render(
		<MemoryRouter>
			<StatisticsPage />
		</MemoryRouter>,
	);

	//Test if the button to generate statistics is on the screen
	const statisticButton = screen.getByText("Generate Statistics");
	expect(statisticButton).toBeInTheDocument();

	//Test if the area for the list of points (with column headers) is on the screen
	const listArea = screen.getByText("Site");
	expect(listArea).toBeInTheDocument();
});

test("Render statistics modal correctly", () => {
	render(
		<MemoryRouter>
			<StatisticsPage />
		</MemoryRouter>,
	);

	//Click on the generate statistics button to open the modal
	fireEvent.click(screen.getByRole("button", { name: "Generate Statistics" }));

	//Checks if the area for statistics about materials is on the screen
	const materialArea = screen.getByText("Catalogue Statistics");
	expect(materialArea).toBeInTheDocument();

	// //Checks if the area for statistics about materials is on the screen
	// const materialArea = screen.getByText("Material Percentage by Catalogue");
	// expect(materialArea).toBeInTheDocument();

	// //Checks if the area for statistics about the catalogued points is on the screen
	// const pointTypeArea = screen.getByText("Point Count by Site");
	// expect(pointTypeArea).toBeInTheDocument();

	const closeButton = screen.getByText("Close");
	expect(closeButton).toBeInTheDocument();
});
