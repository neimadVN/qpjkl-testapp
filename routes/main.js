var express = require('express');
var router = express.Router();

const IndexModule = require('./modules/index.js');
router.get('/', function(req, res, next) {IndexModule.getHomePage(req, res, next)}); /*Get Home Page*/
router.post('/', function(req, res, next) {IndexModule.postNewLink(req, res, next)});/*Post New Link*/

module.exports = router;
