const request = require("supertest");
const catalogues = require("../../routes/catalogues");
const sites = require("../../routes/sites");
const projectilePoints = require("../../routes/projectilePoints");

describe("Create catalogue test", () => {
	test("Should create a catalogue", async () => {
		return request(catalogues)
			.post("../../routes/catalogues")
			.send({
				name: "Catalogue name",
				description: "Catalogue description",
			})
			.expect(201);
	});
});

describe("Create site test", () => {
	test("Should create a site", async () => {
		return request(sites)
			.post("../../routes/sites")
			.send({
				name: "Site name",
				location: "Site location",
				region: "Site region",
				description: "Site description",
			})
			.expect(201);
	});
});

describe("Search sites test", () => {
	it("should return site names if location exists", async () => {
		const response = await request(sites)
			.get("../../routes/sites/catalougesite/Saskatoon")
			.expect(200);

		// expect to return the array of sites if available
		expect(response.body).toEqual(expect.arrayContaining(["Site A", "Site B"]));
	});

	it("should return Not available if location does not exist", async () => {
		const response = await request(sites)
			.get("../../routes/sites/catalougesite/calgary")
			.expect(200);

		//expect to return Not available if location is not available in the database
		expect(response.text).toBe("Not available");
	});
});

// eslint-disable-next-line no-unused-vars
let projectilePointId = "";

describe("Create projectile point tests", () => {
	// Test Case ID TC11
	test("All valid inputs should create a projectile", async () => {
		return request(projectilePoints)
			.post("../../routes/projectilePoints")
			.send({
				name: "Projectile name",
				location: "Projectile location",
				description: "Projectile description",
				dimensions: "Projectile dimensions",
				photo: "Projectile photo URL",
			})
			.expect(201)
			.then(({ response }) => {
				projectilePointId = response.data.id;
			});
	});

	// Test Case ID TC12
	test("Invalid name should not create a projectile", async () => {
		return request(projectilePoints)
			.post("../../routes/projectilePoints")
			.send({
				name: 17,
				location: "Projectile location",
				description: "Projectile description",
				dimensions: "Projectile dimensions",
				photo: "Projectile photo URL",
			});
	});

	// Test Case ID TC13
	test("Invalid location should not create a projectile", async () => {
		return request(projectilePoints)
			.post("../../routes/projectilePoints")
			.send({
				name: "Projectile name",
				location: true,
				description: "Projectile description",
				dimensions: "Projectile dimensions",
				photo: "Projectile photo URL",
			});
	});

	// Test Case ID TC14
	test("Invalid description should not create a projectile", async () => {
		return request(projectilePoints)
			.post("../../routes/projectilePoints")
			.send({
				name: "Projectile name",
				location: "Projectile location",
				description: 3.5,
				dimensions: "Projectile dimensions",
				photo: "Projectile photo URL",
			});
	});

	// Test Case ID TC15
	test("Invalid dimensions should not create a projectile", async () => {
		return request(projectilePoints)
			.post("../../routes/projectilePoints")
			.send({
				name: "Projectile name",
				location: "Projectile location",
				description: "Projectile description",
				dimensions: false,
				photo: "Projectile photo URL",
			});
	});

	// Test Case ID TC16
	test("Invalid photo URL should not create a projectile", async () => {
		return request(projectilePoints)
			.post("../../routes/projectilePoints")
			.send({
				name: "Projectile name",
				location: "Projectile location",
				description: "Projectile description",
				dimensions: "Projectile dimensions",
				photo: true,
			});
	});
});

describe("Modify a projectile test", () => {
	// Test Case ID TC17
	test("Valid name input should update projectile", async () => {
		return request(projectilePoints)
			.put("../../routes/projectilePoints/${projectilePointId}")
			.send({
				name: "Projectile name update",
				location: "Projectile location update",
				description: "Projectile description update",
				dimensions: "Projectile dimensions update",
				photo: "Projectile photo URL update",
			})
			.expect(201);
	});

	// Test Case ID TC18
	test("Invalid name input should not update projectile", async () => {
		return request(projectilePoints)
			.put("../../routes/projectilePoints/${projectilePointId}")
			.send({
				name: 11,
				location: "Projectile location update",
				description: "Projectile description update",
				dimensions: "Projectile dimensions update",
				photo: "Projectile photo URL update",
			})
			.expect(201);
	});

	// Test Case ID TC19
	test("Valid location input should update projectile", async () => {
		return request(projectilePoints)
			.put("../../routes/projectilePoints/${projectilePointId}")
			.send({
				name: "Projectile name update",
				location: "Projectile location update",
				description: "Projectile description update",
				dimensions: "Projectile dimensions update",
				photo: "Projectile photo URL update",
			})
			.expect(201);
	});

	// Test Case ID TC20
	test("Invalid description input should not update projectile", async () => {
		return request(projectilePoints)
			.put("../../routes/projectilePoints/${projectilePointId}")
			.send({
				name: "Projectile name update",
				location: false,
				description: "Projectile description update",
				dimensions: "Projectile dimensions update",
				photo: "Projectile photo URL update",
			})
			.expect(201);
	});

	// Test Case ID TC21
	test("Invalid description input should not update projectile", async () => {
		return request(projectilePoints)
			.put("../../routes/projectilePoints/${projectilePointId}")
			.send({
				name: "Projectile name update",
				location: "Projectile location update",
				description: "Projectile description update",
				dimensions: "Projectile dimensions update",
				photo: "Projectile photo URL update",
			})
			.expect(201);
	});

	// Test Case ID TC22
	test("Invalid description input should not update projectile", async () => {
		return request(projectilePoints)
			.put("../../routes/projectilePoints/${projectilePointId}")
			.send({
				name: "Projectile name update",
				location: "Projectile location update",
				description: true,
				dimensions: "Projectile dimensions update",
				photo: "Projectile photo URL update",
			})
			.expect(201);
	});

	// Test Case ID TC23
	test("Invalid dimensions input should not update projectile", async () => {
		return request(projectilePoints)
			.put("../../routes/projectilePoints/${projectilePointId}")
			.send({
				name: "Projectile name update",
				location: "Projectile location update",
				description: "Projectile description update",
				dimensions: "Projectile dimensions update",
				photo: "Projectile photo URL update",
			})
			.expect(201);
	});

	// Test Case ID TC24
	test("Invalid dimensions input should not update projectile", async () => {
		return request(projectilePoints)
			.put("../../routes/projectilePoints/${projectilePointId}")
			.send({
				name: "Projectile name update",
				location: "Projectile location update",
				description: "Projectile description update",
				dimensions: 5 * 7,
				photo: "Projectile photo URL update",
			})
			.expect(201);
	});

	// Test Case ID TC25
	test("Invalid photo URL input should not update projectile", async () => {
		return request(projectilePoints)
			.put("../../routes/projectilePoints/${projectilePointId}")
			.send({
				name: "Projectile name update",
				location: "Projectile location update",
				description: "Projectile description update",
				dimensions: "Projectile dimensions update",
				photo: "Projectile photo URL update",
			})
			.expect(201);
	});

	// Test Case ID TC26
	test("Invalid photo URL input should not update projectile", async () => {
		return request(projectilePoints)
			.put("../../routes/projectilePoints/${projectilePointId}")
			.send({
				name: "Projectile name update",
				location: "Projectile location update",
				description: "Projectile description update",
				dimensions: "Projectile dimensions update",
				photo: true,
			})
			.expect(201);
	});
});

// Test Case ID TC27
describe("Delete projectile test", () => {
	test("Should delete a projectile", async () => {
		return request(projectilePoints)
			.delete("../../routes/projectilePoints/${projectilePointId}")
			.expect(410);
	});
});
