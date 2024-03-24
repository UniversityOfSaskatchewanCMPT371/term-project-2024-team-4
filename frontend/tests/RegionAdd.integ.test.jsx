import { test, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import SiteModal from "../src/components/SiteModal";
import http from "../http";

test("should add a region on button click", async () => {
	// Mocking http.post
	vi.spyOn(http, "post").mockResolvedValue({});

	const { getByLabelText } = render(<SiteModal setOpen={vi.fn()} />);

	// Find the "Region" input field
	const regionInput = getByLabelText("Region");

	// Click on the "Region" input field to open the menu
	fireEvent.click(regionInput);

	// Wait for the API call to be made and assertions to pass
	// await waitFor(() => {
	//   expect(http.post).toHaveBeenCalledWith(
	//     "http://localhost:3000/regions",
	//     { name: AddedRegion, description: AddedRegionDescription }
	//   );
	//   expect(updateRegionsList).toHaveBeenCalled();
	//   expect(setEditRegion).toHaveBeenCalledWith(false);
	// });

	// Find the menu item with the text "+ Add New Region" and click it
	// const addNewRegionMenuItem = getByLabelText("+ Add New Region", { selector: "MenuItem" });
	// const addNewRegionMenuItem = screen.getByText('');
	// fireEvent.click(addNewRegionMenuItem);

	// // Find the input fields and save button in the modal
	// const nameInput = getByLabelText("Region Name");
	// const descriptionInput = getByLabelText("Description");
	// const saveButton = getByText("Save");

	// // Fill out the input fields
	// fireEvent.change(nameInput, {
	//   target: { value: AddedRegion },
	// });

	// fireEvent.change(descriptionInput, {
	//   target: { value: AddedRegionDescription },
	// });

	// // Click the save button
	// fireEvent.click(saveButton);

	// // Wait for the API call to be made and assertions to pass
	// await waitFor(() => {
	//   expect(http.post).toHaveBeenCalledWith(
	//     "http://localhost:3000/regions",
	//     { name: AddedRegion, description: AddedRegionDescription }
	//   );
	//   expect(updateRegionsList).toHaveBeenCalled();
	//   expect(setEditRegion).toHaveBeenCalledWith(false);
	// });
});
