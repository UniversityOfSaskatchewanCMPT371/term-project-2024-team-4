import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import MaterialModal from "../src/components/MaterialModal";
import http from "../http";

vi.mock("../logger", () => ({
	__esModule: true,
	info: vi.fn(),
	error: vi.fn(),
	debug: vi.fn(),
}));

vi.mock("../http");

const mockUpdateMaterialList = vi.fn();
const artifactTypes = [
	{ id: "1", name: "Artifact Type 1" },
	{ id: "2", name: "Artifact Type 2" },
];

beforeEach(() => {
	vi.clearAllMocks();
});

describe("MaterialModal", () => {
	it("renders correctly with default values", () => {
		render(
			<MaterialModal
				setEditMaterial={() => {}}
				selectedMaterial=""
				selectedMaterialDescription=""
				selectedMaterialID=""
				updateMaterialList={mockUpdateMaterialList}
				artifactTypes={artifactTypes}
			/>,
		);

		expect(screen.getByLabelText("Material Name")).toBeInTheDocument();
		expect(screen.getByLabelText("Material Description")).toBeInTheDocument();
		expect(
			screen.getByLabelText("Associated Artifact Type"),
		).toBeInTheDocument();
	});

	it("calls http.post on save when adding a new material", async () => {
		const newMaterial = {
			name: "New Material",
			description: "New Description",
			artifactTypeId: "1",
		};

		http.post.mockResolvedValue({ data: newMaterial });

		render(
			<MaterialModal
				setEditMaterial={() => {}}
				selectedMaterial=""
				selectedMaterialDescription=""
				selectedMaterialID=""
				updateMaterialList={mockUpdateMaterialList}
				artifactTypes={artifactTypes}
			/>,
		);

		fireEvent.change(screen.getByLabelText("Material Name"), {
			target: { value: newMaterial.name },
		});
		fireEvent.change(screen.getByLabelText("Material Description"), {
			target: { value: newMaterial.description },
		});
		fireEvent.change(screen.getByLabelText("Associated Artifact Type"), {
			target: { value: newMaterial.artifactTypeId },
		});
		fireEvent.click(screen.getByText("Save"));

		await waitFor(() => expect(http.post).toHaveBeenCalled());
		expect(mockUpdateMaterialList).toHaveBeenCalledWith(newMaterial);
	});

	it("calls http.put on save when editing an existing material", async () => {
		const updatedMaterial = {
			name: "Updated Material",
			description: "Updated Description",
			artifactTypeId: "2",
		};
		const selectedMaterialID = "123";

		http.put.mockResolvedValue({ data: updatedMaterial });

		render(
			<MaterialModal
				setEditMaterial={() => {}}
				selectedMaterial="Old Material"
				selectedMaterialDescription="Old Description"
				selectedMaterialID={selectedMaterialID}
				updateMaterialList={mockUpdateMaterialList}
				artifactTypes={artifactTypes}
			/>,
		);

		fireEvent.change(screen.getByLabelText("Material Name"), {
			target: { value: updatedMaterial.name },
		});
		fireEvent.change(screen.getByLabelText("Material Description"), {
			target: { value: updatedMaterial.description },
		});
		fireEvent.change(screen.getByLabelText("Associated Artifact Type"), {
			target: { value: updatedMaterial.artifactTypeId },
		});
		fireEvent.click(screen.getByText("Save"));

		await waitFor(() => expect(http.put).toHaveBeenCalled());
		expect(mockUpdateMaterialList).toHaveBeenCalledWith(updatedMaterial);
	});
});
