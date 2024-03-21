import { defineConfig } from "vite";
import baseConfig from "./vite.config";

// Unit Test Configuration File for Vitest
export default defineConfig({
	...baseConfig,
	test: {
		...baseConfig.test,
		reporters: ["html", "verbose"],
		outputFile: "./test-report/unit/unit-tests.html",
		include: ["**/tests/**.unit.test.js", "**/tests/**.unit.test.jsx"],
	},
});
