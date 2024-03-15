import { screen, render, fireEvent } from "@testing-library/react";
import { test, expect } from "vitest";
import StatisticsPage from "../src/components/StatisticsPage.jsx";

test("Render statistics page correctly", async () => {
	render(<StatisticsPage />);

	//Test if the button to generate statistics is on the screen
	const statisticButton = screen.getByText("Generate Statistics");
	expect(statisticButton).toBeInTheDocument();

	//Test if the area for the list of points (with column headers) is on the screen
	const listArea = screen.getByText("Site");
	expect(listArea).toBeInTheDocument();
});

test("Render statistics modal correctly", () => {
	render(<StatisticsPage />);

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
