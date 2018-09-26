const mongoose = require('mongoose');
mongoose.Promise = Promise;

var http = require("http");

const Pinglink = require('../models/Pinglink');
const PinglinkMigrate = require('../config/migrate.json').Pinglink;

const Job = {
    saveHeroku: function(interval) {
        setInterval(function () {
            Pinglink.find({})
            .then((result) => {

                for (let i in result) {
                    console.log('=========================================================');
                    console.log('[HTTP] - preventing heroku from sleeping: ' + (new Date).toString());
                    http.get(result[i]['link']);
                    console.log('=========================================================');
                }
            })
            .catch((err) => {
                console.log (err);
            });


            
        }, interval);
    },
    initDatabase: function() {
        console.log(PinglinkMigrate);
        Pinglink.insertMany(PinglinkMigrate).then(() => {
            console.log(oke);
        }).catch((err) => {
            console.log(err)
        });
    }
};

module.exports = Job;