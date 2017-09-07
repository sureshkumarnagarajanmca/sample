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

var hospitalSchema = new Schema({
    _id : {type : Schema.Types.ObjectId},
    medicareCCN : {type :String}, // Provider ID
    name : {type: String, required: true, index: true},
    address : {
        Line1StreetAddress : String,
        Line2StreetAddress : String,
        city : String,
        state : {type: String},
        countyName : {type: String},
        country : {type: String, default:"US"},
        zipCode : Number,
        phoneNo : String
    },
    rating : {type: String, default:"0"},
    date : {type: Date,  default: Date.now}
});


var Hospital = mongoose.model('Hospital', hospitalSchema);
module.exports = Hospital;

