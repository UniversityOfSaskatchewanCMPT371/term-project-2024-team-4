import logger from "../src/logger";
import { it, describe, expect, beforeAll, afterAll, vi } from "vitest";

describe("Logging Methods in Frontend", () => {
	let logSpy, errSpy;

	beforeAll(() => {
		// spy on console to see if logs are brought to console
		logSpy = vi.spyOn(console._stdout, "write");
		errSpy = vi.spyOn(console._stderr, "write");
	});

	afterAll(() => {
		logSpy.mockReset();
		errSpy.mockReset();
	});
	it("loglevel should transport logs to console", () => {
		logger.info("text");
		logger.warn("text");
		logger.error("text");

		expect(logSpy).toHaveBeenCalledTimes(1);
		expect(errSpy).toHaveBeenCalledTimes(2);
	});
});
