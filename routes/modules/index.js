'use strict';
const mongoose = require('mongoose');
const _ = require('lodash');
mongoose.Promise = Promise;

const Pinglink = require('../../models/Pinglink');
var http = require("http-https");
var url = require('url')
var urlExists = require('url-exists');

const indexModule = {
  getHomePage: function (req, res, next) {
    if (!req.xhr || _.isEmpty(req.query)) {

      res.render('pingLink/pingLink', {
        title: process.env.PORT || '3000',
        linkList: [],
        testKey: process.env.TEST_ENV_KEY || 'local no test key'
      });
    }
    else {
      let offset = !_.isUndefined(req.query.start) ? parseInt(req.query.start) : 0;
      let limit = !_.isUndefined(req.query.length) ? parseInt(req.query.length) : DATA_TABLE_ROW;

      let keyword = '';
      if (!_.isUndefined(req.query.search) && !_.isEmpty(req.query.search.value)) {
        keyword = req.query.search.value.trim();
      }
      let draw = !_.isUndefined(req.query.draw) ? parseInt(req.query.draw) : 0;

      const CountPipeline = [];
      CountPipeline.push({
        $match: {
          $and: [
            { link: { $regex: keyword, $options: 'i' } },
            {
              $or: [
                { status: { $eq: 'ACTIVE' } },
                { status: { $exists: false } },
              ]
            }
          ]
        }
      });

      const QueryPipeline = CountPipeline.concat(
        [
          {
            $sort: { "_id": -1 }
          }, {
            $skip: offset
          }, {
            $limit: limit
          }
        ]
      );

      CountPipeline.push({ $count: "total" });

      let promises = [];

      promises.push(Pinglink.aggregate(QueryPipeline));
      promises.push(Pinglink.aggregate(CountPipeline));

      Promise.all(promises).then((results) => {
        const total = results[1] && results[1][0] && results[1][0]["total"] ? results[1][0]["total"] : 0;
        const output = {
          draw: draw,
          recordsTotal: parseInt(total),
          recordsFiltered: parseInt(total),
          data: results[0],
        };

        res.send(output);
      });

    }
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
      PinglinkObj.status = 'ACTIVE';
    }

    const isLinkAvalable = url.parse(link).protocol;

    urlExists(link, function (err, isExists) {
      if (isLinkAvalable && isExists) {

        Pinglink.findOne({ link: link }, function (err, result) {
          if (result && result.status && result.status != 'ACTIVE') {
            result.status = 'ACTIVE';
            result.save().then(() => {
              res.status(200).send({ msg: "url is saved- keeping your app alive", status: "ok" });
            }).catch((err) => {
              res.status(208).send({ msg: "URL already exist", status: "err" });
            });;

          } else {
            PinglinkObj.save().then(() => {
              res.status(200).send({ msg: "url is saved- keeping your app alive", status: "ok" });
            })
              .catch((err) => {
                res.status(208).send({ msg: "URL already exist", status: "err" });
              });
          }
        });
      } else {
        res.status(208).send({ msg: "unavalable URL!!!", status: "err" });
      }
    });
  },

  deleteLink: function (req, res, next) {
    let linkId = req.body.linkId;

    Pinglink.findOne({ _id: linkId }, function (err, result) {
      if (err) {
        res.status(208).send({ msg: "Err URL!!!", status: "err" });
      }

      if (result) {
        result.status = 'INACTIVE';
        result.save().then(() => {
          res.status(200).send({ msg: "deleted", status: "ok" });
        }).catch((err) => {
          res.status(208).send({ msg: "cannot delete", status: "err" });
        });
      }
      else {
        res.status(208).send({ msg: "Err URL!!!", status: "err" });
      }

    });
  }
}

module.exports = indexModule;