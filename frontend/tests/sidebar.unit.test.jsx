import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Sidebar from "../src/components/Sidebar.jsx";
import { MemoryRouter } from "react-router-dom";

describe("Sidebar", () => {
	it("renders correctly", () => {
		render(
			<MemoryRouter>
				<Sidebar />
			</MemoryRouter>,
		);

		expect(screen.getByText(/pcubed/i)).toBeInTheDocument();
		expect(screen.getByTestId("HomeIcon")).toBeInTheDocument();
		expect(screen.getByText(/catalogue/i)).toBeInTheDocument();
		expect(screen.getByTestId("UploadIcon")).toBeInTheDocument();
		expect(screen.getByText(/connect/i)).toBeInTheDocument();
		expect(screen.getByTestId("BarChartIcon")).toBeInTheDocument();
		expect(screen.getByText(/statistics/i)).toBeInTheDocument();
		expect(screen.getAllByTestId("FolderCopyIcon")).toBeTruthy();
		expect(screen.getByText(/cultures management/i)).toBeInTheDocument();
		expect(screen.getByText(/periods management/i)).toBeInTheDocument();
		expect(screen.getByText(/materials management/i)).toBeInTheDocument();
		// expect(screen.getByTestId("RoomPreferencesIcon")).toBeInTheDocument(); (cannot be seen by normal users)
		// expect(screen.getByText(/settings/i)).toBeInTheDocument(); (cannot be seen by normal users)
		expect(screen.getByTestId("LoginIcon")).toBeInTheDocument();
		expect(screen.getByText(/login/i)).toBeInTheDocument();
	});
});
