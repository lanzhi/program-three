'use strict';

let Answer = require('../models').Answer;
let Analy = require('../models').Analy;
let utils = require('../middlewares/utils');
let config = require('../config');
let fs = require('fs');

exports.add = function* add() {
  // 添加回答
  let params = this.request.body;
  let accountId = this.session.account.id;
  if (Array.isArray(params)) {
    params.forEach(function (param) {
      param.account_id = accountId;
    });
  }
  yield Answer.create(params);

  // 分析结果
  yield* analyAnswer(params);
  this.body = utils.success('提交成功！');
};

exports.getAnswer = function* getAnswer() {
  // 查询所有分析过的答案
  let analys = yield Analy.find();
  // 获取内容
  let fileContent = '';
  analys.forEach(function (analy) {
    fileContent += analy.content + '\n';
  });

  // 文件下载
  let filename = 'result.txt';
  this.set('Content-disposition', 'attachment;filename=' + filename);
  this.body = fileContent;
};

function* analyAnswer(answers) {
  let analyArray = [];
  answers.forEach(function (answer) {
    let question = answer.question_content;
    let keywords = answer.keywords;
    let label = answer.label_content;
    let analy = question + '|' + label + '|' + JSON.stringify({keywords: keywords});
    analyArray.push({
      answer_id: answer.account_id,
      content: analy
    });
  });

  yield  Analy.create(analyArray);
}