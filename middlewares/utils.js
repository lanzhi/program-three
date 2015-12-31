'use strict';

let _extend = require('util')._extend;
let node_uuid = require('node-uuid');

exports.gen = function () {
  return node_uuid.v1().replace(/-/g, '');
};

// 结果封装
exports.success = function (result) {
  var data = {};
  data.status = 200;
  data.data = result;
  data.time = new Date().getTime();
  return data;
};

exports.error = function (status, msg) {
  var data = {};
  data.status = status;
  data.data = msg;
  data.time = new Date().getTime();
  return data;
};

// 时间格式转换
exports.dateFormat = function (date, fmt) {
  if (!date) return '';
  if (typeof date === 'number') {
    date = new Date(date);
  }
  fmt = fmt || 'yyyy-MM-dd';
  var o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return fmt;
};

exports.extend = _extend;