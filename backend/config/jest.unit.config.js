// Jest Config File for Unit Tests
module.exports = {
	rootDir: "..",
	reporters: [
		"default",
		[
			"jest-html-reporter",
			{
				pageTitle: "Backend Unit Test Report",
				outputPath: "./test-report/unit-test-report.html",
				includeFailureMsg: true,
			},
		],
	],
	testMatch: ["**/tests/**/*.unit.test.js"],
};
