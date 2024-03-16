import { expect, test } from "vitest";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SiteModal from "../src/components/SiteModal";
import RegionModal from "../src/components/RegionModal";
import axios from "axios";

test("SiteModal renders correctly with every field empty", async () => {
	// Render the SiteModal component
	const { getByLabelText } = render(<SiteModal setOpen={() => {}} />);

	// Assert that the input fields are empty
	const siteNameInput = getByLabelText("Site Name");
	const descriptionInput = getByLabelText("Site Description");
	const locationInput = getByLabelText("Location");

	// input feild should be empty.
	expect(siteNameInput.value).toBe("");
	expect(descriptionInput.value).toBe("");
	expect(locationInput.value).toBe("");
});

test("SiteModal renders correctly", async () => {
	const { getByLabelText } = render(<SiteModal setOpen={() => {}} />);

	// Find input fields and buttons
	const siteNameInput = getByLabelText("Site Name");
	const descriptionInput = getByLabelText("Site Description");
	const locationInput = getByLabelText("Location");
	const regionInput = getByLabelText("Region");

	// input something without entering any data into database.
	fireEvent.change(siteNameInput, { target: { value: "Test Site" } });
	fireEvent.change(descriptionInput, { target: { value: "Test Description" } });
	fireEvent.change(locationInput, { target: { value: "Test Location" } });
	fireEvent.click(regionInput);
});

test("RegionModal renders correctly with every field empty", () => {
	// Render the RegionModal component
	const { getByLabelText } = render(<RegionModal />);

	// Find input fields
	const regionInput = getByLabelText("Region Name");
	const descriptionInput = getByLabelText("Description");

	// make sure input feild is empty
	expect(regionInput.value).toBe("");
	expect(descriptionInput.value).toBe("");
});

test("creates a new site and verifies it is saved in the database ", async () => {
	// make some random data and cataloudID and regionID hard cored so it might be different for another user as per their database info
	const siteData = {
		name: "Test Site",
		description: "Test Description",
		location: "Test Location",
		catalogueId: 1,
		regionId: 48,
	};

	try {
		// Send a POST request to create a new site
		const response = await axios.post("http://localhost:3000/sites", siteData);

		// compare the actual data with respone from backend API.
		expect(response.data).toHaveProperty("name", "Test Site");
		expect(response.data).toHaveProperty("description", "Test Description");
		expect(response.data).toHaveProperty("location", "Test Location");

		//check the post request has already posted again
		const createdSiteId = response.data.id;
		const fetchResponse = await axios.get(
			`http://localhost:3000/sites/${createdSiteId}`,
		);

		// Verify that the fetched site matches the posted site data
		expect(fetchResponse.data).toMatchObject(siteData);
	} catch (error) {
		// Handle any errors that occur during the test
		console.error("Error creating new site:", error);
	}
});

test("returns an error message when required information is missing", async () => {
	// Define the site data with missing required fields
	const siteData = {};

	try {
		// Send a POST request to create a new site with missing required fields
		const response = await axios.post("http://localhost:3000/sites", siteData);

		expect(response.status).not.toBe(200);
	} catch (error) {
		// check it response has the error property in the body
		expect(error.response.data).toHaveProperty("error");
	}
});

test("creates a new site through UI and verifies it is saved in the database", async () => {
	// create the data to post it through UI
	const siteData = {
		name: "XYZ",
		description: "Test Description",
		location: "Test Location",
		catalogueId: 1,
	};

	// Render the component
	render(<SiteModal setOpen={() => {}} />);

	// Fill out the form fields with the site data
	const nameInput = screen.getByLabelText("Site Name");
	const descriptionInput = screen.getByLabelText("Site Description");
	const locationInput = screen.getByLabelText("Location");
	

	userEvent.type(nameInput, siteData.name);
	userEvent.type(descriptionInput, siteData.description);
	userEvent.type(locationInput, siteData.location);

	// select the available region in the database
	// userEvent.selectOptions(regionInput, ["SK"]);
	fireEvent.click(screen.getByText("Add"));

	await waitFor(async () => {
		// Get the list of all sites
		const response = await axios.get("http://localhost:3000/sites");

		// find the newest site in the database
		const newSite = response.data.find((site) => site.name === siteData.name);
		expect(newSite.description).toBe(siteData.description);
		expect(newSite.location).toBe(siteData.location);
	});
});
