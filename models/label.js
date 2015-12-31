'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let LabelSchema = new Schema({
  name: {type: String},
  status: {type: Number, default: 1}
});

mongoose.model('Label', LabelSchema);