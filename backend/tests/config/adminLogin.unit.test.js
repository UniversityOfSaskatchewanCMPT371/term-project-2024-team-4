const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const dataSource = require("../../config/db");
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
const router = require("../../routes/users");
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

		test("It should return 422 if user is not found", async () => {
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
					.expect(422);
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
	});
});
