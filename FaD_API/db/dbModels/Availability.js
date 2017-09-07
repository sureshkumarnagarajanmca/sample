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

var availabilitySchema = new Schema({
    doctorId : {type : String, index: true, unique: true},
    availability : {},
    dayTimeAvailbility : {}
    // vaccation : []
},{ strict: false });


var Availability = mongoose.model('Availability', availabilitySchema);
module.exports = Availability;

