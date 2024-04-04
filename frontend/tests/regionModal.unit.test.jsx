import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import http from "../http";
import RegionModal from "../src/components/RegionModal";

vi.mock("../http");
vi.mock("../logger", () => ({
	info: vi.fn(),
	error: vi.fn(),
}));

describe("RegionModal", () => {
	const mockUpdateRegionsList = vi.fn();
	const mockSetEditRegion = vi.fn();
	const mockSelectedRegion = vi.fn();

	beforeEach(() => {
		http.post.mockClear();
		http.put.mockClear();
		mockUpdateRegionsList.mockClear();
		mockSetEditRegion.mockClear();
	});

	it("renders correctly for adding a new region", () => {
		render(
			<RegionModal
				selectedRegion={{ name: "", description: "" }}
				updateRegionsList={mockUpdateRegionsList}
				setEditRegion={mockSetEditRegion}
			/>,
		);
		expect(screen.getByLabelText(/Region Name/)).toBeInTheDocument();
		expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
		expect(screen.getByText(/Save/)).toBeInTheDocument();
	});

	it("calls http.post on save when adding a new region", async () => {
		const newRegionName = "New Region";
		const newRegionDescription = "A new region description.";

		http.post.mockResolvedValue({
			data: {
				id: "123",
				name: newRegionName,
				description: newRegionDescription,
			},
		});

		render(
			<RegionModal
				selectedRegion={{ name: "", description: "" }}
				updateRegionsList={mockUpdateRegionsList}
				setEditRegion={mockSetEditRegion}
			/>,
		);

		fireEvent.change(screen.getByLabelText(/Region Name/), {
			target: { value: newRegionName },
		});
		fireEvent.change(screen.getByLabelText(/Description/), {
			target: { value: newRegionDescription },
		});
		fireEvent.click(screen.getByText(/Save/));

		await waitFor(() => {
			expect(http.post).toHaveBeenCalled();
			expect(mockUpdateRegionsList).toHaveBeenCalledWith(
				expect.objectContaining({ id: "123" }),
			);
		});
	});

	it("calls http.put on save when editing an existing region", async () => {
		const existingRegionID = "existing-id";
		const originalRegion = { name: "Original Name", description: "" };
		const originalRegionDescription = "Original description.";
		const updatedRegionName = "Updated Region";
		const updatedRegionDescription = "Updated description.";

		// Mock the PUT response to simulate updating the region successfully
		http.put.mockResolvedValue({
			data: {
				id: existingRegionID,
				name: updatedRegionName,
				description: updatedRegionDescription,
			},
		});

		render(
			<RegionModal
				setEditRegion={mockSetEditRegion}
				selectedRegion={originalRegion}
				selectedRegionDescription={originalRegionDescription}
				selectedRegionID={existingRegionID}
				updateRegionsList={mockUpdateRegionsList}
				setSelectedRegion={mockSelectedRegion}
			/>,
		);

		// Simulate user changing the name and description of the region
		fireEvent.change(screen.getByLabelText(/Region Name/), {
			target: { value: updatedRegionName },
		});
		fireEvent.change(screen.getByLabelText(/Description/), {
			target: { value: updatedRegionDescription },
		});

		// Simulate user clicking the 'Save' button
		fireEvent.click(screen.getByText(/Save/));

		// Wait for http.put to be called and verify it was called with the correct arguments
		await waitFor(() => {
			expect(http.put).toHaveBeenCalledWith(
				expect.stringContaining(existingRegionID),
				expect.objectContaining({
					name: updatedRegionName,
					description: updatedRegionDescription,
				}),
			);
			// Verify that the updateRegionsList function was called with the response data
			expect(mockUpdateRegionsList).toHaveBeenCalledWith(
				expect.objectContaining({
					id: existingRegionID,
					name: updatedRegionName,
					description: updatedRegionDescription,
				}),
			);
		});
		expect(mockSetEditRegion).toHaveBeenCalledWith(false);
	});
});
