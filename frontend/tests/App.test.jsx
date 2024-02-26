import { screen, render, fireEvent } from "@testing-library/react";
import Sidebar from "../src/components/Sidebar.jsx";

/* RUN 'npx vitest' in terminal to run unit tests */

test("Render Sidebar component correctly", () => {
	render(<Sidebar />);

	// Test if title is present on Sidebar
	const titleElement = screen.getByText("Projectile");
	expect(titleElement).toBeInTheDocument();

	// Test if Home nav link is present on Sidebar
	const homeNav = screen.getByText("Home");
	expect(homeNav).toBeInTheDocument();

	// Test if Connect nav link is present on Sidebar
	const connectNav = screen.getByText("Connect");
	expect(connectNav).toBeInTheDocument();

	// Test if Statistics nav link is present on Sidebar
	const statisticsNav = screen.getByText("Statistics");
	expect(statisticsNav).toBeInTheDocument();

	// Test if Data Management nav link is present on Sidebar
	const dataManagementNav = screen.getByText("Data Management");
	expect(dataManagementNav).toBeInTheDocument();

	// Test if Settings nav link is present on Sidebar
	const settingsNav = screen.getByText("Settings");
	expect(settingsNav).toBeInTheDocument();

	// Test if Login nav link is present on Sidebar
	const loginNav = screen.getByText("Login");
	expect(loginNav).toBeInTheDocument();
});

test("Render LoginModal component correctly", async () => {
	render(<Sidebar />);

	// Click on the Login Sidebar button to open the LoginModal
	await fireEvent.click(screen.getByText("Login"));

	// Check if username field is present in modal
	const usernameField = await screen.getByPlaceholderText("Username");
	expect(usernameField).toBeInTheDocument();

	// Check if password field is present in modal
	const passwordField = await screen.getByPlaceholderText("Password");
	expect(passwordField).toBeInTheDocument();
});
