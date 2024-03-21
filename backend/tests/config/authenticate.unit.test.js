/**
 * Unit Tests for the Admin Authentication Middleware (config/authenticate.js)
 */

const jwt = require("jsonwebtoken");
const authenticateAdmin = require("../../middleware/authenticate");
require("dotenv").config();

describe("Admin Authentication Middleware Test ", () => {
	let next; // mock to check succesful authentications
	const secret = process.env.JWT_SECRET; // uses actual JWT_SECRET
	const validToken = jwt.sign({ id: 1, userName: "admin" }, secret);

	beforeEach(() => {
		next = jest.fn();
	});

	// 1. Cookie Token is not valid; expect response: 401 & json + should not move on to next()
	test("fails if user has an invalid cookie token", () => {
		// Mock req
		const req = {
			cookies: { token: "invalid_cookie_token" },
			header: jest.fn().mockReturnValue(undefined),
		};

		// Mock res
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		};

		authenticateAdmin(req, res, next);

		// expect response: 401 & json + should not move on to next()
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalled();
		expect(next).not.toHaveBeenCalled();
	});

	// 2. Header Token is not valid; expect response: 401 & json + should not move on to next()
	test("fails if user has an invalid header token", () => {
		// Mock req
		const req = {
			cookies: {},
			header: jest.fn().mockReturnValue("Bearer invalid_header_token"),
		};

		// Mock res
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		};

		authenticateAdmin(req, res, next);

		// expect response: 401 & json + should not move on to next()
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalled();
		expect(next).not.toHaveBeenCalled();
	});

	// 3. No token provided at all; expect response: 401 & json + should not move on to next()
	test("fails if user has no token at all", () => {
		// Mock req
		const req = {
			cookies: {},
			header: jest.fn().mockReturnValue(undefined),
		};

		// Mock res
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		};

		authenticateAdmin(req, res, next);

		// expect response: 401 & json + should not move on to next()
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalled();
		expect(next).not.toHaveBeenCalled();
	});

	// 4. Token is valid; expect to move onto next();
	test("passes and moves to next middleware if token is valid", () => {
		// Mock req
		const req = {
			cookies: { token: validToken }, // Using a valid token in cookies
			header: jest.fn().mockReturnValue(`Bearer ${validToken}`), // Also providing a valid token in header for completeness
		};

		// Mock res
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		};

		authenticateAdmin(req, res, next);

		// expect no status response + move on to next middleware/admin-only action
		expect(res.status).not.toHaveBeenCalled();
		expect(next).toHaveBeenCalled();
	});
});
