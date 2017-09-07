var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var appointmentSchema = new Schema({
    startTime: { type : Number ,required : true ,index: true,},
    endTime: { type : Number ,required : true, index: true,},
    userId : { type: Schema.Types.ObjectId, ref: 'User' , index: true, required: true},
    doctorId:{type : Schema.Types.ObjectId, ref: 'Doctor' , index: true, required: true},
    // insuranceDetails :{type : Array},
    insuranceId :{type : String},
    speciality:{type : String},
    reason:{type:String},
    userStatus:{type : String},
    doctorStatus:{type : String},
    appointmentCancellationStatus : {type : Boolean, default : false},
    review:{type : String},
    rating: {type : String},
    doctorLeave : {type : Boolean},
    message: {type : String},
    orgId: {type : String},
    doctorId:{type : Schema.Types.ObjectId, ref: 'Organization' , index: true, required: true},
    consultingForUser:{type : Boolean},
    patientInfo:{
        name : {type : String},
        email : {type : String},
        dob : {type : String},
        gender : {type : String},
        patientGuardian : {type : Boolean}
    },
    paymentMode : {type : String}
    // practiseLocation:{type : Object}
});


var Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;