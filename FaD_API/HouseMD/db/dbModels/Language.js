var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var languageSchema = new Schema({
    _id : { type : Number ,unique : true, required : true},
    languageName: { type : String ,required : true}
});


var Language = mongoose.model('Language', languageSchema);
module.exports = Language;