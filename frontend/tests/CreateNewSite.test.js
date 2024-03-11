/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import CreateNewSite from "../components/CreateNewSite";

jest.mock("axios");

describe("CreateNewSite component", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test("renders CreateNewSite component", () => {
		render(<CreateNewSite />);
	});

	test("calls handleClose when Cancel button is clicked", () => {
		const handleCloseMock = jest.fn();
		render(<CreateNewSite setOpen={handleCloseMock} />);
		fireEvent.click(screen.getByText("Cancel"));
		expect(handleCloseMock).toHaveBeenCalled();
	});

	test("calls handleSubmit when Add button is clicked", async () => {
		const handleSubmitMock = jest.fn();
		render(<CreateNewSite setOpen={handleSubmitMock} />);
		fireEvent.click(screen.getByText("Add"));

		await waitFor(() => expect(handleSubmitMock).toHaveBeenCalled());
	});
});
