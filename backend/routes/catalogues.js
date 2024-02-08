var express = require('express');
var router = express.Router();

// new route for /hello
router.get('/', function(req, res, next) {
  res.send('Hello from catalogue');
});


module.exports = router;
