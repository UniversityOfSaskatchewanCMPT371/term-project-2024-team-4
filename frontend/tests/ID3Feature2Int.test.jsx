import { describe, expect, it } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";
import App from "../src/components/App.jsx";

describe("App", () => {
	render(<App />);

	it("renders Sidebar component", () => {
		// Test if title is present on Sidebar
		const titleElement = screen.getByText("PCubed");
		expect(titleElement).toBeInTheDocument();

		// Test if Home nav link is present on Sidebar
		const homeNav = screen.getByText("Home");
		expect(homeNav).toBeInTheDocument();
	});

	it("renders Catalogue component on navigation click", () => {
		// // Click on the Home Sidebar button to view Sites in Catalogue
		fireEvent.click(screen.getByText("Catalogue"));

		const addSiteButton = screen.getByTestId("AddIcon");
		expect(addSiteButton).toBeInTheDocument();

		// Check if View Site button/s is/are present in view Sites
		const viewSiteButton = screen.getByTestId("ViewSiteButton");
		expect(viewSiteButton).toBeInTheDocument();
	});

	it("renders Site component on view site button click", () => {
		// Click on the View Site button to view Site
		const viewSiteButton = screen.getByTestId("ViewSiteButton");
		fireEvent.click(viewSiteButton);

		// Check if Add Projectile button is present in view Site
		const addProjectileButton = screen.getByTestId("AddProjectileButton");
		expect(addProjectileButton).toBeInTheDocument();
	});

	// Test Case ID TC11-TC27
	it("renders components required to add, modify, or delete a projectile", () => {
		// Click on Add Projectile button to show Add Projectile page/modal
		const addProjectileButton = screen.getByTestId("AddProjectileButton");
		fireEvent.click(addProjectileButton);

		// Check if input name field label is present in Add Projectile page
		const nameField = screen.getByText("Name");
		expect(nameField).toBeInTheDocument();

		// Check if username field label is present in modal
		const locationField = screen.getByText("Location");
		expect(locationField).toBeInTheDocument();

		// Check if username field label is present in modal
		const descriptionField = screen.getByText("Description");
		expect(descriptionField).toBeInTheDocument();

		// Check if username field label is present in modal
		const dimensionsField = screen.getByText("Dimensions");
		expect(dimensionsField).toBeInTheDocument();

		// Check if username field label is present in modal
		const addPhotoDropdown = screen.getByText("Photo");
		expect(addPhotoDropdown).toBeInTheDocument();
	});
});
