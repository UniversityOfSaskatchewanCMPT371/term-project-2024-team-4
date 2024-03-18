import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ViewProjectile from "../src/components/Projectile.jsx";
import axios from "axios";

// Mock axios
vi.mock("axios");

describe("Projectile", () => {
	it("renders projectile point details correctly", async () => {
		// Mock data for the axios response
		const projectilePointData = {
			id: 1,
			name: "Test Point",
			description: "Test Description",
			location: "Test Location",
			dimensions: "Test Dimensions",
			photo: "Test Photo",
			artifactType: { id: 1 },
			culture: { name: "Test Culture" },
			bladeShape: { name: "Test Blade Shape" },
			baseShape: { name: "Test Base Shape" },
			haftingShape: { name: "Test Hafting Shape" },
			crossSection: { name: "Test Cross Section" },
		};

		// Mock axios get method to return the mock data
		axios.get.mockResolvedValueOnce({ data: projectilePointData });

		render(<ViewProjectile setOpen={() => {}} projectilePointId={1} />);

		// Wait for axios request to resolve
		await waitFor(() => {
			// Check if the data is rendered correctly
			expect(screen.getByText(projectilePointData.name)).toBeInTheDocument();
			expect(
				screen.getByText(projectilePointData.description),
			).toBeInTheDocument();
			expect(
				screen.getByText(projectilePointData.location),
			).toBeInTheDocument();
			expect(
				screen.getByText(projectilePointData.dimensions),
			).toBeInTheDocument();
			expect(screen.getByText(projectilePointData.photo)).toBeInTheDocument();
			expect(
				screen.getByText(projectilePointData.artifactType.id.toString()),
			).toBeInTheDocument();
			expect(
				screen.getByText(projectilePointData.culture.name),
			).toBeInTheDocument();
			expect(
				screen.getByText(projectilePointData.bladeShape.name),
			).toBeInTheDocument();
			expect(
				screen.getByText(projectilePointData.baseShape.name),
			).toBeInTheDocument();
			expect(
				screen.getByText(projectilePointData.haftingShape.name),
			).toBeInTheDocument();
			expect(
				screen.getByText(projectilePointData.crossSection.name),
			).toBeInTheDocument();
		});
	});
});
