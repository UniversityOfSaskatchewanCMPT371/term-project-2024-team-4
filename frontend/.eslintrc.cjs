module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:react/jsx-runtime",
		"plugin:react-hooks/recommended",
		"prettier",
	],
	ignorePatterns: ["dist", ".eslintrc.cjs", "test-report"],
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	settings: {
		react: {
			version: "18.2",
		},
	},
	plugins: ["react-refresh"],
	rules: {
		"react-refresh/only-export-components": [
			"warn",
			{ allowConstantExport: true },
		],
		indent: ["error", "tab"],
		"linebreak-style": 0,
		quotes: ["error", "double"],
		semi: ["error", "always"],
	},
	overrides: [
		{
			files: [
				"test/**/*.js",
				"**/*.test.js",
				"**/*.spec.js",
				"test/**/*.jsx",
				"**/*.test.jsx",
			],
			env: {
				"vitest-globals/env": true,
			},
			extends: [
				"plugin:vitest-globals/recommended",
				"prettier",
				"eslint-config-prettier",
			],
			rules: {
				"no-unused-expressions": "off",
				"react/prop-types": "off",
			},
		},
	],
};
