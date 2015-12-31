'use strict';

let Question = require('../models').Question;
let utils = require('../middlewares/utils');
let config = require('../config');
let ndir = require('ndir');

exports.add = function* add() {
  let contents = yield contentArray(config.input);
  yield Question.collection.insert(contents);
  this.body = utils.success('数据存储成功！');
};

function contentArray(url) {
  return new Promise(function (resolve, reject) {
    let contentArray = [];
    let lineReader = ndir.createLineReader(url);

    lineReader.on('line', function (line) {
      contentArray.push({content: line.toString(), status: 1});
    });

    lineReader.on('end', function () {
      return resolve(contentArray);
    });

    lineReader.on('error', function (err) {
      return reject(err);
    });
  });
}