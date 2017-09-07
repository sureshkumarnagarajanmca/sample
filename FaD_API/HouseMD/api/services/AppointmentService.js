/**
 * Created by pradeep on 3/7/16.
 */
(function(){
    'use strict';

var Appointments = require('../../db/dbModels/Appointments');

var mongoose = require('mongoose');
var moment = require('moment');

var Q = require('q');

function appointmentObjectMapping(data){
    var appointment = {}
        appointment.doctorId = data.doctorId;
        appointment.startTime = data.startTime;
        appointment.endTime = data.endTime;
        appointment.InsuranceId = data.InsuranceId;
        appointment.reason = data.reason;
        appointment.message = data.message;
        appointment.speciality = data.speciality;
        appointment.consultingForUser = data.consultingForUser;
        appointment.userId = data.userId;
        appointment.orgId = data.orgId;
        appointment.paymentMode = data.appointment;
        if(!data.consultingForUser){
            if(data.hasOwnProperty("patientInfo")){
                appointment.patientInfo = {};
                appointment.name = data.patientInfo.name;
                appointment.email = data.patientInfo.email;
                appointment.dob = data.patientInfo.dob;
                appointment.gender = data.patientInfo.gender;
                appointment.patientGuardian = data.patientInfo.patientGuardian;
                for(let i in appointment.patientInfo){
                    if(!appointment.patientInfo[i]){
                        delete appointment.patientInfo[i];
                    }
                }                                                
            }
        }

        for(var key in appointment){
            
            if(!appointment[key]){
                delete appointment[key];
            }
        }

    return appointment;
}

exports.createAppointment = function (data) {
    var defered = Q.defer();
    var appointment = appointmentObjectMapping(data);
    console.log(appointment);
    Appointments.create(appointment,function(err,succ){
        console.log(err);
        if(err){
            defered.reject(err)
        }else{
            defered.resolve(succ);
        }
    });
    return defered.promise;
}

exports.cancelAppointmentByDoctor = function(appointmentId,doctorId){
    var defered = Q.defer();
    Appointments.findOneAndUpdate({_id : appointmentId , doctorId : doctorId},{$set : {appointmentCancellationStatus : true}},{new : true},function(err,succ){
        console.log(succ);
        if(err){
            defered.reject(err)
        }else{
            defered.resolve(succ);
        }
    });
    return defered.promise;
}

exports.cancelAppointmentByUser = function(appointmentId, userId){
    var defered = Q.defer();
    Appointments.findOneAndUpdate({_id : appointmentId, userId : userId},{$set : {appointmentCancellationStatus : true}},{new : true},function(err,succ){
        console.log(succ);
        if(err){
            defered.reject(err)
        }else{
            defered.resolve(succ);
        }
    });
    return defered.promise;
}

exports.getAppointment = function(appointmentId){
    var defered = Q.defer();
    Appointments.findOne({_id: appointmentId},function(err,succ){
        if(err){
            defered.reject(err);
        }else{
            if(succ){
                defered.resolve(succ);
            }
        }
    });
    return defered.promise;
}

exports.getAppointmentForLogstash = function(appointmentInfo){
    var defered = Q.defer();
    var queryObj = {};
    queryObj.appointmentCancellationStatus = false;
    queryObj.doctorId = appointmentInfo.doctorId;
    queryObj.orgId = appointmentInfo.orgId;
    queryObj.startTime = appointmentInfo.startTime;
    Appointments.find(queryObj,function(err,succ){
        if(err){
            defered.reject(err);
        }else{
            if(succ){
                defered.resolve(succ);
            }
        }
    });
    return defered.promise;
}

exports.getAppointmentsofDoctor = function(doctorId,queryObj){
    'use strict'
    var defered = Q.defer();
    var query = {};
    if(doctorId){
        query.doctorId = doctorId;
    }
    queryObj = queryObj || {};
    if(!!queryObj.startTime && !!queryObj.endTime){
        let startTime = queryObj.startTime;
        let endTime = queryObj.endTime;
        query.startTime = {};
        query.startTime['$gte'] = startTime;
         query.startTime['$lte'] = endTime;
    }
    if(!!queryObj.orgId){
        query.orgId = queryObj.orgId;
    }
    query.appointmentCancellationStatus = false;
    Appointments.find(query)
    .populate('orgIds.orgId','orgName')
    .populate('orgIds.orgId','fName lName')
    .exec(function(err,succ){
        if(err){
            defered.reject(err);
        }else{
            if(succ){
                defered.resolve(succ);
            }
        }
    });
    return defered.promise;
}

exports.getAppointmentsofUser = function(userId,queryObj){
    'use strict'
    var defered = Q.defer();
    var query = {};
    if(userId){
        query.userId = userId;
    }
    if(!!queryObj.startTime && !!queryObj.endTime){
        let startTime = queryObj.startTime;
        let endTime = queryObj.endTime;
        query.startTime = {};
        query.startTime['$gte'] = startTime;
         query.startTime['$lte'] = endTime;
    }
    query.appointmentCancellationStatus = false;
    // console.log(queryObj);
    Appointments.find(query,function(err,succ){
        if(err){
            defered.reject(err);
        }else{
            if(succ){
                defered.resolve(succ);
            }
        }
    });
    return defered.promise;
}
})()