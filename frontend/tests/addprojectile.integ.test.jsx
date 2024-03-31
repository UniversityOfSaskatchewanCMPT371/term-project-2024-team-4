import { test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AddProjectile from "../src/components/ProjectileModal.jsx";

test("ProjectilePoint renders correctly test the error message for width, length and height", async () => {
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

	const widthInput = screen.getByLabelText("Width");
	const lengthInput = screen.getByLabelText("Length");
	const heightInput = screen.getByLabelText("Height");

	fireEvent.change(widthInput, { target: { value: "abc" } });
	await screen.findByText(/Invalid width/i);
	fireEvent.change(lengthInput, { target: { value: "abc" } });
	await screen.findByText(/Invalid Length/i);
	fireEvent.change(heightInput, { target: { value: "abc" } });
	await screen.findByText(/Invalid Height/i);
});

test("ProjectilePoint renders correctly and test the error message for width, length and height when value of 0", async () => {
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

	const widthInput = screen.getByLabelText("Width");
	const lengthInput = screen.getByLabelText("Length");
	const heightInput = screen.getByLabelText("Height");

	fireEvent.change(widthInput, { target: { value: 0 } });
	await screen.findByText(/Invalid width/i);
	fireEvent.change(lengthInput, { target: { value: 0 } });
	await screen.findByText(/Invalid Length/i);
	fireEvent.change(heightInput, { target: { value: 0 } });
	await screen.findByText(/Invalid Height/i);
});
