import { expect, afterEach, vi, beforeAll, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import "@testing-library/jest-dom";
import http from "../http";
import log from "../src/logger";
http.defaults.adapter = "http";

expect.extend(matchers);

Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(), // deprecated
		removeListener: vi.fn(), // deprecated
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

// perform cleanup after each tests
afterEach(() => {
	cleanup();
});

// login before ALL tests
beforeAll(async () => {
	try {
		const response = await http.post("/users", {
			userName: import.meta.env.VITE_TEST_USERNAME,
			password: import.meta.env.VITE_TEST_PASSWORD,
		});
		const token = response.data.token;
		http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	} catch (error) {
		log.error("Login failed in test setup:", error);
		throw error;
	}
});

afterAll(async () => {
	try {
		await http.post("/users/logout");
		delete http.defaults.headers.common["Authorization"];
	} catch (error) {
		log.error("Logout failed in test teardown:", error);
	}
});
