/**
 * Created by pradeep on 3/16/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var insurancePlanSchema = new Schema({
    providerId : { type: Schema.Types.ObjectId, required: true, ref: 'InsuranceProvider' },
    name: { type : String , unique : true, required : true},
    category : {type : String, required : true, trim : true, default : 'normal'}, // popular,normal
    status : {type: Boolean, default: true}
});


var InsurancePlan = mongoose.model('InsurancePlan', insurancePlanSchema);
module.exports = InsurancePlan;