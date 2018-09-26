var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var MongoClient = require('mongodb').MongoClient;

var indexRouter = require('./routes');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// connect to DB


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//================[ Connect to DB ]===================
const mongoose = require('mongoose');

const databaseURI = process.env.DATABASE_URI || 'mongodb://localhost:27017/pqjkl-testapp-herokusaver';

mongoose.connect(databaseURI).then(() => {
  console.log('[MongoDB]: connected!');
}).catch((err) => {
  console.log('[MongoDB]: cannot connect to db');
  console.log(err);
});

//====================================================
//==========[ Keep heroku app alway awake ]===========
var Job = require('./cloud/job');
setTimeout(() => {
  Job.saveHeroku(process.env.PING_INTERVAL || 1500000);
}, 3000); 

if (process.env.DO_MIGRATE || false) {
  Job.initDatabase();
}
//====================================================

module.exports = app;
