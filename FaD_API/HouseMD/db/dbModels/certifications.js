/**
 * Created by sai on 3/18/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var certifiCationSchemaSchema = new Schema({
    certficationName :  {type : String},
    specialities : [{
        taxonomyString : {type : String},
        taxonomyCode : { type : String}
    }],
    dispInd : {type : Boolean, default : true},
    date : {type: Date,  default: Date.now}
});
var certifications = mongoose.model('certifications',certifiCationSchemaSchema);
module.exports = certifications;


