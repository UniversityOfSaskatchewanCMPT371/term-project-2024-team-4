var express = require("express");
var router = express.Router();
const { logger } = require("../config/logger");

/*
Route mainly used for testing.
To check if backend is functioning properly.
*/

/**
 * GET request for index.js
 * @param {*} req - unused
 * @param {*} res - response object used to render index page
 * @precond Server is up and running
 * @postcond
 * 	Succesful: renders index page with a title
 * 	Failure: Error message can vary (network, 404[page does not exist], etc.)
 */
router.get("/", function (req, res) {
	logger.debug("Index page succesfully rendered");
	return res.render("index", { title: "Express" });
});

/**
 * GET Request to check if the backend is working
 * @param {*} req - unused
 * @param {*} res - response object used to send a simple text message to client
 * @precond server is up and running
 * @postcond
 *	Succesful: sends a visible message to client page
 * 	Failure: Error message can vary (network, 404[page does not exist], etc.)
 */
router.get("/helloworld", function (req, res) {
	logger.debug("Simple message sent to client from backend");
	return res.send("Hello from Backend");
});

module.exports = router;
