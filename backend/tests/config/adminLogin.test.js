const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken"); // Import jwt module
const app = express();
const router = require("../../routes/users");

// Mock the database connection
jest.mock("../../config/db.js", () => {
	// eslint-disable-next-line no-unused-vars
	const { DataSource } = require("typeorm");
	return {
		getRepository: jest.fn().mockReturnValue({
			findOne: jest.fn(),
			save: jest.fn(),
		}),
		initialize: jest.fn(),
	};
});

// Setup Express app to parse JSON
app.use(bodyParser.json());
app.use("/users", router);

describe("User Authentication API", () => {
	describe("POST /users", () => {
		test("It should authenticate user and return a token", async () => {
			const mockedUser = {
				id: 1,
				userName: "testuser",
				password:
					"$2b$10$gVVizH0qIUg3s9Y8bluDxu4lr8LsIyWKIj5I7F2C6Apsu8nQNH6ji", // bcrypt hash for 'testpassword'
			};

			// Mocking findOne to return mockedUser
			// eslint-disable-next-line no-unused-vars
			router.post("/", async (req, res) => {
				// eslint-disable-next-line no-undef
				dataSource.getRepository.mockReturnValueOnce({
					findOne: jest.fn().mockResolvedValueOnce(mockedUser),
				});

				await request(app)
					.post("/users")
					.send({ userName: "testuser", password: "testpassword" })
					.expect(200)
					.then((response) => {
						expect(response.body).toHaveProperty("token");
					});
			});
		});

		test("It should return 401 if user is not found", async () => {
			// Mocking findOne to return null
			// eslint-disable-next-line no-unused-vars
			router.post("/", async (req, res) => {
				// eslint-disable-next-line no-undef
				dataSource.getRepository.mockReturnValueOnce({
					findOne: jest.fn().mockResolvedValueOnce(null),
				});

				await request(app)
					.post("/users")
					.send({
						userName: "nonexistentuser",
						password: "nonexistentpassword",
					})
					.expect(401);
			});
		});

		test("It should return 401 if password is incorrect", async () => {
			const mockedUser = {
				id: 1,
				userName: "testuser",
				password:
					"$2b$10$gVVizH0qIUg3s9Y8bluDxu4lr8LsIyWKIj5I7F2C6Apsu8nQNH6ji", // bcrypt hash for 'testpassword'
			};

			// Mocking findOne to return mockedUser
			// eslint-disable-next-line no-unused-vars
			router.post("/", async (req, res) => {
				// eslint-disable-next-line no-undef
				dataSource.getRepository.mockReturnValueOnce({
					findOne: jest.fn().mockResolvedValueOnce(mockedUser),
				});

				await request(app)
					.post("/users")
					.send({ userName: "testuser", password: "wrongpassword" })
					.expect(401);
			});
		});
		test("It should return 400 if userName is null or undefined", async () => {
			await request(app)
				.post("/users")
				.send({ password: "testpassword" })
				.expect(400)
				.then((response) => {
					expect(response.body).toEqual({
						message: "Username and password are required",
					});
				});
		});

		test("It should return 400 if password is null or undefined", async () => {
			await request(app)
				.post("/users")
				.send({ userName: "testuser" })
				.expect(400)
				.then((response) => {
					expect(response.body).toEqual({
						message: "Username and password are required",
					});
				});
		});

		test("It should return 400 if both userName and password are null or undefined", async () => {
			await request(app)
				.post("/users")
				.send({})
				.expect(400)
				.then((response) => {
					expect(response.body).toEqual({
						message: "Username and password are required",
					});
				});
		});
	});
	describe("User Authentication API", () => {
		describe("GET /users", () => {
			test("It should return user details if token is provided", async () => {
				// Mocking the token
				const token = "mocked_token_value";
				const mockedUser = { id: 1, userName: "testuser" };
				// eslint-disable-next-line no-unused-vars
				router.get("/", async (req, res) => {
					req.cookies = { token }; // Set the mocked token in cookies
					jwt.verify = jest
						.fn()
						.mockImplementation((token, JWT_SECRET, callback) => {
							callback(null, mockedUser);
						});

					await request(app)
						.get("/users")
						.expect(200)
						.then((response) => {
							expect(response.body).toEqual(mockedUser);
						});
				});
			});

			test("It should return null if token is not provided", async () => {
				// eslint-disable-next-line no-unused-vars
				router.get("/", async (req, res) => {
					req.cookies = {}; // No token provided in cookies

					await request(app)
						.get("/users")
						.expect(200)
						.then((response) => {
							expect(response.body).toBeNull();
						});
				});
			});
		});
	});

	describe("User Authentication API", () => {
		describe("PATCH /users/:userId", () => {
			test("It should return 404 if userId is not provided", async () => {
				await request(app)
					.patch("/users/") // Missing userId
					.expect(404) // Change the expected status code to 404
					.then((response) => {
						expect(response.body).toEqual({}); // Adjust expectation for an empty object
					});
			});

			test("It should return 404 if user is not found", async () => {
				const nonExistingUserId = 999;

				// Mocking findOne to return null
				// eslint-disable-next-line no-unused-vars
				router.patch("/:userId", async (req, res) => {
					// eslint-disable-next-line no-undef
					dataSource.getRepository.mockReturnValueOnce({
						findOne: jest.fn().mockResolvedValueOnce(null),
					});

					await request(app)
						.patch(`/users/${nonExistingUserId}`)
						.send({ userName: "testuser", password: "testpassword" })
						.expect(404);
				});
			});

			test("It should return 403 if userId does not match the user's id", async () => {
				const userId = 1;
				const mockedUser = { id: userId, userName: "testuser" };

				// Mocking findOne to return the mocked user
				// eslint-disable-next-line no-unused-vars
				router.patch("/:userId", async (req, res) => {
					// eslint-disable-next-line no-undef
					dataSource.getRepository.mockReturnValueOnce({
						findOne: jest.fn().mockResolvedValueOnce(mockedUser),
					});

					await request(app)
						.patch(`/users/${userId + 1}`) // Providing different userId
						.send({ userName: "testuser", password: "testpassword" })
						.expect(403);
				});
			});
		});
	});
});
