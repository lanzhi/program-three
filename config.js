'use strict';

const ISPRODUCTION = process.env.NODE_ENV === 'production';

module.exports = {
  port: 4321,
  debug: true,
  db: ISPRODUCTION ? 'mongodb://nlplabel:raventech_data@192.168.1.50/nlp_data_label' : 'mongodb://127.0.0.1/nlp_data_label',
  isProduction: ISPRODUCTION,
  staticServerMaxAge: ISPRODUCTION ? 2592000000 : 0,//ms,一个月
  sessionSecret: ["nlp-datl-labea"],
  input: __dirname + '/doc/input.txt',
  question_day: 20,
  daily_question: 200
};