import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UserContext } from "../src/context/userContext";
import AddMaterialDialog from "../src/components/AddMaterialDialog";
import ManagementMaterials from "../src/components/ManagementMaterials";

vi.mock("../http", () => {
	return {
		__esModule: true,
		default: () => ({
			get: vi.fn(() =>
				Promise.resolve({
					data: [
						{ id: "Lithic", name: "Lithic", materials: [], artifacts: [] },
						{ id: "Ceramic", name: "Ceramic", materials: [], artifacts: [] },
						{ id: "Faunal", name: "Faunal", materials: [], artifacts: [] },
					],
				}),
			),
		}),
	};
});

vi.mock("../src/components/Sidebar", () => ({
	__esModule: true,
	default: () => <div>Sidebar Mock</div>,
}));

// Mock UserContext
const mockUserContextValue = {
	user: {
		userName: "admin",
		isLoggedIn: true,
	},
};

// AddMaterialDialog Test Example
describe("AddMaterialDialog", () => {
	beforeEach(() => {
		render(
			<UserContext.Provider value={mockUserContextValue}>
				<AddMaterialDialog open={true} onSave={vi.fn()} onClose={vi.fn()} />,
			</UserContext.Provider>,
		);
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it("should render correctly", async () => {
		expect(screen.getByLabelText("Material Name")).toBeInTheDocument();
		expect(screen.getByLabelText("Description")).toBeInTheDocument();
		expect(
			screen.getByLabelText("Associated Artifact Type"),
		).toBeInTheDocument();
	});

	it("validates inputs and displays error for empty required fields", async () => {
		// Click save with empty fields
		fireEvent.click(screen.getByText("Save"));
		await waitFor(() => {
			expect(
				screen.getByText(
					"Both name and associated artifact type are required.",
				),
			).toBeInTheDocument();
		});
	});
});
describe("ManagementMaterials", () => {
	beforeEach(() => {
		vi.resetAllMocks();
		render(
			<UserContext.Provider value={mockUserContextValue}>
				<ManagementMaterials />
			</UserContext.Provider>,
		);
	});

	it("should render correctly", async () => {
		expect(screen.getByText("Materials Management")).toBeInTheDocument();
		await fireEvent.click(screen.getByText("Add Material"));
		expect(await screen.findByText("Add New Material")).toBeInTheDocument();
	});

	it("opens AddMaterialDialog on 'Add Material' button click", async () => {
		await fireEvent.click(screen.getByText("Add Material"));
		expect(await screen.findByText("Add New Material")).toBeInTheDocument();
	});
});
