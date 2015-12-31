'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AnswerSchema = new Schema({
  account_id: {type: String},
  question_id: {type: String},
  question_content: {type: String},
  label_id: {type: String},
  label_content: {type: String},
  create_at: {type: Date, default: new Date()},
  analy_status: {type: Number, default: 1},
  keywords: {type: Array},
  status: {type: Number, default: 1}
});

mongoose.model('Answer', AnswerSchema);