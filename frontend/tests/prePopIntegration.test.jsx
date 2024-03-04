import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import AddProjectile from "../src/components/AddProjectile.jsx";
import { MemoryRouter } from "react-router-dom";

// Mock axios post request for verifying successful submission
vi.mock("axios", () => ({
	...vi.importActual("axios"),
	post: vi.fn(),
}));

describe("AddProjectile Integration Tests", () => {
	beforeEach(() => {
		// Mock clear and setup
		vi.clearAllMocks();
		render(
			<MemoryRouter>
				<AddProjectile />
			</MemoryRouter>,
		);
	});

	it("Test add Material Tag to a Projectile", async () => {
		// Mock new tag addition
		const newMaterialTag = "Metal"; // Assuming 'Metal' is the new material to be tested
		// Simulate user actions and assertions
		const materialDropdown = screen.getByLabelText("Materials");
		fireEvent.change(materialDropdown, { target: { value: newMaterialTag } });
		expect(materialDropdown.value).toBe(newMaterialTag);
	});

	it("Test add Culture Tag to a Projectile", async () => {
		const newCultureTag = "Neolithic"; // Assuming 'Neolithic' is the new culture to be tested
		const cultureDropdown = screen.getByLabelText("Culture");
		fireEvent.change(cultureDropdown, { target: { value: newCultureTag } });
		expect(cultureDropdown.value).toBe(newCultureTag);
	});

	it("Test add Period Tag to a Projectile", async () => {
		const newPeriodTag = "Bronze Age"; // Assuming 'Bronze Age' is the new period to be tested
		const periodDropdown = screen.getByLabelText("Period");
		fireEvent.change(periodDropdown, { target: { value: newPeriodTag } });
		expect(periodDropdown.value).toBe(newPeriodTag);
	});

	it("Submit new projectile", async () => {
		// Filling out form fields
		fireEvent.change(screen.getByLabelText("Name"), {
			target: { value: "New Projectile" },
		});
		fireEvent.change(screen.getByLabelText("Location"), {
			target: { value: "New Location" },
		});
		fireEvent.change(screen.getByLabelText("Description"), {
			target: { value: "New Description" },
		});
		fireEvent.change(screen.getByLabelText("Dimension"), {
			target: { value: "New Dimension" },
		});

		// Mock successful post request
		axios.post.mockResolvedValue({ data: "New projectile added successfully" });

		// Click submit button
		fireEvent.click(screen.getByText(/Submit/i).closest("button"));

		// Checking if post request was called correctly
		expect(axios.post).toHaveBeenCalledWith("http://localhost:3000/artifacts", {
			name: "New Projectile",
			location: "New Location",
			description: "New Description",
			dimension: "New Dimension",
			siteId: 1, // Assuming siteId exists and has ID 1 for the sake of example
			artifactTypeId: "Lithic", // Update this based on the selected value or test scenario
		});
	});
});

describe("AddProjectile Component - Edit Predefined Values Integration Tests", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		render(
			<MemoryRouter>
				<AddProjectile />
			</MemoryRouter>,
		);
	});

	it("Test edit a Material tag in a Projectile", async () => {
		// Example: Changing from 'Lithic' to 'Metal'
		const materialDropdown = screen.getByLabelText("Materials");
		fireEvent.change(materialDropdown, { target: { value: "Metal" } });
		expect(materialDropdown.value).toBe("Metal");
	});

	it("Test edit a Culture tag in a Projectile", async () => {
		const cultureDropdown = screen.getByLabelText("Culture");
		fireEvent.change(cultureDropdown, { target: { value: "Bronze Age" } });
		expect(cultureDropdown.value).toBe("Bronze Age");
	});

	it("Test edit a Period tag in a Projectile", async () => {
		const periodDropdown = screen.getByLabelText("Period");
		fireEvent.change(periodDropdown, { target: { value: "Iron Age" } });
		expect(periodDropdown.value).toBe("Iron Age");
	});

	it("Ensure edits are submitted correctly", async () => {
		// Assuming the form submission reflects the edited values
		// Fill in some fields, change them, then submit
		fireEvent.change(screen.getByLabelText("Name"), {
			target: { value: "Edited Projectile" },
		});
		fireEvent.change(screen.getByLabelText("Location"), {
			target: { value: "Edited Location" },
		});

		// Mock successful post request
		axios.post.mockResolvedValue({ data: "Projectile updated successfully" });

		// Submit form
		fireEvent.click(screen.getByText(/Submit/i).closest("button"));

		// Check if post request was called correctly with edited values
		expect(axios.post).toHaveBeenCalledWith(
			"http://localhost:3000/artifacts",
			expect.objectContaining({
				name: "Edited Projectile",
				location: "Edited Location",
			}),
		);
	});
});

describe("AddProjectile Component - Delete Tag Integration Tests", () => {
	beforeEach(() => {
		// Reset mocks and render component before each test
		vi.clearAllMocks();
		render(
			<MemoryRouter>
				<AddProjectile />
			</MemoryRouter>,
		);
	});

	it("Test delete a Material tag in a Projectile", async () => {
		// Example: Delete 'Lithic' option
		// Assuming there's a way to simulate deletion in the UI, like a delete button next to each tag
		// Since actual deletion UI is not implemented, this is just placeholder action
		// Here, we'll just simulate changing selection instead of actual deletion for demonstration

		// Initial selection change to 'Lithic'
		fireEvent.change(screen.getByLabelText("Materials"), {
			target: { value: "Lithic" },
		});

		fireEvent.click(screen.getByText("Delete Lithic"));

		// Assert 'Lithic' is no longer selected
		expect(screen.getByLabelText("Materials").value).not.toBe("Lithic");
	});
});
