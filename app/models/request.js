// grab the mongoose module
const mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

const requestSchema = mongoose.Schema({
	author : {type: mongoose.Schema.ObjectId, ref: 'User'},
	status: String,
  resolved_by: {type: mongoose.Schema.ObjectId, ref: 'User'},
  request_created_at: { type: Date, default: Date.now },
  vacation_start_date: Date,
  vacation_end_date: Date
});

// requestSchema.plugin(timestamps);

module.exports = mongoose.model('requests', requestSchema);
