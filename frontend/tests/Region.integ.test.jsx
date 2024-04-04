import { expect, test, vi } from "vitest";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import RegionModal from "../src/components/RegionModal";
import http from "../http";

test("RegionModal renders correctly with every field empty", () => {
	const selectedRegion = { name: "" };
	// Render the RegionModal component
	render(<RegionModal selectedRegion={selectedRegion} />);

	// Find input fields
	const regionInput = screen.getByLabelText("Region Name");
	const descriptionInput = screen.getByLabelText("Description");

	// make sure input field is empty
	expect(regionInput.value).toBe("");
	expect(descriptionInput.value).toBe("");
});

test("should edit region on button click", async () => {
	const selectedRegion = { name: "Existing Region" };
	const selectedRegionID = "123";

	// Mocking setEditRegion and updateRegionsList functions
	const setEditRegion = vi.fn();
	const updateRegionsList = vi.fn();
	const setSelectedRegion = vi.fn();

	// Mocking http.put
	vi.spyOn(http, "put").mockResolvedValue({});

	const { getByLabelText, getByText } = render(
		<RegionModal
			setEditRegion={setEditRegion}
			selectedRegion={selectedRegion}
			selectedRegionID={selectedRegionID}
			updateRegionsList={updateRegionsList}
			setSelectedRegion={setSelectedRegion}
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
		expect(http.put).toHaveBeenCalledWith("/regions/123", {
			name: "Updated Name",
			description: "Updated Description",
		});
		expect(updateRegionsList).toHaveBeenCalled();
		expect(setEditRegion).toHaveBeenCalledWith(false);
	});
});
