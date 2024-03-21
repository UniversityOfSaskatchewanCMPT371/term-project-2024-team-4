import { defineConfig } from "vite";
import baseConfig from "./vite.config";

// Integration Test Configuration File for Vitest
export default defineConfig({
	...baseConfig,
	test: {
		...baseConfig.test,
		reporters: ["html", "verbose"],
		outputFile: "./test-report/integ/integ-tests.html",
		include: ["**/tests/**.integ.test.js", "**/tests/**.integ.test.jsx"],
	},
});
