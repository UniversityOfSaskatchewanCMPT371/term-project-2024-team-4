import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Catalogue from "../src/components/Catalogue.jsx";
import { MemoryRouter } from "react-router-dom";

describe("Site", () => {
	it("renders correctly", () => {
		render(
			<MemoryRouter>
				<Catalogue />
			</MemoryRouter>,
		);

		// Search bar
		expect(screen.getByText(/search/i)).toBeInTheDocument();
		expect(
			screen.getByRole("textbox", {
				name: /search/i,
			}),
		).toBeInTheDocument();

		// Sort combobox
		expect(screen.getByText(/sort/i)).toBeInTheDocument();
		expect(
			screen.getByRole("combobox", {
				name: /sort/i,
			}),
		).toBeInTheDocument();

		// Filter combobox - Not implemented/not needed
		/*
		expect(screen.getByText(/search/i)).toBeInTheDocument();
		expect(
			screen.getByRole("combobox", {
				name: /filter/i,
			}),
		).toBeInTheDocument();
		*/
	});
});
