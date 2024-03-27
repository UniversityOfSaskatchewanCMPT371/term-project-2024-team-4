import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ManagementPeriods from "../src/components/ManagementPeriods";
import AddPeriodDialog from "../src/components/AddPeriodDialog";
import axios from "axios";

vi.mock("axios");
// Mock Sidebar component to avoid router or axios dependencies
vi.mock("../src/components/Sidebar", () => {
	return {
		__esModule: true,
		default: () => <div>Sidebar Mock</div>,
	};
});

describe("ManagementPeriods", () => {
	const mockPeriods = [
		{ id: 1, name: "Period 1", start: 1000, end: 1500 },
		{ id: 2, name: "Period 2", start: 1501, end: 2000 },
	];

	beforeEach(() => {
		// Clear all mocks before each test
		vi.clearAllMocks();
		// Setup default mock for axios.get
		axios.get.mockResolvedValue({ data: mockPeriods });
	});

	it("fetches periods from the API and displays them", async () => {
		const { findAllByText } = render(
			<MemoryRouter>
				<ManagementPeriods />
			</MemoryRouter>,
		);
		await waitFor(() => {
			expect(axios.get).toHaveBeenCalledTimes(1);
		});
		// Check if period names are displayed
		expect(await findAllByText("Period 1")).toHaveLength(1);
		expect(await findAllByText("Period 2")).toHaveLength(1);
	});

	it("opens and closes the AddPeriodDialog", async () => {
		const { getByText, queryByText } = render(
			<MemoryRouter>
				<ManagementPeriods />
			</MemoryRouter>,
		);
		fireEvent.click(getByText("Add Period"));
		expect(getByText("Add New Period")).toBeInTheDocument();

		// Simulate closing the dialog
		fireEvent.click(getByText("Cancel"));
		await waitFor(() => {
			expect(queryByText("Add New Period")).not.toBeInTheDocument();
		});
	});
});

describe("AddPeriodDialog", () => {
	beforeEach(() => {});

	it("renders correctly", () => {
		render(
			<AddPeriodDialog
				open={true}
				onClose={vi.fn()}
				onSave={vi.fn()}
				periodNames={["Ancient"]}
			/>,
		);
		expect(screen.getByText("Add New Period")).toBeInTheDocument();
	});

	it("validates form fields before submitting", () => {
		const saveHandler = vi.fn();
		render(
			<AddPeriodDialog
				open={true}
				onClose={vi.fn()}
				onSave={saveHandler}
				periodNames={["Ancient"]}
			/>,
		);
		fireEvent.click(screen.getByText("Save"));
		expect(saveHandler).not.toHaveBeenCalled(); // Should not call onSave because fields are empty
	});
});
