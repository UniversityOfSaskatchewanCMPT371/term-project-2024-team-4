// ManagementCultures.test.jsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import ManagementCultures from "../src/components/ManagementCultures";
import AddCultureDialog from "../src/components/AddCultureDialog";

// Mock Sidebar component to avoid router or axios dependencies
vi.mock("../src/components/Sidebar", () => {
	return {
		__esModule: true,
		default: () => <div>Sidebar Mock</div>,
	};
});

vi.mock("axios", () => ({
	__esModule: true,
	default: {
		get: vi.fn(() => Promise.resolve({ data: [{ id: 1, name: "Culture 1" }] })),
		delete: vi.fn(() => Promise.resolve()),
	},
}));

describe("ManagementCultures", () => {
	beforeEach(() => {
		render(<ManagementCultures />);
	});

	it("fetches cultures on mount", async () => {
		await waitFor(() => {
			expect(screen.getByText("Culture 1")).toBeInTheDocument();
		});
	});
});

describe("AddCultureDialog", () => {
	const mockOnClose = vi.fn();
	const mockOnSave = vi.fn();

	beforeEach(() => {
		axios.get.mockResolvedValue({
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

	it("renders correctly", async () => {
		await waitFor(() => {
			expect(screen.getByLabelText("Culture Name")).toBeInTheDocument();
			expect(screen.getByLabelText("Associated Period")).toBeInTheDocument();
		});
	});

	it("fetches periods on mount", async () => {
		await waitFor(() => {
			expect(axios.get).toHaveBeenCalledWith("http://localhost:3000/periods");
			expect(screen.getByLabelText("Associated Period")).toBeInTheDocument();
		});
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
