var mongoose = require('mongoose');
var Doctor = require('Doctors');

var mongoURI;

mongoURI = "mongodb://127.0.0.1:27017/fadupload_ms";

var db = mongoose.connect(mongoURI);

Doctor.find().sort({'_id': -1}).limit(10).exec(function(err, doctors) {
	console.log(doctors);
});

