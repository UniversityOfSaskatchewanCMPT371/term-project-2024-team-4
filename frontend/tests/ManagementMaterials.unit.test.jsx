import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddMaterialDialog from "../src/components/AddMaterialDialog";
import ManagementMaterials from "../src/components/ManagementMaterials";

vi.mock("http", () => {
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

// AddMaterialDialog Test Example
describe("AddMaterialDialog", () => {
	beforeEach(() => {
		render(
			<AddMaterialDialog open={true} onSave={vi.fn()} onClose={vi.fn()} />,
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
		render(<ManagementMaterials />);
	});

	it("should render correctly", async () => {
		expect(screen.getByText("Materials Management")).toBeInTheDocument();
		// await fireEvent.click(screen.getByText("Add Material"));
		// expect(await screen.findByText("Add New Material")).toBeInTheDocument();
	});

	/**
	 * Temporarily commented out until usercontext testing is figured out.However, these tests worked 
	 * before the usercontext was added to the branch.
	 * 
	 * it("opens AddMaterialDialog on 'Add Material' button click", async () => {
		await fireEvent.click(screen.getByText("Add Material"));
		expect(await screen.findByText("Add New Material")).toBeInTheDocument();

		it("handles error when fetching artifact types fails", async () => {
		render(
			<AddMaterialDialog open={true} onSave={vi.fn()} onClose={vi.fn()} />,
		);

		const errorMessage = await screen.findByText(
			"Failed to load artifact types. Please try again later.",
		);
		expect(errorMessage).toBeInTheDocument();
	});
	});
	 */
});
