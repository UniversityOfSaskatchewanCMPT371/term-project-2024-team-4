const { logger, morganIntegration } = require("../../config/logger");

/**
 * Unit test suite for multi-level logging in the backend
 */

let capturedLogContent;
let mockReq, mockRes, mockNext;
// must mock module outside of `describe`
jest.mock("fs", () => ({
	existsSync: jest.fn().mockReturnValue(false), // mock that the log file does not exist
	readFileSync: jest.fn().mockReturnValue(""),
	unlinkSync: jest.fn(),
	mkdirSync: jest.fn(),
	createWriteStream: jest.fn().mockReturnValue({
		on: jest.fn(),
		end: jest.fn(),
		write: jest.fn((data) => {
			capturedLogContent += data; // capture written data
		}),
	}),
}));

const fs = require("fs");

// test suite to check if backend logging methods transport to console
describe("Logging Methods in Backend Transport to Console", () => {
	let mockReq, mockRes, mockNext;
	let logSpy;

	beforeAll(() => {
		// spy on console to see if logs are brought to console
		logSpy = jest.spyOn(console._stdout, "write");
	});

	afterAll(() => {
		logSpy.mockRestore();
	});

	test("Winston should transport logs to console", () => {
		logger.debug("debug");
		logger.info("info");
		logger.warn("warn");
		logger.error("error");
		logger.fatal("fatal");

		expect(logSpy).toHaveBeenCalledTimes(5);
	});

	test("Morgan should transport logs to console", () => {
		// mock req and res to mock an api endpoint
		mockReq = { method: "GET", url: "/test", headers: {} };
		mockRes = { statusCode: 200 };
		mockNext = jest.fn();

		morganIntegration(mockReq, mockRes, mockNext);
		expect(logSpy).toHaveBeenCalled();
	});
});

// test suite to check if backend logging methods transport to log file
describe("Logging Methods in Backend Transport to Log Files", () => {
	beforeEach(() => {
		capturedLogContent = "";
	});
	afterAll(() => {
		jest.resetModules();
	});

	test("Winston should create a log file to transport to", () => {
		logger.debug("debug log 4");
		logger.info("info log 3");
		logger.warn("warn log 2");
		logger.error("error log 1");
		logger.fatal("fatal log 0");

		// test if a log file is created
		expect(fs.createWriteStream).toHaveBeenCalledWith(
			expect.stringMatching(/\.log$/),
			expect.anything(),
		);

		// test if log file contains proper text
		expect(capturedLogContent).toContain("debug log 4");
		expect(capturedLogContent).toContain("info log 3");
		expect(capturedLogContent).toContain("warn log 2");
		expect(capturedLogContent).toContain("error log 1");
		expect(capturedLogContent).toContain("fatal log 0");
	});

	test("Morgan should transport logs to log files", async () => {
		mockReq = { method: "GET", url: "/test", headers: {} };
		mockRes = { statusCode: 200 };
		mockNext = jest.fn();

		morganIntegration(mockReq, mockRes, mockNext);

		// test if a log file is attempted to write to
		expect(fs.createWriteStream).toHaveBeenCalledWith(
			expect.stringMatching(/\.log$/),
			expect.anything(),
		);
	});
});
