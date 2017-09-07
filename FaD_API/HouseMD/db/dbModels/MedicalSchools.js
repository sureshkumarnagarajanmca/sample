/**
 * Created by pradeep on 4/27/16.
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

var  medicalSchoolSchema = new Schema({
    _id : {type : Schema.Types.ObjectId},
    name : {type: String, required: true, index: true},
    address : {
        Line1StreetAddress : String,
        Line2StreetAddress : String,
        city : String,
        state : {type: String},
        countyName : {type: String},
        country : {type: String, default:"USA"},
        zipCode : {type :String},
       
    }
});


var   MedicalSchool = mongoose.model('MedicalSchool', medicalSchoolSchema);
module.exports =  MedicalSchool;

