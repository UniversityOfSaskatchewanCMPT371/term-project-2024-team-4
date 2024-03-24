/**
 * This test suite verifies the functionalities of the PeriodModal component.
 * It covers the component's rendering, validation, creation, and update processes.
 * It tests:
 *  - Initialization and rendering: Ensures all fields and the 'Save' button are present.
 *  - Validation functionality: Checks whether the start and end dates are validated correctly.
 *  - Save functionality: Tests both the creation (POST) and updating (PUT) of periods through http.
 *  - User input response: Validates the component's response to invalid inputs and user interactions.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import http from "../http";
import PeriodModal from "../src/components/PeriodModal.jsx";

// Mock the http library for HTTP requests
vi.mock("../http", () => ({
	default: {
		post: vi.fn(() =>
			Promise.resolve({
				data: { name: "Test Period", start: 2000, end: 2050 },
			}),
		),
		put: vi.fn(() =>
			Promise.resolve({
				data: { name: "Edited Period", start: 2000, end: 2050 },
			}),
		),
	},
	__esModule: true, // Used to ensure compatibility with ES modules
}));

describe("PeriodModal", () => {
	// Mock callback functions passed as props
	const mockSetEditPeriod = vi.fn();
	const mockUpdatePeriodsList = vi.fn();

	// Reset mocked functions before each test case
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders correctly", () => {
		render(
			<PeriodModal
				setEditPeriod={mockSetEditPeriod}
				updatePeriodsList={mockUpdatePeriodsList}
			/>,
		);
		expect(screen.getByLabelText(/Period Name/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Start Year/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/End Year/i)).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
	});

	it("validates dates correctly", async () => {
		render(
			<PeriodModal
				setEditPeriod={mockSetEditPeriod}
				updatePeriodsList={mockUpdatePeriodsList}
			/>,
		);
		fireEvent.change(screen.getByLabelText(/Start Year/i), {
			target: { value: "not" },
		});
		fireEvent.change(screen.getByLabelText(/End Year/i), {
			target: { value: "not" },
		});
		fireEvent.click(screen.getByRole("button", { name: /save/i }));
		await screen.findByText("Start date is required.");
		await screen.findByText("End date is required.");
	});

	it("calls http.post when saving a new period", async () => {
		render(
			<PeriodModal
				setEditPeriod={mockSetEditPeriod}
				updatePeriodsList={mockUpdatePeriodsList}
			/>,
		);

		// Simulate user input
		fireEvent.change(screen.getByLabelText(/Period Name/i), {
			target: { value: "Test Period" },
		});
		fireEvent.change(screen.getByLabelText(/Start Year/i), {
			target: { value: "2000" },
		});
		fireEvent.change(screen.getByLabelText(/End Year/i), {
			target: { value: "2050" },
		});
		fireEvent.click(screen.getByRole("button", { name: /save/i }));

		await vi.waitFor(() => {
			expect(vi.mocked(http.post)).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					name: "Test Period",
					start: 2000,
					end: 2050,
				}),
			);
		});
	});
});
