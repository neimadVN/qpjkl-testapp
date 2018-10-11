var express = require('express');
var router = express.Router();

// index module
const IndexModule = require('./modules/index.js');
router.get('/', IndexModule.getHomePage); /*Get Home Page*/
router.post('/', IndexModule.postNewLink);/*Post New Link*/
router.post('/deleteLink/', IndexModule.deleteLink);

// Flickr module
const FlickrModule = require('./modules/flickr.js');
router.get('/getfFlickrAPIKey', function(req, res, next) {FlickrModule.getfFlickrAPIKey(req, res, next)}); //get public Flick API key

module.exports = router;
