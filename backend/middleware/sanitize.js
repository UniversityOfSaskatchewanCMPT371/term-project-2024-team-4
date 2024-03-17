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
 * Validation rules for user registration
 * @precond request body needs to contain `userName` and `password` fields
 */
const registerValidationRules = () => {
	return [
		// validate and sanitize username
		body("userName")
			.trim()
			.isLength({ min: 3, max: 15 })
			.withMessage("Username must be less than 15 characters")
			.matches(/^[a-zA-Z0-9!@#$%^&*(),.?]+$/)
			.withMessage("Username contains invalid characters"),

		// validate and sanitize passssword
		body("password")
			.trim()
			.isLength({ min: 5, max: 20 })
			.withMessage("Password must be at least 5 characters long")
			.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?]).+$/)
			.withMessage(
				"Password must include uppercase, lowercase, numbers, and special characters",
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
 *  name: str, description: str, location, dimensions, photo
 *  foreign-keys: siteId, artifactTypeId, cultureId, bladeShapeId, baseShapeId, haftingShapeId, crossSectionId
 */
const artifactValidationRules = () => {
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

		body("dimensions")
			.trim()
			.escape()
			.optional({ nullable: true, checkFalsy: true }),

		body("photo")
			.trim()
			.escape()
			.optional({ nullable: true, checkFalsy: true }),
	];
};

/**
 * @TODO
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
 * e.g. material, region
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

	// if no errors, proceed with API
	if (errors.isEmpty()) {
		return next();
	}

	// otherwise, extract error messages and return error message
	const extractedErrors = [];
	errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

	return res.status(422).json({
		errors: extractedErrors,
	});
};

module.exports = {
	loginValidationRules,
	registerValidationRules,
	siteValidationRules,
	artifactValidationRules,
	periodValidationRules,
	nameValidationRules,
	nameDescValidationRules,
	validate,
};
