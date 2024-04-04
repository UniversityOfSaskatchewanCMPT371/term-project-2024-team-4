/**
 * Unit Tests for the Admin Authentication Middleware (config/authenticate.js)
 */
const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const authenticateAdmin = require("../../middleware/authenticate");
const dataSource = require("../../config/db");

// mock import
jest.mock("../../config/db");

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
	req.cookies = req.cookies || {};
	next();
});

// supertest endpoint to simulate middleware
app.post("/api", authenticateAdmin, (req, res) => {
	res.status(200).send("Success");
});

// test vars
const validUserId = "user123";
const invalidUserId = "invalid123";
const userPayload = {
	id: validUserId,
	userName: "testUser",
	role: "admin",
};

beforeEach(() => {
	// mock for when middleware is searching the database for a user
	const Users = {
		findOneBy: jest.fn((query) => {
			if (query.id === validUserId) return Promise.resolve(userPayload);
			else return Promise.resolve(null);
		}),
	};
	dataSource.getRepository.mockReturnValue(Users);
});

const secret = process.env.JWT_SECRET; // using real token

describe("Admin Authentication Middleware Test", () => {
	// 1. Cookie Token is not valid; expect response: 401
	test("fails if user has an invalid cookie token", async () => {
		const token = jwt.sign({ id: validUserId }, "wrong_secret");
		await request(app).post("/api").set("Cookie", `token=${token}`).expect(401);
	});

	// 2. Header Token is not valid; expect response: 401
	test("fails if user has an invalid header token", async () => {
		const token = jwt.sign({ id: validUserId }, "wrong_secret");
		await request(app)
			.post("/api")
			.set("Authorization", `Bearer ${token}`)
			.expect(401);
	});

	// 3. No token provided at all; expect response: 401
	test("fails if user has no token at all", async () => {
		await request(app).post("/api").expect(401);
	});

	// 4. Token is valid, but user id is NOT associated with a user in db; expect response: 404
	test("fails if token is valid BUT is not associated with a user in the database", async () => {
		const token = jwt.sign({ id: invalidUserId }, secret);
		await request(app)
			.post("/api")
			.set("Authorization", `Bearer ${token}`)
			.expect(404);
	});

	// 5. Token is valid and is associated with an existing user in the database; move towards API call (expect 200 response)
	test("passes and moves past towards the API call (200 response)", async () => {
		const token = jwt.sign({ id: validUserId }, secret);
		await request(app)
			.post("/api")
			.set("Authorization", `Bearer ${token}`)
			.expect(200);
	});
});
