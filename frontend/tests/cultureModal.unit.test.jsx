import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import http from "../http";
import CultureModal from "../src/components/CultureModal";

// Mock logger to avoid logging during tests
vi.mock("../logger", () => ({
	debug: vi.fn(),
	info: vi.fn(),
	warn: vi.fn(),
	error: vi.fn(),
}));

// Mock http
vi.mock("../http", () => ({
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
		http.post.mockClear();
		http.put.mockClear();
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

	it("should call http.post on save when adding a new culture", async () => {
		http.post.mockResolvedValue({
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
			expect(http.post).toHaveBeenCalledWith(expect.any(String), {
				name: "New Culture",
				periodId: "1",
			}),
		);
	});

	it("should call http.put on save when editing an existing culture", async () => {
		http.put.mockResolvedValue({
			data: { name: "Edited Culture", periodId: "2" },
		});

		render(
			<CultureModal
				setEditCulture={() => {}}
				selectedCulture={{ name: "selected culture", period: { id: 1 } }}
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
			expect(http.put).toHaveBeenCalledWith(expect.any(String), {
				name: "Edited Culture",
				periodId: "2",
			}),
		);
	});
});
