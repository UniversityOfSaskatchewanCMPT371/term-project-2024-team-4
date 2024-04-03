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
		expect(screen.getByTestId("FolderCopyIcon")).toBeInTheDocument();
		expect(screen.getByText(/data management/i)).toBeInTheDocument();
		expect(screen.getByTestId("RoomPreferencesIcon")).toBeInTheDocument();
		expect(screen.getByText(/settings/i)).toBeInTheDocument();
		expect(screen.getByTestId("LoginIcon")).toBeInTheDocument();
		expect(screen.getByText(/login/i)).toBeInTheDocument();
	});
});
