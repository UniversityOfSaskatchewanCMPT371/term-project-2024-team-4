/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import EditRegion from "./components/EditRegion";

jest.mock("axios");

describe("EditRegion component", () => {
	test("renders EditRegion component with correct initial values", () => {
		const selectedRegion = "Region 1";
		const selectedDescription = "Description for Region 1";
		const selectedRegionID = 1;

		const { getByLabelText, getByText } = render(
			<EditRegion
				setEditRegion={jest.fn()}
				selectedRegion={selectedRegion}
				selectedDescription={selectedDescription}
				selectedRegionID={selectedRegionID}
			/>,
		);

		const regionInput = getByLabelText("Region");
		const descriptionInput = getByLabelText("Description");
		const saveButton = getByText("Save");

		expect(regionInput.value).toBe(selectedRegion);
		expect(descriptionInput.value).toBe(selectedDescription);
		expect(saveButton).toBeInTheDocument();
	});

	test("calls handleSave function when Save button is clicked", async () => {
		const setEditRegionMock = jest.fn();

		const selectedRegion = "Region 1";
		const selectedDescription = "Description for Region 1";
		const selectedRegionID = 1;

		axios.put.mockResolvedValueOnce({ data: "Updated region" });

		const { getByText } = render(
			<EditRegion
				setEditRegion={setEditRegionMock}
				selectedRegion={selectedRegion}
				selectedDescription={selectedDescription}
				selectedRegionID={selectedRegionID}
			/>,
		);

		const saveButton = getByText("Save");
		fireEvent.click(saveButton);

		await waitFor(() => {
			expect(axios.put).toHaveBeenCalledWith(
				`http://localhost:3000/regions/${selectedRegionID}`,
				{ name: selectedRegion, description: selectedDescription },
			);
			expect(axios.post).not.toHaveBeenCalled();
			expect(setEditRegionMock).toHaveBeenCalledTimes(1);
		});
	});

	test("calls handleClose function when dialog is closed", async () => {
		const handleCloseMock = jest.fn();
		const setEditRegionMock = jest.fn();

		const selectedRegion = "Region 1";
		const selectedDescription = "Description for Region 1";
		const selectedRegionID = 1;

		const { getByLabelText } = render(
			<EditRegion
				setEditRegion={setEditRegionMock}
				selectedRegion={selectedRegion}
				selectedDescription={selectedDescription}
				selectedRegionID={selectedRegionID}
			/>,
		);

		const regionInput = getByLabelText("Region");
		fireEvent.change(regionInput, { target: { value: "Updated Region" } });

		const dialog = document.querySelector(".MuiDialog-root");
		fireEvent.click(dialog);

		expect(handleCloseMock).toHaveBeenCalled();
		expect(setEditRegionMock).toHaveBeenCalled();
	});
});
