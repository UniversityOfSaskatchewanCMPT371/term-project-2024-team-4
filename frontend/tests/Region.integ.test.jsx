import { expect, test, vi } from "vitest";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import RegionModal from "../src/components/RegionModal";
import axios from "axios";

test("RegionModal renders correctly with every field empty", () => {
	// Render the RegionModal component
	render(<RegionModal />);

	// Find input fields
	const regionInput = screen.getByLabelText("Region Name");
	const descriptionInput = screen.getByLabelText("Description");

	// make sure input field is empty
	expect(regionInput.value).toBe("");
	expect(descriptionInput.value).toBe("");
});

test("should edit region on button click", async () => {
	const selectedRegion = "Existing Region";
	const selectedRegionID = "123";

	// Mocking setEditRegion and updateRegionsList functions
	const setEditRegion = vi.fn();
	const updateRegionsList = vi.fn();

	// Mocking axios.put
	vi.spyOn(axios, "put").mockResolvedValue({});

	const { getByLabelText, getByText } = render(
		<RegionModal
			setEditRegion={setEditRegion}
			selectedRegion={selectedRegion}
			selectedRegionID={selectedRegionID}
			updateRegionsList={updateRegionsList}
		/>,
	);

	const nameInput = getByLabelText("Region Name");
	const descriptionInput = getByLabelText("Description");
	const saveButton = getByText("Save");

	fireEvent.change(nameInput, {
		target: { value: "Updated Name" },
	});

	fireEvent.change(descriptionInput, {
		target: { value: "Updated Description" },
	});
	fireEvent.click(saveButton);

	await waitFor(() => {
		expect(axios.put).toHaveBeenCalledWith(
			"http://localhost:3000/regions/123",
			{ name: "Updated Name", description: "Updated Description" },
		);
		expect(updateRegionsList).toHaveBeenCalled();
		expect(setEditRegion).toHaveBeenCalledWith(false);
	});
});
