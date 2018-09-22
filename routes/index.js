var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
     title: process.env.PORT || '3000',
     testKey: process.env.TEST_ENV_KEY || 'local no test key'
  });
});

module.exports = router;
