import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Sidebar from "../src/components/Sidebar.jsx";
import { MemoryRouter } from "react-router-dom";

describe("LoginModal", () => {
	it("renders correctly", () => {
		render(
			<MemoryRouter>
				<Sidebar />
			</MemoryRouter>,
		);

		fireEvent.click(screen.getByText("Login"));

		expect(
			screen.getByRole("heading", {
				name: /Login/i,
			}),
		).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
		expect(
			screen.getByRole("button", {
				name: /cancel/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", {
				name: /login/i,
			}),
		).toBeInTheDocument();
	});
});
