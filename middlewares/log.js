"use strict";

const config = require('../config');

exports.debug = function debugLog() {
  if (config.debug) {
    let args = Array.prototype.slice.call(arguments);
    args[0] = _time() + args[0];
    args.forEach(function (e, i) {
      if (typeof e === 'object') {
        args[i] = JSON.stringify(e);
      }
    });
    console.log.apply(console, args);
  }
};

exports.error = function errorLog(err) {
  console.error(_time() + (err && err.stack));
};

function _time() {
  let now = new Date();
  return (now.getYear() + 1900) + '-' + _cover(now.getMonth() + 1) + '-' + _cover(now.getDate()) + ' '
    + _cover(now.getHours()) + ':' + _cover(now.getMinutes()) + ':' + _cover(now.getSeconds()) + ' ';
}

function _cover(num) {
  return (num < 10 ? '0' + num : num);
}
