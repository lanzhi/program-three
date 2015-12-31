"use strict";

var http = require('http');
var utils = require('./utils');

module.exports = error;

function error() {
  return function *error(next) {
    try {
      yield* next;
      if (404 == this.response.status && !this.response.body) this.throw(404);
    } catch (err) {
      this.status = err.status || 500;

      // application
      this.app.emit('error', err, this);

      this.body = {status: this.status, data: err.message, time: new Date().getTime()};
    }
  }
}