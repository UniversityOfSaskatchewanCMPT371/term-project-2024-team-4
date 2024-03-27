import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddMaterialDialog from "../src/components/AddMaterialDialog";
import ManagementMaterials from "../src/components/ManagementMaterials";
import axios from "axios";

vi.mock("axios", () => ({
	__esModule: true,
	default: {
		get: vi.fn(() =>
			Promise.resolve({
				data: [
					{ id: "Lithic", name: "Lithic", materials: [], artifacts: [] },
					{ id: "Ceramic", name: "Ceramic", materials: [], artifacts: [] },
					{ id: "Faunal", name: "Faunal", materials: [], artifacts: [] },
				],
			}),
		),
	},
}));

vi.mock("../src/components/Sidebar", () => ({
	__esModule: true,
	default: () => <div>Sidebar Mock</div>,
}));

// AddMaterialDialog Test Example
describe("AddMaterialDialog", () => {
	beforeEach(() => {
		vi.resetAllMocks();
		render(
			<AddMaterialDialog open={true} onSave={vi.fn()} onClose={vi.fn()} />,
		);
	});

	it("should render correctly", async () => {
		await waitFor(() => {
			expect(screen.getByLabelText("Material Name")).toBeInTheDocument();
			expect(screen.getByLabelText("Description")).toBeInTheDocument();
			expect(
				screen.getByLabelText("Associated Artifact Type"),
			).toBeInTheDocument();
		});
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

	it("handles error when fetching artifact types fails", async () => {
		// Override the axios mock for this test case to simulate a failure
		axios.get.mockRejectedValueOnce(new Error("Failed to fetch"));

		render(
			<AddMaterialDialog open={true} onSave={vi.fn()} onClose={vi.fn()} />,
		);

		await waitFor(() => {
			expect(
				screen.getByText(
					"Failed to load artifact types. Please try again later.",
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
		await waitFor(() => {
			expect(screen.getByText("Materials Management")).toBeInTheDocument();
			fireEvent.click(screen.getByText("Add Material"));
			expect(screen.getByText("Add New Material")).toBeInTheDocument();
		});
	});

	it("opens AddMaterialDialog on 'Add Material' button click", async () => {
		fireEvent.click(screen.getByText("Add Material"));
		expect(await screen.findByText("Add New Material")).toBeInTheDocument();
	});
});
