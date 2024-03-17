import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import BladeShapeModal from "../src/components/BladeShapeModal"; // Adjust the import path based on your file structure
import axios from "axios";

// Mock logger to prevent actual logging during tests
vi.mock("../logger", () => ({
	info: vi.fn(),
	error: vi.fn(),
	debug: vi.fn(),
}));

// Mock axios
vi.mock("axios", () => ({
	default: {
		post: vi.fn(() => Promise.resolve({ data: {} })),
		put: vi.fn(() => Promise.resolve({ data: {} })),
	},
}));

describe("BladeShapeModal", () => {
	const mockUpdateBladeShapesList = vi.fn();
	const selectedBladeShape = "Test Shape";
	const selectedBladeShapeID = "1";

	beforeEach(() => {
		axios.post.mockClear();
		axios.put.mockClear();
		mockUpdateBladeShapesList.mockClear();
	});

	it("should render correctly with default values", async () => {
		render(
			<BladeShapeModal
				setEditBladeShape={() => {}}
				selectedBladeShape=""
				selectedBladeShapeID=""
				updateBladeShapesList={mockUpdateBladeShapesList}
			/>,
		);

		expect(screen.getByLabelText(/Blade Shape/i)).toBeInTheDocument();
	});

	it("should call axios.post on save when adding a new blade shape", async () => {
		const newBladeShapeName = "New Blade Shape";

		axios.post.mockResolvedValue({
			data: { name: newBladeShapeName, id: "new" },
		});

		render(
			<BladeShapeModal
				setEditBladeShape={() => {}}
				selectedBladeShape=""
				selectedBladeShapeID=""
				updateBladeShapesList={mockUpdateBladeShapesList}
			/>,
		);

		fireEvent.change(screen.getByLabelText(/Blade Shape/i), {
			target: { value: newBladeShapeName },
		});
		fireEvent.click(screen.getByText(/Save/i));

		await waitFor(() =>
			expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
				name: newBladeShapeName,
			}),
		);
		expect(mockUpdateBladeShapesList).toHaveBeenCalledWith({
			name: newBladeShapeName,
			id: "new",
		});
	});

	it("should call axios.put on save when editing an existing blade shape", async () => {
		const updatedBladeShapeName = "Updated Blade Shape";

		axios.put.mockResolvedValue({
			data: { name: updatedBladeShapeName, id: selectedBladeShapeID },
		});

		render(
			<BladeShapeModal
				setEditBladeShape={() => {}}
				selectedBladeShape={selectedBladeShape}
				selectedBladeShapeID={selectedBladeShapeID}
				updateBladeShapesList={mockUpdateBladeShapesList}
			/>,
		);

		fireEvent.change(screen.getByLabelText(/Blade Shape/i), {
			target: { value: updatedBladeShapeName },
		});
		fireEvent.click(screen.getByText(/Save/i));

		await waitFor(() =>
			expect(axios.put).toHaveBeenCalledWith(
				expect.stringContaining(selectedBladeShapeID),
				{ name: updatedBladeShapeName },
			),
		);
		expect(mockUpdateBladeShapesList).toHaveBeenCalledWith({
			name: updatedBladeShapeName,
			id: selectedBladeShapeID,
		});
	});
});
