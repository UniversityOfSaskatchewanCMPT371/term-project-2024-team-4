import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CrossSectionModal from "../src/components/CrossSectionModal";
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

describe("CrossSectionModal", () => {
	const mockUpdateCrossSectionsList = vi.fn();
	const selectedCrossSection = "Test Section";
	const selectedCrossSectionID = "1";

	beforeEach(() => {
		axios.post.mockClear();
		axios.put.mockClear();
		mockUpdateCrossSectionsList.mockClear();
	});

	it("should render correctly with default values", async () => {
		render(
			<CrossSectionModal
				setEditCrossSection={() => {}}
				selectedCrossSection=""
				selectedCrossSectionID=""
				updateCrossSectionsList={mockUpdateCrossSectionsList}
			/>,
		);

		expect(screen.getByLabelText(/Cross Section/i)).toBeInTheDocument();
	});

	it("should call axios.post on save when adding a new cross section", async () => {
		const newCrossSectionName = "New Cross Section";

		axios.post.mockResolvedValue({
			data: { name: newCrossSectionName, id: "new" },
		});

		render(
			<CrossSectionModal
				setEditCrossSection={() => {}}
				selectedCrossSection=""
				selectedCrossSectionID=""
				updateCrossSectionsList={mockUpdateCrossSectionsList}
			/>,
		);

		fireEvent.change(screen.getByLabelText(/Cross Section/i), {
			target: { value: newCrossSectionName },
		});
		fireEvent.click(screen.getByText(/Save/i));

		await waitFor(() =>
			expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
				name: newCrossSectionName,
			}),
		);
		expect(mockUpdateCrossSectionsList).toHaveBeenCalledWith({
			name: newCrossSectionName,
			id: "new",
		});
	});

	it("should call axios.put on save when editing an existing cross section", async () => {
		const updatedCrossSectionName = "Updated Cross Section";

		axios.put.mockResolvedValue({
			data: { name: updatedCrossSectionName, id: selectedCrossSectionID },
		});

		render(
			<CrossSectionModal
				setEditCrossSection={() => {}}
				selectedCrossSection={selectedCrossSection}
				selectedCrossSectionID={selectedCrossSectionID}
				updateCrossSectionsList={mockUpdateCrossSectionsList}
			/>,
		);

		fireEvent.change(screen.getByLabelText(/Cross Section/i), {
			target: { value: updatedCrossSectionName },
		});
		fireEvent.click(screen.getByText(/Save/i));

		await waitFor(() =>
			expect(axios.put).toHaveBeenCalledWith(
				expect.stringContaining(selectedCrossSectionID),
				{ name: updatedCrossSectionName },
			),
		);
		expect(mockUpdateCrossSectionsList).toHaveBeenCalledWith({
			name: updatedCrossSectionName,
			id: selectedCrossSectionID,
		});
	});
});
