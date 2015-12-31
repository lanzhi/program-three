'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let DailyQuestionSchema = new Schema({
  content: {type: String},
  random: {type: Number},
  status: {type: Number, default: 1}
});

DailyQuestionSchema.index({random: 1});

mongoose.model('DailyQuestion', DailyQuestionSchema);