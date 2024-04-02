import { test } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AddProjectile from "../src/components/ProjectileModal.jsx";
import ProjectileList from "../src/components/ProjectileList";
import http from "../http";

test("ProjectilePoint renders correctly and test the error message for width, length and height", async () => {
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

test("add the projectile point without adding any info and artifacts Type shows the error message", async () => {
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

	render(
		<MemoryRouter
			initialEntries={[{ pathname: "/site", state: { info: siteData } }]}
		>
			{/* Render the AddProjectile component with openAdd prop set to true */}
			<AddProjectile openAdd={true} />
		</MemoryRouter>,
	);

	fireEvent.click(screen.getByRole("button", { name: /ADD/i }));
	await screen.findAllByText("Please select an Artifact Type");
});

test("clicking on a projectile point card And delete the projectile point", async () => {
	// Render the ProjectileList component
	render(<ProjectileList siteId={1} siteName="Saskatoon" />);

	try {
		// Make GET request to fetch site data
		const response = await http.get("/sites/1");

		if (response.ok) {
			const siteData = await response.json();
			const projectilePointId = siteData.artifacts[0].id;
			const projectilepoint_name = "Saskatoon" + "-" + projectilePointId;

			const [projectilePointButton] = screen.getByRole("button", {
				name: new RegExp(projectilepoint_name, "i"),
			});
			fireEvent.click(projectilePointButton);

			await waitFor(() => {
				const deleteButton = screen.getByText("Delete");
				expect(deleteButton).toBeInTheDocument();
			});
			fireEvent.click(screen.getByRole("button", { name: /DELETE/i }));

			// Wait for the projectile point to be deleted
			await waitFor(() => {
				const deletedProjectilePoint = screen.queryByText(projectilepoint_name);
				expect(deletedProjectilePoint).not.toBeInTheDocument();
			});
		} else {
			console.error("Failed to fetch site data:", response.statusText);
		}
	} catch (error) {
		console.error("Error fetching site data:", error);
	}
}, 10000);
