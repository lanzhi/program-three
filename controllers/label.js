'use strict';

let Label = require('../models').Label;
let utils = require('../middlewares/utils');

exports.add = function* add() {
  let result = yield Label.create(this.request.body);
  this.body = utils.success(result);
};

exports.del = function* del() {
  let result = yield Label.update({_id: this.params.id}, {status: 0});
  this.body = utils.success(result);
};

exports.update = function* update() {
  let result = yield Label.update({_id: this.params.id}, this.request.body);
  this.body = utils.success(result);
};

exports.getAll = function* getAll() {
  let result = yield Label.query();
  this.body = utils.success(result);
};