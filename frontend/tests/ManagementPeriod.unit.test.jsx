import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UserContext } from "../src/context/userContext";

import ManagementPeriods from "../src/components/ManagementPeriods";
import AddPeriodDialog from "../src/components/AddPeriodDialog";

vi.mock("../http", () => ({
	__esModule: true,
	default: {
		get: vi.fn().mockResolvedValue({
			data: [
				{ id: 1, name: "Period 1", start: 1000, end: 1500, cultures: [] },
				{ id: 2, name: "Period 2", start: 1501, end: 2000, cultures: [] },
			],
		}),
	},
}));

// Mock Sidebar component to avoid router or http dependencies
vi.mock("../src/components/Sidebar", () => {
	return {
		__esModule: true,
		default: () => <div>Sidebar Mock</div>,
	};
});

// Mock UserContext
const mockUserContextValue = {
	user: {
		userName: "admin",
		isLoggedIn: true,
	},
};

describe("AddPeriodDialog", () => {
	beforeEach(() => {});

	it("renders correctly", () => {
		render(
			<UserContext.Provider value={mockUserContextValue}>
				<AddPeriodDialog
					open={true}
					onClose={vi.fn()}
					onSave={vi.fn()}
					periodNames={["Ancient"]}
				/>
				,
			</UserContext.Provider>,
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

describe("ManagementPeriods", () => {
	beforeEach(async () => {
		vi.resetAllMocks();
		render(
			<UserContext.Provider value={mockUserContextValue}>
				<ManagementPeriods />
			</UserContext.Provider>,
		);
	});

	it("opens and closes the AddPeriodDialog", async () => {
		const { getByText, queryByText, getAllByText } = render(
			<UserContext.Provider value={mockUserContextValue}>
				<ManagementPeriods />
			</UserContext.Provider>,
		);
		const addButtons = getAllByText("Add Period");
		expect(addButtons.length).toBeGreaterThan(0);
		fireEvent.click(addButtons[0]);
		expect(getByText("Add New Period")).toBeInTheDocument();

		fireEvent.click(getByText("Cancel"));
		await waitFor(() => {
			expect(queryByText("Add New Period")).not.toBeInTheDocument();
		});
	});
});
