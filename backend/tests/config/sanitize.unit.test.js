/**
Unit tests for sanitization & validation middleware
*/

const request = require("supertest");
const express = require("express");

const {
	loginValidationRules,
	registerValidationRules,
	siteValidationRules,
	artifactValidationRules,
	periodValidationRules,
	nameValidationRules,
	nameDescValidationRules,
	validate,
} = require("../../middleware/sanitize");

const app = express();
app.use(express.json());

// Mock Endpoints
app.post("/login", loginValidationRules(), validate, (req, res) =>
	res.status(200).json({ message: "OK" }),
);
app.post("/register", registerValidationRules(), validate, (req, res) =>
	res.status(200).json({ message: "OK" }),
);
app.post("/site", siteValidationRules(), validate, (req, res) =>
	res.status(200).json({ message: "OK" }),
);
app.post("/artifact", artifactValidationRules(), validate, (req, res) =>
	res.status(200).json({ message: "OK" }),
);
app.post("/period", periodValidationRules(), validate, (req, res) =>
	res.status(200).json({ message: "OK" }),
);

// All tests are for sanitization & validation checks
describe("Sanitization and Validation Checks", () => {
	// Tests for Login API
	describe("Login Sanitization & Validation", () => {
		test("should reject malicious XSS symbols login request", async () => {
			const response = await request(app).post("/login").send({
				userName: "<script>alert('xss');</script>",
				password: "<img src=x onerror=alert('xss')>",
			});
			// should return error response because of invalid symbols
			expect(response.statusCode).toBe(422);
		});

		test("should reject malicious SQL login request", async () => {
			const response = await request(app).post("/login").send({
				userName: "admin' --",
				password: "' OR '1'='1",
			});
			// should return error response because of invalid symbols
			expect(response.statusCode).toBe(422);
		});

		test("should accept a valid login request", async () => {
			const response = await request(app).post("/login").send({
				userName: "admin.123!",
				password: "stRnGpaSs!#",
			});
			// should return error response because of invalid symbols
			expect(response.statusCode).toBe(200);
		});
	});

	// Tests for Registration API
	describe("Registration Sanitization & Validation", () => {
		test("should reject malicious XSS symbols registration request", async () => {
			const response = await request(app).post("/register").send({
				userName: "<script>alert('xss');</script>",
				password: "<img src=x onerror=alert('xss')>",
			});
			// should return error response because of invalid symbols
			expect(response.statusCode).toBe(422);
		});

		test("should reject malicious SQL registration request", async () => {
			const response = await request(app).post("/register").send({
				userName: "admin' --",
				password: "' OR '1'='1",
			});
			// should return error response because of invalid symbols
			expect(response.statusCode).toBe(422);
		});

		test("should reject weak passwords registration request", async () => {
			const response = await request(app).post("/register").send({
				userName: "admin",
				password: "admin",
			});

			// should return error response because of invalid symbols
			expect(response.statusCode).toBe(422);
		});

		test("should accept valid username and password registrations", async () => {
			const response = await request(app).post("/register").send({
				userName: "admin",
				password: "pAsS!.",
			});

			// should return error response because of invalid symbols
			expect(response.statusCode).toBe(422);
		});
	});
});
