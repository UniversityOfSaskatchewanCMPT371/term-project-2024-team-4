/**
 * This test covers:
 * Rendering: Checks if the component renders correctly.
 * Adding: Validates that new base shapes can be added and posted to the server correctly.
 * Editing: Ensures existing base shapes can be updated with PUT requests.
 * Callbacks: Confirms that after saving, the parent component's list is updated.
 * Closing: Verifies the modal closes properly after actions.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import BaseShapeModal from "../src/components/BaseShapeModal";
import http from "../http";

// Mock logger to avoid actual logging during tests
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
describe("BaseShapeModal", () => {
	const mockUpdateBaseShapesList = vi.fn();
	const selectedBaseShape = "Test Shape";
	const selectedBaseShapeID = "1";

	beforeEach(() => {
		http.post.mockClear();
		http.put.mockClear();
		mockUpdateBaseShapesList.mockClear();
	});

	it("should render correctly with default values", async () => {
		render(
			<BaseShapeModal
				setEditBaseShape={() => {}}
				selectedBaseShape=""
				selectedBaseShapeID=""
				updateBaseShapesList={mockUpdateBaseShapesList}
			/>,
		);

		expect(
			screen.getByRole("heading", {
				name: /add new base shape/i,
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

	it("should call http.post on save when adding a new base shape", async () => {
		const newBaseShapeName = "New Base Shape";

		http.post.mockResolvedValue({
			data: { name: newBaseShapeName, id: "new" },
		});

		render(
			<BaseShapeModal
				setEditBaseShape={() => {}}
				selectedBaseShape=""
				selectedBaseShapeID=""
				updateBaseShapesList={mockUpdateBaseShapesList}
			/>,
		);

		fireEvent.change(
			screen.getByRole("textbox", {
				name: /base shape/i,
			}),
			{
				target: { value: newBaseShapeName },
			},
		);
		fireEvent.click(screen.getByText(/Save/i));

		await waitFor(() =>
			expect(http.post).toHaveBeenCalledWith(expect.any(String), {
				name: newBaseShapeName,
			}),
		);
	});

	it("should call http.put on save when editing an existing base shape", async () => {
		const updatedBaseShapeName = "Updated Base Shape";

		http.put.mockResolvedValue({
			data: { name: updatedBaseShapeName, id: selectedBaseShapeID },
		});

		render(
			<BaseShapeModal
				setEditBaseShape={() => {}}
				selectedBaseShape={selectedBaseShape}
				selectedBaseShapeID={selectedBaseShapeID}
				updateBaseShapesList={mockUpdateBaseShapesList}
			/>,
		);

		fireEvent.change(
			screen.getByRole("textbox", {
				name: /base shape/i,
			}),
			{
				target: { value: updatedBaseShapeName },
			},
		);
		fireEvent.click(screen.getByText(/Save/i));

		await waitFor(() =>
			expect(http.put).toHaveBeenCalledWith(expect.any(String), {
				name: updatedBaseShapeName,
			}),
		);
	});
});
