import { render, fireEvent, waitFor } from "@testing-library/react";
import http from "../http";
import BladeShapeModal from "../src/components/BladeShapeModal";
import { describe, it, expect, vi } from "vitest";

vi.mock("../http");

describe("BladeShapeModal", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("renders correctly", () => {
		const props = {
			setEditBladeShape: vi.fn(),
			selectedBladeShape: "",
			selectedBladeShapeID: "",
			updateBladeShapesList: vi.fn(),
		};

		const { getByLabelText, getByText } = render(
			<BladeShapeModal {...props} />,
		);

		expect(getByLabelText("Blade Shape")).toBeInTheDocument();
		expect(getByText("Save")).toBeInTheDocument();
	});

	it("calls handleSave when save button is clicked", async () => {
		const props = {
			setEditBladeShape: vi.fn(),
			selectedBladeShape: "",
			selectedBladeShapeID: "",
			updateBladeShapesList: vi.fn(),
			setSelectedBladeShape: vi.fn(),
		};

		const mockAxiosPost = vi
			.spyOn(http, "post")
			.mockResolvedValueOnce({ data: { id: "1", name: "Blade Shape" } });

		const { getByText, getByLabelText } = render(
			<BladeShapeModal {...props} />,
		);

		const shapeInput = getByLabelText("Blade Shape");
		fireEvent.change(shapeInput, { target: { value: "Test Blade Shape" } });

		const saveButton = getByText("Save");
		fireEvent.click(saveButton);

		expect(mockAxiosPost).toHaveBeenCalledWith("/bladeShapes", {
			name: "Test Blade Shape",
		});
		await waitFor(() => expect(props.updateBladeShapesList).toHaveBeenCalled());
		expect(props.setEditBladeShape).toHaveBeenCalledWith(false);
	});

	//   it('closes modal when handleClose is called', () => {
	//     const props = {
	//       setEditBladeShape: vi.fn(),
	//       selectedBladeShape: '',
	//       selectedBladeShapeID: '',
	//       updateBladeShapesList: vi.fn(),
	//     };

	//     const { getByText } = render(<BladeShapeModal {...props} />);
	//     const closeButton = getByText('Close');
	//     fireEvent.click(closeButton);

	//     expect(props.setEditBladeShape).toHaveBeenCalledWith(false);
	//   });

	// Add more test cases for other functionalities as needed
});
