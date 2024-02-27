const request = require("supertest");
const app = require("../../routes/sites");

describe("Site Routes", () => {
	it("should return site names if location exists", async () => {
		const response = await request(app)
			.get("../../routes/sites/catalougesite")
			.expect(200);

		// expect to return the array of sites if available
		expect(response.body).toEqual(expect.arrayContaining(["Site A", "Site B"]));
	});

	it("should return Not available if location does not exist", async () => {
		const response = await request(app)
			.get("../../routes/sites/catalougesite")
			.expect(200);

		//expect to return Not available if location is not available in the database
		expect(response.text).toBe("Not available");
	});
});
