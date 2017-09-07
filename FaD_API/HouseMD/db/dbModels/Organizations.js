/**
 * Created by pradeep on 3/6/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//Provider ID	Hospital Name	Address	City	State	ZIP Code	County Name	Phone Number
var organizationSchema = new Schema({
    npi : { type : String , trim: true},
    hsopitalAffliationNumber : {type :String, trim : true},
    taxonomy : [],
    licenceNumbers : [{
        "state"  : { type : String , trim: true},
        "number"    : { type : String, trim: true}
    }],
    orgName: { type : String , unique : true, required : true, index: true},
    orgOtherName: { type : String},
    description :{type :String, trim : true},
    address : {
        Line1StreetAddress : String,
        Line2StreetAddress : String,
        city : {type :String, trim : true},
        state : {type :String, trim : true},
        county : {type: String},
        country : {type :String, trim : true},
        zipCode : String,
        locationCode : String,
        geoLocation : {
            location: {
                lat: {type: String},
                lon: {type: String}
            }
        },
        phoneNo : String
    },
    rating : {type : String},
    pracAddress : {
        Line1StreetAddress : String,
        Line2StreetAddress : String,
        city : {type :String, trim : true},
        state : {type :String, trim : true},
        county : {type: String},
        country : {type :String, trim : true},
        zipCode : String,
        locationCode : String,
        geoLocation : {
            location: {
                lat: {type: String},
                lon: {type: String}
            }
        },
        
        phoneNo : String
        
    },
  
    lastUpdateDate : {type: Date,  default: Date.now},
    authOffLastName : {type: String},
    authOffFirstName : {type: String},
    authOffMiddleName : {type: String},
    authOffTitleorPosition : {type: String},
    authOffTphoneNum  : {type: String},
    authOffNamePrefix : {type: String},
    isOrgSubpart : {type: String}
  
});

var Organization = mongoose.model('Organization', organizationSchema);
module.exports = Organization;
