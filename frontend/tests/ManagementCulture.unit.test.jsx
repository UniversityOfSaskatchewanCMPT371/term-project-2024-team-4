// ManagementCultures.test.jsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import http from "../http";
import ManagementCultures from "../src/components/ManagementCultures";
import AddCultureDialog from "../src/components/AddCultureDialog";

// Mock Sidebar component to avoid router or http dependencies
vi.mock("../src/components/Sidebar", () => {
	return {
		__esModule: true,
		default: () => <div>Sidebar Mock</div>,
	};
});

describe("ManagementCultures", () => {
	beforeEach(() => {
		render(<ManagementCultures />);
		vi.mock("../http", () => ({
			__esModule: true,
			default: {
				get: vi.fn(() =>
					Promise.resolve({ data: [{ id: 1, name: "Culture 1" }] }),
				),
			},
		}));
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it("fetches cultures on mount", async () => {
		await expect(screen.findByText("Culture 1")).resolves.toBeInTheDocument();
	});
});
describe("AddCultureDialog", () => {
	const mockOnClose = vi.fn();
	const mockOnSave = vi.fn();

	beforeEach(() => {
		http.get.mockResolvedValue({
			data: [{ id: 1, name: "Period 1", start: 1000, end: 1500 }],
		});

		render(
			<AddCultureDialog
				open={true}
				onClose={mockOnClose}
				onSave={mockOnSave}
			/>,
		);
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it("renders correctly", async () => {
		// Use findByLabelText for asynchronous elements
		expect(await screen.findByLabelText("Culture Name")).toBeInTheDocument();
		expect(
			await screen.findByLabelText("Associated Period"),
		).toBeInTheDocument();
	});

	it("fetches periods on mount", async () => {
		const associatedPeriodInput =
			await screen.findByLabelText("Associated Period");
		expect(associatedPeriodInput).toBeInTheDocument();
		expect(http.get).toHaveBeenCalledWith("/periods");
	});

	it("handles save button click with validation", async () => {
		fireEvent.click(screen.getByText("Save"));
		await waitFor(() => {
			expect(
				screen.getByText("Both name and associated period are required."),
			).toBeInTheDocument();
			expect(mockOnSave).not.toHaveBeenCalled();
		});
	});
});
