import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ViewProjectile from "../src/components/Projectile.jsx";

describe("Projectile", () => {
	it("renders view projectile point modal correctly", () => {
		render(<ViewProjectile />);

		expect(
			screen.getByRole("heading", {
				name: /description/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", {
				name: /dimensions/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", {
				name: /location/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", {
				name: /artifact type/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", {
				name: /period/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", {
				name: /culture/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", {
				name: /base shape/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", {
				name: /cross section/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", {
				name: /blade shape/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", {
				name: /hafting shape/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", {
				name: /close/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", {
				name: /delete/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", {
				name: /edit/i,
			}),
		).toBeInTheDocument();
	});
});
