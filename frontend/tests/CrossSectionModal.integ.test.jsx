import { render, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import http from "../http";
import CrossSectionModal from "../src/components/CrossSectionModal";

describe("CrossSectionModal", () => {
	it("renders correctly", () => {
		const props = {
			setEditCrossSection: vi.fn(),
			selectedCrossSection: "",
			selectedCrossSectionID: "",
			updateCrossSectionsList: vi.fn(),
		};

		const { getByLabelText, getByText } = render(
			<CrossSectionModal {...props} />,
		);

		expect(getByLabelText("Cross Section")).toBeInTheDocument();
		expect(getByText("Save")).toBeInTheDocument();
	});

	it("calls handleSave when save button is clicked", async () => {
		const props = {
			setEditCrossSection: vi.fn(),
			selectedCrossSection: "",
			selectedCrossSectionID: "",
			updateCrossSectionsList: vi.fn(),
			setSelectedCrossSection: vi.fn(),
		};

		const { getByText, getByLabelText } = render(
			<CrossSectionModal {...props} />,
		);

		const mockResponseData = { data: { id: "1", name: "Cross Section" } };
		vi.spyOn(http, "post").mockResolvedValueOnce(mockResponseData);

		const shapeInput = getByLabelText("Cross Section");
		fireEvent.change(shapeInput, { target: { value: "Test Cross Section" } });

		const saveButton = getByText("Save");
		fireEvent.click(saveButton);

		await waitFor(() =>
			expect(http.post).toHaveBeenCalledWith("/crossSections", {
				name: "Test Cross Section",
			}),
		);
		await waitFor(() =>
			expect(props.updateCrossSectionsList).toHaveBeenCalledWith(
				mockResponseData.data,
			),
		);
		expect(props.setEditCrossSection).toHaveBeenCalledWith(false);
	});

	//   it('closes modal when handleClose is called', () => {
	//     const props = {
	//       setEditCrossSection: vi.fn(),
	//       selectedCrossSection: '',
	//       selectedCrossSectionID: '',
	//       updateCrossSectionsList: vi.fn(),
	//     };

	//     const { getByText } = render(<CrossSectionModal {...props} />);
	//     const closeButton = getByText('Close');
	//     fireEvent.click(closeButton);

	//     expect(props.setEditCrossSection).toHaveBeenCalledWith(false);
	//   });
});
