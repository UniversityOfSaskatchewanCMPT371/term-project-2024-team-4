import { render, fireEvent } from "@testing-library/react";
import CultureModal from "../src/components/CultureModal";
import { vi } from "vitest";

describe("CultureModal", () => {

	it("calls handleSave when save button is clicked", () => {
		const props = {
			setEditCulture: vi.fn(),
			selectedCulture: "",
			selectedCultureID: "",
			updateCulturesList: vi.fn(),
			periods: [
				{ id: "1", name: "Period 1" },
				{ id: "2", name: "Period 2" },
			],
		};

		const { getByText } = render(<CultureModal {...props} />);
		const saveButton = getByText("Save");
		fireEvent.click(saveButton);
		expect(props.updateCulturesList).not.toHaveBeenCalled();
	});

	//   it('alerts the user if no period is selected', () => {
	//     const props = {
	//       setEditCulture: vi.fn(),
	//       selectedCulture: '',
	//       selectedCultureID: '',
	//       updateCulturesList: vi.fn(),
	//       periods: [{ id: '1', name: 'Period 1' }, { id: '2', name: 'Period 2' }],
	//     };

	//     const { getByText } = render(<CultureModal {...props} />);
	//     const saveButton = getByText('Save');
	//     fireEvent.click(saveButton);
	//     expect(window.alert).toHaveBeenCalledWith('Please select a period to proceed.');
	//   });

});
