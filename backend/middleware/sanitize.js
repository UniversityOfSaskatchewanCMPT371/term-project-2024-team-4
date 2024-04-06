/**
 * Middleware to sanitize incoming inputs to protect from SQL Injection & XSS Attacks.
 * Uses express-validator
 */

/*
Usage:
// import only the rules you need
const { userValidationRules, validate } = require('here');

// usage in an API
router.post('api', userValidationRules(), validate, (req, res) => {})

*/

// import modules
const { body, validationResult } = require("express-validator");
const { logger } = require("../config/logger");
const assert = require("assert");

/* Define all Validation and Sanitization Rules */
// Note: escape() will change symbols into HTML
// Trim and Escape to avoid SQL Injection Attacks
// Limiting input length to mitigate buffer overflow attacks
// Check for allowed symbols to ensure input quality & avoid harmful symbols

/**
 * Validation rules for user login
 * @precond request body needs to contain `userName` and `password` fields
 */
const loginValidationRules = () => {
	return [
		// Note: Cannot include `escape` because it will interfere with symbol usage in crednetials
		// sanitize and validate password
		body("userName")
			.trim()
			.customSanitizer((value) => value.substring(0, 15))
			.matches(/^[a-zA-Z0-9!@#$%^&*(),.?]+$/)
			.withMessage("Username contains invalid characters"),

		// sanitize and validate password
		body("password")
			.trim()
			.customSanitizer((value) => value.substring(0, 20))
			.matches(/^[a-zA-Z0-9!@#$%^&*(),.?]+$/)
			.withMessage("Password contains invalid characters"),
	];
};

/**
 * Validation rules for changing username (and confirming password)
 * @precond request body needs to contain `newUsername` and `password` fields
 */
const changeUsernameValidationRules = () => {
	return [
		// Validate newUsername
		body("newUsername")
			.trim()
			.isLength({ min: 3, max: 15 })
			.withMessage("Username must be between 3 to 15 characters long")
			.matches(/^[a-zA-Z0-9!@#$%^&*(),.?]+$/)
			.withMessage("Username contains invalid characters"),

		// sanitize password
		body("password")
			.trim()
			.customSanitizer((value) => value.substring(0, 20))
			.matches(/^[a-zA-Z0-9!@#$%^&*(),.?]+$/)
			.withMessage("Password contains invalid characters"),
	];
};

/**
 *
 */
const changePasswordValidationRules = () => {
	return [
		// sanitize password
		body("oldPassword")
			.trim()
			.customSanitizer((value) => value.substring(0, 20))
			.matches(/^[a-zA-Z0-9!@#$%^&*(),.?]+$/)
			.withMessage("Password contains invalid characters"),

		// sanitize and validate the new password
		body("newPassword")
			.trim()
			.isLength({ min: 5, max: 20 })
			.withMessage("Password must be at least 5 characters long")
			.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?]).+$/)
			.withMessage(
				"New Password must include uppercase, lowercase, numbers, and special characters",
			),
	];
};

/**
 * Validation rules for creating a Site
 * @precond request body needs to contain:
 *  name: str, description: str, location: str
 *  foreign-keys: catalogueId, regionId
 */
const siteValidationRules = () => {
	return [
		body("name")
			.trim()
			.escape()
			.isLength({ min: 1 })
			.withMessage("Name is required"),

		body("description")
			.trim()
			.escape()
			.optional({ nullable: true, checkFalsy: true }),

		body("location")
			.trim()
			.escape()
			.optional({ nullable: true, checkFalsy: true }),
	];
};

/**
 * Validation rules for creating an artifact
 * @precond requeset body needs to contain:
 *  description, location, dimensions,
 *  foreign-keys: siteId, artifactTypeId, cultureId, bladeShapeId, baseShapeId, haftingShapeId, crossSectionId
 */
const artifactValidationRules = () => {
	return [
		body("description")
			.trim()
			.escape()
			.optional({ nullable: true, checkFalsy: true }),

		body("location")
			.trim()
			.escape()
			.optional({ nullable: true, checkFalsy: true }),

		body("dimensions")
			.trim()
			.escape()
			.optional({ nullable: true, checkFalsy: true }),
	];
};

/**
 * Validation rules for creating a period
 * @precond request body needs to contain:
 * 	name: str, start & end (dates)
 */
const periodValidationRules = () => {
	return [
		body("name")
			.trim()
			.escape()
			.isLength({ min: 1 })
			.withMessage("Name is required"),

		body("start")
			.isInt({ min: 0 })
			.withMessage("Start year is required and must be a valid year"),

		body("end")
			.isInt({ min: 0 })
			.withMessage("End year is required and must be a valid year"),

		// check if start year is before end year
		body().custom((values, { req }) => {
			const { start, end } = req.body;
			if (parseInt(start) > parseInt(end)) {
				throw new Error("Start year must be before end year");
			}
			return true;
		}),
	];
};

/**
 * Validation rules that only require a name
 * e.g. baseShape, bladeShape, crossSection, culture, haftingShape,
 * @precond request body needs to contain:
 *  name: str
 */
const nameValidationRules = () => {
	return [
		body("name")
			.trim()
			.escape()
			.isLength({ min: 1 })
			.withMessage("Name is required"),
	];
};

/**
 * Validation rules that require both a name and a description
 * e.g. material, region, catalogue
 * @@precond request body needs to contain:
 * 	name: str, description: str
 */
const nameDescValidationRules = () => {
	return [
		body("name")
			.trim()
			.escape()
			.isLength({ min: 1 })
			.withMessage("Name is required"),

		body("description")
			.trim()
			.escape()
			.optional({ nullable: true, checkFalsy: true }),
	];
};

/**
 * Helper function to cheeck validation results from rules
 * @postcond
 *  Success: will move on to next middleware/continue with API
 *  Failure: Will return status code: 422 with error message of what went wrong
 */
const validate = (req, res, next) => {
	const errors = validationResult(req);

	// assumption: validationResult returns a result object
	assert.ok(errors, "validationResult should return an object");

	// if no errors, proceed with API
	if (errors.isEmpty()) {
		logger.debug("Validation succeeded for request", req.path);
		return next();
	}

	// assumption: errors are in an array
	assert(Array.isArray(errors.array()), "Expected errors to be an array");

	// otherwise, extract error messages and return error message
	const extractedErrors = [];
	errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

	logger.error("Validation failed for request:", req.path, {
		errors: extractedErrors,
	});
	return res.status(422).json({
		errors: extractedErrors,
	});
};

module.exports = {
	loginValidationRules,
	changeUsernameValidationRules,
	changePasswordValidationRules,
	siteValidationRules,
	artifactValidationRules,
	periodValidationRules,
	nameValidationRules,
	nameDescValidationRules,
	validate,
};
