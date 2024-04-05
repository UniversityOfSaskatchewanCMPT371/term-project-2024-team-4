import { vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import PeriodModal from "../src/components/PeriodModal";

describe("PeriodModal", () => {
	
	it("calls handleSave when save button is clicked", () => {
		const props = {
			setEditPeriod: vi.fn(),
			selectedPeriod: "",
			selectedPeriodStartDate: "",
			selectedPeriodEndDate: "",
			selectedPeriodID: "",
			updatePeriodsList: vi.fn(),
		};

		const { getByText } = render(<PeriodModal {...props} />);
		const saveButton = getByText("Save");
		fireEvent.click(saveButton);
		expect(props.updatePeriodsList).not.toHaveBeenCalled();
	});
});
