import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import BladeShapeModal from "../src/components/BladeShapeModal"; // Adjust the import path based on your file structure
import http from "../http";

// Mock logger to prevent actual logging during tests
vi.mock("../logger", () => ({
	info: vi.fn(),
	error: vi.fn(),
	debug: vi.fn(),
}));

// Mock http
vi.mock("../http", () => ({
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
		http.post.mockClear();
		http.put.mockClear();
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

		expect(
			screen.getByRole("heading", {
				name: /add new blade shape/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", {
				name: /cancel/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", {
				name: /save/i,
			}),
		).toBeInTheDocument();
	});

	it("should call http.post on save when adding a new blade shape", async () => {
		const newBladeShapeName = "New Blade Shape";

		http.post.mockResolvedValue({
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

		fireEvent.change(
			screen.getByRole("textbox", {
				name: /blade shape/i,
			}),
			{
				target: { value: newBladeShapeName },
			},
		);
		fireEvent.click(screen.getByText(/Save/i));

		await waitFor(() =>
			expect(http.post).toHaveBeenCalledWith(expect.any(String), {
				name: newBladeShapeName,
			}),
		);
		expect(mockUpdateBladeShapesList).toHaveBeenCalledWith({
			name: newBladeShapeName,
			id: "new",
		});
	});

	it("should call http.put on save when editing an existing blade shape", async () => {
		const updatedBladeShapeName = "Updated Blade Shape";

		http.put.mockResolvedValue({
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

		fireEvent.change(
			screen.getByRole("textbox", {
				name: /blade shape/i,
			}),
			{
				target: { value: updatedBladeShapeName },
			},
		);
		fireEvent.click(screen.getByText(/Save/i));

		await waitFor(() =>
			expect(http.put).toHaveBeenCalledWith(
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
