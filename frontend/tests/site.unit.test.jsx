import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Site from "../src/components/Site.jsx";

describe("Site", () => {
	it("renders correctly", () => {
		render(<Site />);

		// Sidebar
		expect(screen.getByText(/pcubed/i)).toBeInTheDocument();
		expect(screen.getByTestId("HomeIcon")).toBeInTheDocument();
		expect(screen.getByText(/home/i)).toBeInTheDocument();
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

		// Search bar
		expect(
			screen.getByRole("textbox", {
				name: /search/i,
			}),
		).toBeInTheDocument();

		// Sort combobox
		expect(
			screen.getByRole("combobox", {
				name: /sort/i,
			}),
		).toBeInTheDocument();

		// Filter comboboc
		expect(
			screen.getByRole("combobox", {
				name: /filter/i,
			}),
		).toBeInTheDocument();
	});
});
