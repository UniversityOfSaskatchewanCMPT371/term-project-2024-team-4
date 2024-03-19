import { vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import PeriodModal from "../src/components/PeriodModal";

describe("PeriodModal", () => {
	it("renders correctly", () => {
		const props = {
			setEditPeriod: vi.fn(),
			selectedPeriod: "",
			selectedPeriodStartDate: "",
			selectedPeriodEndDate: "",
			selectedPeriodID: "",
			updatePeriodsList: vi.fn(),
		};

		const { getByLabelText, getByText } = render(<PeriodModal {...props} />);

		expect(getByLabelText("Period Name")).toBeInTheDocument();
		expect(getByLabelText("Start Year")).toBeInTheDocument();
		expect(getByLabelText("End Year")).toBeInTheDocument();
		expect(getByText("Save")).toBeInTheDocument();
	});

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
