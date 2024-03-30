/**
 * Middleware to authenticate admins when performing admin-only action
 */

/**
Usage:
// import
const authenticateAdmin = require("authenticate.js");

// usage in an API
router.post('api', authenticateAdmin, (req,res) => { admin only action });

 */

const { logger } = require("../config/logger");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Middleware function to authenticate an admin by checking for a valid signed token
 * @param {*} req - request header
 * @param {*} next - to pass the next middleware if valid
 * @precond User has a valid token signed by the JWT_SECRET
 * @postcond
 *  Succesful: Control passed to next middleware;
 *  Failure: 400-level error response
 */
const authenticateAdmin = (req, res, next) => {
	// Find token from request cookies/header
	const token =
		req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

	if (!token) {
		// no token = not admin, return 400 status
		logger.warn("Invalid Token: No token provided");
		return res
			.status(401)
			.json({ message: "Access denied. No token provided" });
	}

	try {
		// verify token
		// will return an error if the token is invalid
		logger.info("Valid Token: Provided token was valid");
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		req.user = decoded;
		next();
	} catch (error) {
		// invalid token, return 400 status
		logger.warn("Invalid Token: Token provided was invalid");
		return res
			.status(401)
			.json({ message: "Access denied. Invalid token provided." });
	}
};

module.exports = authenticateAdmin;
