'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let QuestionSchema = new Schema({
  content: {type: String},
  status: {type: Number, default: 1}
});

mongoose.model('Question', QuestionSchema);