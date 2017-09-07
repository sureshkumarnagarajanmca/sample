/**
 * Created by sai on 7/11/16.
 */

/*
 * Reference fields
 * Provider ID
 Hospital Name
 Address
 City
 State
 ZIP Code
 County Name
 Phone Number
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var leaveSchema = new Schema({
	_id : {type : String, index:true},
    doctorId : {type : Schema.Types.ObjectId, index: true},
    orgId : { type: Schema.Types.ObjectId, index: true},
    startTime : {type : Number},
    endTime: { type : Number},
    leaveType : { type : String},
    leaveActiveStatus : {type : Boolean, default: true}
});


var Leave = mongoose.model('Leave', leaveSchema);
module.exports = Leave;

