/**
 * Created by pradeep on 3/18/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var otpSchema = new Schema({
    userId : {type : Schema.Types.ObjectId, unique : true, index: true, required : true}, // user Id
    otp : {type: String, required: true},
    expiry  : {type : Number, required : true}
    // ,
    // otpType : {type: String, enum: ['signUp', 'forgotPwd', 'mobileVerf','emailVerf'], required: true}
});

var otp = mongoose.model('otp', otpSchema);
module.exports = otp;
