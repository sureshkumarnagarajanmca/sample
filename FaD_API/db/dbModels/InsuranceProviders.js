/**
 * Created by pradeep on 3/16/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;
var insuranceProviderSchema = new Schema({
    name: { type : String , unique : true, required : true, trim : true,index : true},
    popular : {type : Number, required : true, trim : true, default : 0},
    payerId : {type : String, trim : true, index : true} // popular,normal
},{strict : false});


var InsuranceProvider = mongoose.model('InsuranceProvider', insuranceProviderSchema);
module.exports = InsuranceProvider;