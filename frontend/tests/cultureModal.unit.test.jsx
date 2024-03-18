import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import CultureModal from "../src/components/CultureModal";

// Mock logger to avoid logging during tests
vi.mock("../logger", () => ({
	debug: vi.fn(),
	info: vi.fn(),
	warn: vi.fn(),
	error: vi.fn(),
}));

// Mock axios
vi.mock("axios", () => ({
	default: {
		post: vi.fn(() => Promise.resolve({ data: {} })),
		put: vi.fn(() => Promise.resolve({ data: {} })),
	},
}));

// Example periods data
const mockPeriods = [
	{ id: "1", name: "Period 1" },
	{ id: "2", name: "Period 2" },
];

describe("CultureModal", () => {
	beforeEach(() => {
		axios.post.mockClear();
		axios.put.mockClear();
	});

	it("should render correctly", () => {
		render(
			<CultureModal
				setEditCulture={() => {}}
				selectedCulture=""
				selectedCultureID=""
				updateCulturesList={() => {}}
				periods={mockPeriods}
			/>,
		);
		expect(screen.getByText(/Add New Culture/i)).toBeInTheDocument();
	});

	it("should call axios.post on save when adding a new culture", async () => {
		axios.post.mockResolvedValue({
			data: { name: "New Culture", periodId: "1" },
		});

		render(
			<CultureModal
				setEditCulture={() => {}}
				selectedCulture=""
				selectedCultureID=""
				updateCulturesList={() => {}}
				periods={mockPeriods}
			/>,
		);

		fireEvent.change(screen.getByLabelText(/Culture Name/i), {
			target: { value: "New Culture" },
		});
		fireEvent.change(screen.getByLabelText(/Associated Period/i), {
			target: { value: "1" },
		});
		fireEvent.click(screen.getByText(/Save/i));

		await waitFor(() =>
			expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
				name: "New Culture",
				periodId: "1",
			}),
		);
	});

	it("should call axios.put on save when editing an existing culture", async () => {
		axios.put.mockResolvedValue({
			data: { name: "Edited Culture", periodId: "2" },
		});

		render(
			<CultureModal
				setEditCulture={() => {}}
				selectedCulture="Existing Culture"
				selectedCultureID="1"
				updateCulturesList={() => {}}
				periods={mockPeriods}
			/>,
		);

		fireEvent.change(screen.getByLabelText(/Culture Name/i), {
			target: { value: "Edited Culture" },
		});
		fireEvent.change(screen.getByLabelText(/Associated Period/i), {
			target: { value: "2" },
		});
		fireEvent.click(screen.getByText(/Save/i));

		await waitFor(() =>
			expect(axios.put).toHaveBeenCalledWith(expect.any(String), {
				name: "Edited Culture",
				periodId: "2",
			}),
		);
	});
});
