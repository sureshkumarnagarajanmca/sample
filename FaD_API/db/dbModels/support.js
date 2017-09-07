
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var supportSchema = new Schema({
	email : {type : String, index:true},
	name : {type : String},
    message : {type : String}
});


var Support = mongoose.model('Support', supportSchema);
module.exports = Support;