'use strict';
const mongoose = require('mongoose');
mongoose.Promise = Promise;

const Pinglink = require('../../models/Pinglink');
var http = require("http-https");
var url = require('url')

const indexModule = {
  getHomePage: function (req, res, next) {
    Pinglink.find({})
      .then((results) => {
        res.render('index', {
          title: process.env.PORT || '3000',
          linkList: results,
          testKey: process.env.TEST_ENV_KEY || 'local no test key'
        });
      })
      .catch((err) => {
        res.render('index', {
          title: process.env.PORT || '3000',
          linkList: [],
          testKey: process.env.TEST_ENV_KEY || 'local no test key'
        });
      });
  },

  postNewLink: function (req, res, next) {
    let link = req.body.link;

    const PinglinkObj = new Pinglink;

    if (link) {
      const hasProtocol = link.substring(0, 4) == 'http' ? true : false;
      if (!hasProtocol) {
        link = 'http://' + link;
      }

      PinglinkObj.link = link;
    }
    
    const isLinkAvalable =  url.parse(link).protocol;

    if (isLinkAvalable) {
      http.get(link, function () {
        PinglinkObj.save().then(() => {
          res.status(200).send({msg:"url is saved- keeping your app alive", status: "ok"});
        })
          .catch((err) => {
            res.status(208).send({msg:"URL already exist", status: "err"});
          })
      });
    } else {
      res.status(208).send({msg:"unavalable URL!!!", status: "err"});
    }
  }
}

module.exports = indexModule;