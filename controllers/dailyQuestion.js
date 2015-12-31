'use strict';

let DailyQuestion = require('../models').DailyQuestion;
let Question = require('../models').Question;
let utils = require('../middlewares/utils');
let config = require('../config');
let co = require('co');
let schedule = require('node-schedule');
let Answer = require('../models').Answer;
let Label = require('../models').Label;

exports.addTask = function addTask() {
  let rule = new schedule.RecurrenceRule();
  rule.hour = 1;
  schedule.scheduleJob(rule, function () {
    co(addDailyQuestion).then(function () {
      console.log('完成每日问题导入！');
    }, function (err) {
      console.error(err.stack);
    });
  });
  return 'success';
};

exports.getTask = function* getTask() {
  let accountId = this.session.account.id;
  let result = false;

  // 判断用户是否答过题
  let today = new Date(utils.dateFormat(new Date(), 'yyyy/MM/dd'));
  let answered = yield Answer.queryOne({account_id: accountId, create_at: {'$gte': today}});
  if (!answered) {
    result = yield* getNewQuestion(accountId);
  }
  this.body = utils.success(result);
};

exports.getMoreTask = function* getMoreTask() {
  let accountId = this.session.account.id;
  var result = yield* getNewQuestion(accountId);
  this.body = utils.success(result);
};

function* addDailyQuestion() {
  // 从问题库查询指定条问题
  let questions = yield Question.query().limit(config.daily_question);

  if (questions && Array.isArray(questions)) {
    let dailyQuestions = [];
    questions.forEach(function (question) {
      dailyQuestions.push({content: question.content, random: Math.random()});
    });
    // 将问题插入每日问题库
    yield DailyQuestion.create(dailyQuestions);
    // 移除问题库对应的问题
    for (let question of questions) {
      yield question.update({status: 0});
    }
  }
}


function* getNewQuestion(accountId) {
  // 查询用户已经答过题的id
  let answerArray = yield Answer.query({account_id: accountId}).select('question_id');
  let questionIds = [];
  answerArray.forEach(function (answer) {
    questionIds.push(answer.question_id)
  });

  // 随机取出有限条未答过的题
  let questions = yield DailyQuestion.query()
    .where('_id').nin(questionIds)
    .where('random').gt(Math.random())
    .limit(config.question_day);
  let labels = yield Label.query();
  return {count: questions.length, labels: labels, questions: questions};
}