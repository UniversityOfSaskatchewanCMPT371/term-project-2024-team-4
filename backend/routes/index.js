var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res) {
	res.render("index", { title: "Express" });
});

// new route for /hello
router.get("/helloworld", function (req, res) {
	res.send("Hello from Backend");
});

module.exports = router;
