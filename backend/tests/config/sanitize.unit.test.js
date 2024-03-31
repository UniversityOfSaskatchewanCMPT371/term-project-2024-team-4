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
app.post("/nameOnly", nameValidationRules(), validate, (req, res) =>
	res.status(200).json({ message: "OK" }),
);
app.post("/nameDescOnly", nameDescValidationRules(), validate, (req, res) =>
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

	// Tests for Sites API
	describe("Sites Sanitization & Validation", () => {
		test("should reject if name is not included", async () => {
			const response = await request(app).post("/site").send({
				name: "",
				description: "description",
				location: "location",
			});
			expect(response.statusCode).toBe(422);
		});

		test("should accept valid name with empty description/location", async () => {
			const response = await request(app).post("/site").send({
				name: "name",
				description: "",
				location: "",
			});
			expect(response.statusCode).toBe(200);
		});

		test("should accept if all fields are valid", async () => {
			const response = await request(app).post("/site").send({
				name: "Name",
				description: "descriptionTest",
				location: "Location",
			});
			expect(response.statusCode).toBe(200);
		});
	});

	// Tests for Artifact API
	describe("Artifact Sanitization & Validation", () => {
		test("should reject if name is not included", async () => {
			const response = await request(app).post("/artifact").send({
				name: "",
				description: "desc",
				location: "",
				dimensions: "",
				photo: "",
			});

			expect(response.statusCode).toBe(422);
		});

		test("should accept even if fields other than name are not included", async () => {
			const response = await request(app).post("/artifact").send({
				name: "Name",
				description: "",
				location: "",
				dimensions: "",
				photo: "",
			});
			expect(response.statusCode).toBe(200);
		});

		test("should accept if all fields are valid", async () => {
			const response = await request(app).post("/artifact").send({
				name: "Name",
				description: "Desc",
				location: "Loc",
				dimensions: "Dim",
				photo: "Phot",
			});
			expect(response.statusCode).toBe(200);
		});
	});
	// Tests for Period API
	describe("Period Sanitization & Validation", () => {
		test("should reject if name is not included", async () => {
			const response = await request(app).post("/period").send({
				name: "",
			});

			expect(response.statusCode).toBe(422);
		});

		test("should reject if start > end date", async () => {
			const response = await request(app).post("/period").send({
				name: "test",
				start: "1990",
				end: "1985",
			});

			expect(response.statusCode).toBe(422);
		});

		test("should accept if all fields valid", async () => {
			const response = await request(app).post("/period").send({
				name: "Name",
				start: "1990",
				end: "1995",
			});

			expect(response.statusCode).toBe(200);
		});
	});

	// Tests for name-only needed APIs
	describe("Name-Only Sanitization & Validation", () => {
		test("should reject if name is not included", async () => {
			const response = await request(app).post("/nameOnly").send({
				name: "",
			});

			expect(response.statusCode).toBe(422);
		});

		test("should accept if all fields valid", async () => {
			const response = await request(app).post("/nameOnly").send({
				name: "Name",
			});

			expect(response.statusCode).toBe(200);
		});
	});

	// Tests for name & desc only needed APIs
	describe("Name & Desc Only Sanitization & Validation", () => {
		test("should reject if name is not included", async () => {
			const response = await request(app).post("/nameDescOnly").send({
				name: "",
				description: "Desc",
			});

			expect(response.statusCode).toBe(422);
		});

		test("should accept even if description is empty", async () => {
			const response = await request(app).post("/nameDescOnly").send({
				name: "Name",
				description: "",
			});

			expect(response.statusCode).toBe(200);
		});

		test("should accept if all fields valid", async () => {
			const response = await request(app).post("/nameDescOnly").send({
				name: "Name",
				description: "Desc",
			});

			expect(response.statusCode).toBe(200);
		});
	});
});
