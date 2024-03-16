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
