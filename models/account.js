'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AccountSchema = new Schema({
  telphone: {type: String, unique: true},
  status: {type: Number, default: 1}
});

mongoose.model('Account', AccountSchema);