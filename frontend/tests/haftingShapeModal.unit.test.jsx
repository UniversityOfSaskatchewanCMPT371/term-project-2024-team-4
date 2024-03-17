import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import HaftingShapeModal from "../src/components/HaftingShapeModal";
import axios from "axios";

// Mock logger to avoid actual logging during tests
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

describe("HaftingShapeModal", () => {
	const mockUpdateHaftingShapeList = vi.fn();
	const selectedHaftingShape = "Test Shape";
	const selectedHaftingShapeID = "1";

	beforeEach(() => {
		axios.post.mockClear();
		axios.put.mockClear();
		mockUpdateHaftingShapeList.mockClear();
	});

	it("should render correctly with default values", async () => {
		render(
			<HaftingShapeModal
				setEditHaftingShape={() => {}}
				selectedHaftingShape=""
				selectedHaftingShapeID=""
				updateHaftingShapeList={mockUpdateHaftingShapeList}
			/>,
		);

		expect(screen.getByLabelText(/Hafting Shape/i)).toBeInTheDocument();
	});

	it("should call axios.post on save when adding a new hafting shape", async () => {
		const newHaftingShapeName = "New Hafting Shape";

		axios.post.mockResolvedValue({
			data: { name: newHaftingShapeName, id: "new" },
		});

		render(
			<HaftingShapeModal
				setEditHaftingShape={() => {}}
				selectedHaftingShape=""
				selectedHaftingShapeID=""
				updateHaftingShapeList={mockUpdateHaftingShapeList}
			/>,
		);

		fireEvent.change(screen.getByLabelText(/Hafting Shape/i), {
			target: { value: newHaftingShapeName },
		});
		fireEvent.click(screen.getByText(/Save/i));

		await waitFor(() =>
			expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
				name: newHaftingShapeName,
			}),
		);
		expect(mockUpdateHaftingShapeList).toHaveBeenCalledWith(expect.any(Object));
	});

	it("should call axios.put on save when editing an existing hafting shape", async () => {
		const updatedHaftingShapeName = "Updated Hafting Shape";

		axios.put.mockResolvedValue({
			data: { name: updatedHaftingShapeName, id: selectedHaftingShapeID },
		});

		render(
			<HaftingShapeModal
				setEditHaftingShape={() => {}}
				selectedHaftingShape={selectedHaftingShape}
				selectedHaftingShapeID={selectedHaftingShapeID}
				updateHaftingShapeList={mockUpdateHaftingShapeList}
			/>,
		);

		fireEvent.change(screen.getByLabelText(/Hafting Shape/i), {
			target: { value: updatedHaftingShapeName },
		});
		fireEvent.click(screen.getByText(/Save/i));

		await waitFor(() =>
			expect(axios.put).toHaveBeenCalledWith(expect.any(String), {
				name: updatedHaftingShapeName,
			}),
		);
		expect(mockUpdateHaftingShapeList).toHaveBeenCalledWith(expect.any(Object));
	});
});
