



/**
 * Created by pradeep on 3/18/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taxonomySchema = new Schema({
    _id : {type :String, unique : true, required : true}, // Taxonomy Id
    level : {type: String, required: true},
    /*grouping : { type : String },
    speciality: { type : String },
    subSpeciality : {type : String},*/
    orderNo : {type  : Number },
    title : {type : String},
    parent :{type:String, ref:'Taxonomy'},
    date : {type: Date},
    popularity :{type : Number, default : 0},
    order:{type : Number},
    taxonomyName : {type : String}
});


var Taxonomy = mongoose.model('Taxonomy', taxonomySchema);
module.exports = Taxonomy;
