var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
    email: { type : String , required : true, index : true},
    mobile: { type : String , required : true, index : true},
    fName: String,
    lName: String,
    type: { type : String, default:'user'},
    gender : { type : String},
    // dob:{ type: Date},
    dob: { type : Number },
    imageId : String,
    countryCode : { type: String, default:'+1' },
    deviceId : String
});


var User = mongoose.model('User', userSchema);
module.exports = User;