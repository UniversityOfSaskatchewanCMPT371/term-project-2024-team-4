import { render, fireEvent, waitFor } from "@testing-library/react";
import http from "../http";
import BaseShapeModal from "../src/components/BaseShapeModal";
import { describe, it, expect, vi } from "vitest";

vi.mock("../http");

describe("BaseShapeModal", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("renders correctly", () => {
		const props = {
			setEditBaseShape: vi.fn(),
			selectedBaseShape: "",
			selectedBaseShapeID: "",
			updateBaseShapesList: vi.fn(),
		};

		const { getByLabelText, getByText } = render(<BaseShapeModal {...props} />);

		expect(getByLabelText("Base Shape")).toBeInTheDocument();
		expect(getByText("Save")).toBeInTheDocument();
	});

	it("calls handleSave when save button is clicked", async () => {
		const props = {
			setEditBaseShape: vi.fn(),
			selectedBaseShape: "",
			selectedBaseShapeID: "",
			updateBaseShapesList: vi.fn(),
			setSelectedBaseShape: vi.fn(),
		};

		const mockAxiosPost = vi
			.spyOn(http, "post")
			.mockResolvedValueOnce({ data: { id: "1", name: "Base Shape" } });

		const { getByText, getByLabelText } = render(<BaseShapeModal {...props} />);

		const shapeInput = getByLabelText("Base Shape");
		fireEvent.change(shapeInput, { target: { value: "Test Base Shape" } });

		const saveButton = getByText("Save");
		fireEvent.click(saveButton);

		expect(mockAxiosPost).toHaveBeenCalledWith("/baseShapes", {
			name: "Test Base Shape",
		});
		await waitFor(() => expect(props.updateBaseShapesList).toHaveBeenCalled());
		expect(props.setEditBaseShape).toHaveBeenCalledWith(false);
	});

	// it('closes modal when handleClose is called', () => {
	//   const props = {
	//     setEditBaseShape: vi.fn(),
	//     selectedBaseShape: '',
	//     selectedBaseShapeID: '',
	//     updateBaseShapesList: vi.fn(),
	//   };

	//   const { getByText } = render(<BaseShapeModal {...props} />);
	//   const closeButton = getByText('Close');
	//   fireEvent.click(closeButton);

	//   expect(props.setEditBaseShape).toHaveBeenCalledWith(false);
	// });
});
