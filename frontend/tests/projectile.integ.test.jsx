import { expect, test } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AddProjectile from "../src/components/ProjectileModal.jsx";
import PeriodModal from "../src/components/PeriodModal.jsx";
// eslint-disable-next-line no-unused-vars
import http from "../http";

test("ProjectilePoint renders correctly", async () => {
	// Define needed data to render the componet. this data should be pre existing in the database.
	const siteData = {
		id: 1,
		name: "Saskatoon",
		description: "sasakatoon is beautiful",
		location: "saskatoon",
		catalogue: {
			id: 1,
			name: "Default Catalogue",
			description: "This is the default catalogue.",
		},
	};

	// Render the ProjectilePoint component inside MemoryRouter with the provided data
	render(
		<MemoryRouter
			initialEntries={[{ pathname: "/site", state: { info: siteData } }]}
		>
			<AddProjectile />
		</MemoryRouter>,
	);

	expect(screen.getByLabelText("Description")).toBeInTheDocument();
	expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
});

test("PeriodModal saves period correctly", async () => {
	render(<PeriodModal />);

	// Fill in period details
	const nameInput = screen.getByLabelText("Period Name");
	fireEvent.change(nameInput, { target: { value: "Test Period" } });

	const startDateInput = screen.getByLabelText("Start Year");
	fireEvent.change(startDateInput, { target: { value: "2020" } });

	const endDateInput = screen.getByLabelText("End Year");
	fireEvent.change(endDateInput, { target: { value: "2021" } });

	// Click save button
	const saveButton = screen.getByRole("button", { name: "Save" });
	fireEvent.click(saveButton);

	// Wait for the component to handle the API request and update accordingly
	await waitFor(() => {
		http
			.get("/periods")
			.then((response) => {
				// Assertions
				expect(response.status).toBe(200); // Assuming status code 200 for success
				expect(response.data).toContainEqual({
					name: "Test Period",
					start: 2020,
					end: 2021,
				});
			})
			.catch((error) => {
				// Handle error if needed
				console.error("Error fetching periods:", error);
			});
	});
});

test("Prevents saving when end year is less than start year", async () => {
	render(<PeriodModal />);

	// Fill in period details
	const nameInput = screen.getByLabelText("Period Name");
	fireEvent.change(nameInput, { target: { value: "Test Period" } });

	const startDateInput = screen.getByLabelText("Start Year");
	fireEvent.change(startDateInput, { target: { value: "2022" } });

	const endDateInput = screen.getByLabelText("End Year");
	fireEvent.change(endDateInput, { target: { value: "2021" } });

	// Click save button
	// const saveButton = screen.getByRole("button", { name: "Save" });
	// fireEvent.click(saveButton);
	fireEvent.click(screen.getByRole("button", { name: /save/i }));
	await screen.findAllByText("End year must be greater than start year.");

	// Assert that an alert message appears
	/**
	 * const alertMessage = await screen.findByText(
		"End year must be greater than start year",
	);
	expect(alertMessage).toBeInTheDocument();
	 */
});

test("Prevents saving when start year or end year is negative", async () => {
	render(<PeriodModal />);

	// Fill in period details
	const nameInput = screen.getByLabelText("Period Name");
	fireEvent.change(nameInput, { target: { value: "Test Period" } });

	// Enter negative values for start and end years
	const startDateInput = screen.getByLabelText("Start Year");
	fireEvent.change(startDateInput, { target: { value: "-2022" } });

	const endDateInput = screen.getByLabelText("End Year");
	fireEvent.change(endDateInput, { target: { value: "-2021" } });

	// Click save button
	fireEvent.click(screen.getByRole("button", { name: /save/i }));
	// fireEvent.click(saveButton);

	// Assert that an alert message appears
	/*
		const alertMessage = await screen.findByText(
		"Start and end years must be greater than or equal to 0",
	);
	expect(alertMessage).toBeInTheDocument();

	*/
	await screen.findByText("Start year must be a positive integer.");
	await screen.findByText("End year must be a positive integer.");
});
