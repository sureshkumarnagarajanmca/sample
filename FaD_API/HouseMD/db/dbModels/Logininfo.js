/**
 * Created by pradeep on 3/6/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//var passportLocalMongoose = require('passport-local-mongoose');

var loginInfoSchema = new Schema({
    login: { type : String , required : true, trim: true, index : true},   //this feild may contain email / phone number
    source: { type: String, required: true, default:'FaD' },  // like FaD, gmail etc
    userId : { type: Schema.Types.ObjectId, ref: 'User', index : true},
    pwdhash:  { type: String, required : true},
    mobile: { type: String, required : true, trim: true, index : true},
    countryCode: { type: String, default:'+1' },
    mobileVerfiInd: { type: Boolean, default:false },
    eMailVerfInd: { type: Boolean, default:false },
    profVerfInd: { type: Boolean, default:false }
});

//loginInfoSchema.plugin(passportLocalMongoose);
var Logininfo = mongoose.model('Logininfo', loginInfoSchema);
module.exports = Logininfo;