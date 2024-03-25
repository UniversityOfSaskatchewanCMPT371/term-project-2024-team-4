// Jest Config File for Integration Tests
module.exports = {
	rootDir: "..",
	reporters: [
		"default",
		[
			"jest-html-reporter",
			{
				pageTitle: "Integration Unit Test Report",
				outputPath: "./test-report/integ-test-report.html",
				includeFailureMsg: true,
			},
		],
	],
	testMatch: ["**/tests/**/*.integ.test.js"],
};
