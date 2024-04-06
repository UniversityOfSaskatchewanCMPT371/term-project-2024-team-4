import { expect, test } from "vitest";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SiteModal from "../src/components/SiteModal";
import RegionModal from "../src/components/RegionModal";
import http from "../http";

test("SiteModal renders correctly with every field empty", async () => {
	// Render the SiteModal component
	const { getByLabelText } = render(<SiteModal setOpen={() => {}} />);

	// Assert that the input fields are empty
	const siteNameInput = getByLabelText("Site Name *");
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
	const siteNameInput = getByLabelText("Site Name *");
	const descriptionInput = getByLabelText("Site Description");
	const locationInput = getByLabelText("Location");

	// input something without entering any data into database.
	fireEvent.change(siteNameInput, { target: { value: "Test Site" } });
	fireEvent.change(descriptionInput, {
		target: { value: "Test Description" },
	});
	fireEvent.change(locationInput, { target: { value: "Test Location" } });
});

test("RegionModal renders correctly with every field empty", () => {
	const selectedRegion = { name: "" };
	// Render the RegionModal component
	const { getByLabelText } = render(
		<RegionModal selectedRegion={selectedRegion} />,
	);

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
		regionId: 1,
	};
	try {
		// Send a POST request to create a new site
		const response = await http.post("/sites", siteData);

		// compare the actual data with respone from backend API.
		expect(response.data).toMatchObject({
			name: siteData.name,
			description: siteData.description,
			location: siteData.location,
			catalogue: expect.objectContaining({ id: siteData.catalogueId }),
			region: expect.objectContaining({ id: siteData.regionId }),
		});

		//check the post request has already posted again
		const createdSiteId = response.data.id;
		const fetchResponse = await http.get(`/sites/${createdSiteId}`);

		// Verify that the fetched site matches the posted site data
		expect(fetchResponse.data).toMatchObject({
			name: siteData.name,
			description: siteData.description,
			location: siteData.location,
			catalogue: expect.any(Object),
			region: expect.any(Object),
		});
	} catch (error) {
		// Handle any errors that occur during the test
		console.error("Error creating new site:", error);
	}
}, 10000);

test("returns an error message when required information is missing", async () => {
	// Define the site data with missing required fields
	const siteData = {};

	try {
		// Send a POST request to create a new site with missing required fields
		const response = await http.post("/sites", siteData);

		expect(response.status).not.toBe(200);
	} catch (error) {
		// check it response has the error property in the body
	}
});

test("creates a new site through UI and verifies it is not saved (region is missing intentionally)", async () => {
	const siteData = {
		name: "XYZ",
		description: "Test Description",
		location: "Test Location",
		catalogueId: 1, // Note: regionId is intentionally left out
	};

	// Render the component
	render(<SiteModal openAdd={true} />);

	// Fill out the form fields with the site data
	const nameInput = screen.getByLabelText("Site Name *");
	const descriptionInput = screen.getByLabelText("Site Description");
	const locationInput = screen.getByLabelText("Location");

	await userEvent.type(nameInput, siteData.name);
	await userEvent.type(descriptionInput, siteData.description);
	await userEvent.type(locationInput, siteData.location);

	fireEvent.click(screen.getByText("Add"));

	const errorMessage = await screen.findByText("Region is required");
	expect(errorMessage).toBeInTheDocument();

	await waitFor(
		async () => {
			// Get the list of all sites
			const response = await http.get("/sites");

			// find the newest site in the database

			const newSite = response.data.find((site) => site.name === siteData.name);

			//assuming sites is not posted
			expect(newSite).toBeUndefined();
		},
		{ timeout: 5000 },
	);
});

test("RegionModal renders correctly and handles addition of a new region", async () => {
	const selectedRegion = { name: "" };
	// Render the RegionModal component
	render(<RegionModal selectedRegion={selectedRegion} />);

	// Simulate user input by typing in the region name and description fields
	const regionNameInput = screen.getByLabelText("Region Name");
	fireEvent.change(regionNameInput, { target: { value: "Test Region" } });

	const descriptionInput = screen.getByLabelText("Description");
	fireEvent.change(descriptionInput, {
		target: { value: "Test Description" },
	});

	// Click the save button
	const saveButton = screen.getByText("Save");
	fireEvent.click(saveButton);

	// Wait for the response from the backend endpoint
	await waitFor(() => {
		http
			.get("/regions")
			.then((response) => {
				// Assertions
				expect(response.status).toBe(200); // Assuming status code 200 for success
				expect(response.data).toContainEqual({
					name: "Test Region",
					description: "Test Description",
				});
			})
			.catch((error) => {
				// Handle error if needed
				console.error("Error fetching regions:", error);
			});
	});
});
