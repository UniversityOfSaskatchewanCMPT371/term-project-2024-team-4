import { render, fireEvent, waitFor } from "@testing-library/react";
import http from "../http";
import HaftingShapeModal from "../src/components/HaftingShapeModal";
import { describe, it, expect, vi } from "vitest";

vi.mock("../http");

describe("HaftingShapeModal", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("renders correctly", () => {
		const props = {
			setEditHaftingShape: vi.fn(),
			selectedHaftingShape: "",
			selectedHaftingShapeID: "",
			updateHaftingShapeList: vi.fn(),
		};

		const { getByLabelText, getByText } = render(
			<HaftingShapeModal {...props} />,
		);

		expect(getByLabelText("Hafting Shape")).toBeInTheDocument();
		expect(getByText("Save")).toBeInTheDocument();
	});

	it("calls handleSave when save button is clicked", async () => {
		const props = {
			setEditHaftingShape: vi.fn(),
			selectedHaftingShape: "",
			selectedHaftingShapeID: "",
			updateHaftingShapeList: vi.fn(),
			setSelectedHaftingShape: vi.fn(),
		};

		const mockAxiosPost = vi
			.spyOn(http, "post")
			.mockResolvedValueOnce({ data: { id: "1", name: "Hafting Shape" } });

		const { getByText, getByLabelText } = render(
			<HaftingShapeModal {...props} />,
		);

		const shapeInput = getByLabelText("Hafting Shape");
		fireEvent.change(shapeInput, { target: { value: "Test Hafting Shape" } });

		const saveButton = getByText("Save");
		fireEvent.click(saveButton);

		expect(mockAxiosPost).toHaveBeenCalledWith("/haftingShapes", {
			name: "Test Hafting Shape",
		});
		await waitFor(() =>
			expect(props.updateHaftingShapeList).toHaveBeenCalled(),
		);
		expect(props.setEditHaftingShape).toHaveBeenCalledWith(false);
	});

	//   it('closes modal when handleClose is called', () => {
	//     const props = {
	//       setEditHaftingShape: vi.fn(),
	//       selectedHaftingShape: '',
	//       selectedHaftingShapeID: '',
	//       updateHaftingShapeList: vi.fn(),
	//     };

	//     const { getByText } = render(<HaftingShapeModal {...props} />);
	//     const closeButton = getByText('Close');
	//     fireEvent.click(closeButton);

	//     expect(props.setEditHaftingShape).toHaveBeenCalledWith(false);
	//   });
});
