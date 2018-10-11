'use strict';

const axios = require('axios');
const querystring = require('querystring');

const FlickKeyURL = process.env.FlickKeyURL || 'https://www.flickr.com/services/api/explore/flickr.interestingness.getList';
const postData = "method=flickr.interestingness.getList&param_date=&param_extras=&param_per_page=&param_page=&format=rest&sign_call=none";

const FlickrModule = {
  getfFlickrAPIKey: async function (req, res, next) {
    const data = {
      method: 'flickr.interestingness.getList',
      format: 'rest'
    };
    // const options = {
    //   method: 'POST',
    //   headers: { 'content-type': 'application/x-www-form-urlencoded' },
    //   data: /*qs.stringify(data)*/ postData,
    //   url: 'https://www.flickr.com/services/api/explore/flickr.interestingness.getList'
    // };
    console.log(querystring.stringify(data));
    axios.post(FlickKeyURL, JSON.stringify(data), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then((resdd) => {
      //console.log(resdd.data);
      res.send(resdd.data);
      next();
    }).catch((err) => {
      res.status(400).send(err);
    });
  }
};

// var http = require("http-https");
// var url = require('url');

// const FlickKeyURL = process.env.FlickKeyURL || 'https://www.flickr.com/services/api/explore/flickr.interestingness.getList';

// const options = {
//   protocol: 'https:',
//   hostname: 'www.flickr.com',
//   port: 443,
//   path: '/services/api/explore/flickr.interestingness.getList',
//   method: 'POST',
//   Content-Type
// };

// const postData = "method=flickr.interestingness.getListparam_date=&param_extras=&param_per_page=&param_page=&format=rest&sign_call=none";

// const FlickrModule = {
//   getfFlickrAPIKey: async function (req, res, next) {
//     console.log('incomming');
//     let response = '';

//     const requester = http.request(options, function (ServerResponse) {
//       console.log('---------------------');
//       console.log('statusCode:', ServerResponse.statusCode);
//       console.log('headers:', ServerResponse.headers);
//       console.log('---------------------');
//       ServerResponse.setEncoding('utf8');
//       ServerResponse.on('data', (d) => {
//         console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>data<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
//         console.log(d);
//         res.send(d);
//         next();
//       });
//     });

//     requester.on('error', (e) => {
//       console.error(e);
//     });
//     console.log('send>>>>>>>>>>>>>>>>.');
//     requester.write(postData);
//     requester.end();
//   }
// };

module.exports = FlickrModule;