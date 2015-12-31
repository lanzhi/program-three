'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AnalySchema = new Schema({
  answer_id: {type: String},
  content: {type: String}
});

mongoose.model('Analy', AnalySchema);