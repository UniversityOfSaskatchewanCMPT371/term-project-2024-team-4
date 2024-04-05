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
const { User } = require("../dist/user.entity");
const dataSource = require("../config/db");
const { logger } = require("../config/logger");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Middleware function to authenticate an admin by checking for a valid signed token
 * Additionally, will extract the `user` via the JWToken ID
 * 	- Adds the `user` to `req`
 * @param {*} req - request header
 * @param {*} next - to pass the next middleware if valid
 * @precond User has a valid token signed by the JWT_SECRET
 * @postcond
 *  Succesful: Control passed to next middleware;
 *  Failure: 400-level error response
 */
const authenticateAdmin = async (req, res, next) => {
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
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		logger.info("Valid Token: Provided token was valid");

		// fetch user details to add to `request`
		const Users = await dataSource.getRepository(User);
		const user = await Users.findOneBy({ id: decoded.id });

		// check if user was actually found
		if (!user) {
			logger.error(`User with id ${decoded.id} was not found in the database`);
			return res.status(404).json({ message: "User not found" });
		}

		// User found, add necessary data to user
		req.user = {
			id: user.id,
			username: user.userName,
			role: user.role,
		};

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
