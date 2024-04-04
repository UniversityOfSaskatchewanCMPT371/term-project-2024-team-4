import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CrossSectionModal from "../src/components/CrossSectionModal";
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

describe("CrossSectionModal", () => {
	const mockUpdateCrossSectionsList = vi.fn();
	const selectedCrossSection = "Test Section";
	const selectedCrossSectionID = "1";

	beforeEach(() => {
		http.post.mockClear();
		http.put.mockClear();
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

		expect(
			screen.getByRole("heading", {
				name: /add new cross section/i,
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

	it("should call http.post on save when adding a new cross section", async () => {
		const newCrossSectionName = "New Cross Section";

		http.post.mockResolvedValue({
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

		fireEvent.change(
			screen.getByRole("textbox", {
				name: /cross section/i,
			}),
			{
				target: { value: newCrossSectionName },
			},
		);
		fireEvent.click(screen.getByText(/Save/i));

		await waitFor(() =>
			expect(http.post).toHaveBeenCalledWith(expect.any(String), {
				name: newCrossSectionName,
			}),
		);
		expect(mockUpdateCrossSectionsList).toHaveBeenCalledWith({
			name: newCrossSectionName,
			id: "new",
		});
	});

	it("should call http.put on save when editing an existing cross section", async () => {
		const updatedCrossSectionName = "Updated Cross Section";

		http.put.mockResolvedValue({
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

		fireEvent.change(
			screen.getByRole("textbox", {
				name: /cross section/i,
			}),
			{
				target: { value: updatedCrossSectionName },
			},
		);
		fireEvent.click(screen.getByText(/Save/i));

		await waitFor(() =>
			expect(http.put).toHaveBeenCalledWith(
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
