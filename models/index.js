'use strict';

let mongoose = require('mongoose');
let config = require('../config');
let utils = require('../middlewares/utils');

mongoose.connect(config.db, {server: {poolSize: 20}}, function (err) {
  if (err) {
    console.error('connect to %s error: ', config.db, err.message);
    process.exit(1);
  }
});

// models
require('./label');
require('./account');
require('./question');
require('./answer');
require('./analy');
require('./dailyQuestion');

exports.Label = createModel('Label');
exports.Account = createModel('Account');
exports.Question = createModel('Question');
exports.Answer = createModel('Answer');
exports.DailyQuestion = createModel('DailyQuestion');
exports.Analy = mongoose.model('Analy');

function createModel(modelName) {
  var model = mongoose.model(modelName);
  model.query = function query(data) {
    data = data || {};
    data.status = 1;
    return model.find(data);
  };

  model.queryOne = function queryOne(data) {
    data = data || {};
    data.status = 1;
    return model.findOne(data);
  };

  return model;
}