import { describe, it, expect, vi } from "vitest";
import { waitFor } from "@testing-library/react";

import "@testing-library/jest-dom";
import http from "../http";

import { render, fireEvent } from "@testing-library/react";
import MaterialModal from "../src/components/MaterialModal";

describe("MaterialModal", () => {
	it("renders correctly", () => {
		const props = {
			setEditMaterial: vi.fn(),
			selectedMaterial: "",
			selectedMaterialDescription: "",
			selectedMaterialID: "",
			updateMaterialList: vi.fn(),
			artifactTypes: [],
		};

		const { getByLabelText, getByText } = render(<MaterialModal {...props} />);

		expect(getByLabelText("Material Name")).toBeInTheDocument();
		expect(getByLabelText("Material Description")).toBeInTheDocument();
		expect(getByLabelText("Associated Artifact Type")).toBeInTheDocument();
		expect(getByText("Save")).toBeInTheDocument();
	});

	it("calls handleSave when save button is clicked", () => {
		const props = {
			setEditMaterial: vi.fn(),
			selectedMaterial: "",
			selectedMaterialDescription: "",
			selectedMaterialID: "",
			updateMaterialList: vi.fn(),
			artifactTypes: [
				{ id: "1", name: "Artifact Type 1" },
				{ id: "2", name: "Artifact Type 2" },
			],
		};

		const { getByText } = render(<MaterialModal {...props} />);
		const saveButton = getByText("Save");
		fireEvent.click(saveButton);
		expect(props.updateMaterialList).not.toHaveBeenCalled();
	});

	it("updates material list and closes modal upon successful save", async () => {
		const props = {
			setEditMaterial: vi.fn(),
			selectedMaterial: "",
			selectedMaterialDescription: "",
			selectedMaterialID: "",
			updateMaterialList: vi.fn(),
			artifactTypes: [
				{ id: "1", name: "Artifact Type 1" },
				{ id: "2", name: "Artifact Type 2" },
			],
			setSelectedMaterial: vi.fn(),
		};

		const mockAxiosPost = vi
			.spyOn(http, "post")
			.mockResolvedValueOnce({ data: { id: "123", name: "Material 1" } });

		const { getByText, getByLabelText } = render(<MaterialModal {...props} />);

		const nameInput = getByLabelText("Material Name");
		fireEvent.change(nameInput, { target: { value: "Test Material" } });

		const descriptionInput = getByLabelText("Material Description");
		fireEvent.change(descriptionInput, {
			target: { value: "Test Description" },
		});

		const artifactTypeSelect = getByLabelText("Associated Artifact Type");
		fireEvent.change(artifactTypeSelect, { target: { value: "1" } });

		const saveButton = getByText("Save");
		fireEvent.click(saveButton);

		expect(mockAxiosPost).toHaveBeenCalled();
		await waitFor(() => expect(props.updateMaterialList).toHaveBeenCalled());
		expect(props.setEditMaterial).toHaveBeenCalledWith(false);
	});
});
