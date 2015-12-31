'use strict';

let Account = require('../models').Account;
let utils = require('../middlewares/utils');
let ndir = require('ndir');

exports.multiAdd = function* multiAdd() {
  var contents = yield contentArray('/Users/liuhaiming/Desktop/telphone');
  yield Account.create(contents);
  this.body = utils.success('数据存储成功！');
};

exports.add = function* add() {
  let result = yield Account.create(this.request.body);
  this.body = utils.success(result);
};

exports.del = function* del() {
  let result = yield Account.update({_id: this.params.id}, {status: 0});
  this.body = utils.success(result);
};

exports.login = function* login() {
  let result = '';
  let account = yield Account.queryOne(this.request.body);
  if (account) {
    this.session.account = {
      id: account._id,
      telphone: account.telphone
    };
    result = utils.success('login success');
  } else {
    result = utils.error(403, '用户不存在');
  }
  this.body = result;
};

function contentArray(url) {
  return new Promise(function (resolve, reject) {
    let contentArray = [];
    let lineReader = ndir.createLineReader(url);

    lineReader.on('line', function (line) {
      contentArray.push({telphone: line.toString()});
    });

    lineReader.on('end', function () {
      return resolve(contentArray);
    });

    lineReader.on('error', function (err) {
      return reject(err);
    });
  });
}