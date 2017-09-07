/**
 * Created by pradeep on 3/7/16.
 */
var Availability = require('../../db/dbModels/Availability');

var mongoose = require('mongoose');

var Q = require('q');


function getScheduleObject(availabilityObj,data,allowedSlots){
    'use strict'
 // console.log(data);
    for (var i = 0; i < data.scheduleList.length; i++) {
        var lengthOfItems = (data.scheduleList[i].endTime - data.scheduleList[i].startTime)/data.slotDuration;
        if(!availabilityObj.dayTimeAvailbility[data.orgId][data.day]){
            availabilityObj.dayTimeAvailbility[data.orgId][data.day]  = [{
                startTime : data.scheduleList[i].startTime, 
                endTime :data.scheduleList[i].endTime
            }];
        }else{
            availabilityObj.dayTimeAvailbility[data.orgId][data.day].push({
                startTime : data.scheduleList[i].startTime, 
                endTime :data.scheduleList[i].endTime
            })
        }

        for (var j = 0; j < lengthOfItems; j++) {
            var obj = {};
            
            var keyForSchedule = data.day +"-"+(data.scheduleList[i].startTime+(j*data.slotDuration))+ "-"+(
            
            data.scheduleList[i].startTime+((j+1)*data.slotDuration));
            obj[keyForSchedule] = {};
            obj[keyForSchedule].orgId = data.orgId;
            obj[keyForSchedule].startTime  = data.scheduleList[i].startTime+(j*data.slotDuration);
            obj[keyForSchedule].endTime = data.scheduleList[i].startTime+((j+1)*data.slotDuration);
            obj[keyForSchedule].allowedSlots = data.allowedSlots;
            availabilityObj.availability[keyForSchedule] = obj[keyForSchedule];
        };
    };   
    // return availabilityObj;
}

exports.updateDoctorAvailabilityOnWeek = function(data){
    'use strict'
    try {
        var availabilityListOfDoctorForSchema = [];
        var availabilityObj = {};
        availabilityObj.doctorId = data.doctorId;
        availabilityObj.availability = {};
        availabilityObj.dayTimeAvailbility = {};
        var deferred = Q.defer();
        for(let orgAvailability of data.availability){
            getOrganizationAvailabitlity(orgAvailability)
        }    
        function  getOrganizationAvailabitlity(data){
        'use strict'
            data.slotDuration = data.slotDuration || 15;
            availabilityObj.dayTimeAvailbility[data.orgId] = {};        
            for(let obj in data.schedule){
                let objectForFunction = {};
                objectForFunction.allowedSlots = data.allowedSlots || 1;
                objectForFunction.scheduleList = data.schedule[obj];
                objectForFunction.day = obj;
                objectForFunction.orgId = data.orgId;
                objectForFunction.slotDuration = data.slotDuration;
                getScheduleObject(availabilityObj,objectForFunction);
            }
        }

        Availability.findOneAndUpdate({doctorId:data.doctorId},
            {
                "$set":{ availability : availabilityObj.availability, dayTimeAvailbility : availabilityObj.dayTimeAvailbility}
            },{upsert: true,new : true, $project : {dayTimeAvailbility  :1}},function(err, availability) {
            if(err){
                deferred.reject(err);
            }else{
                deferred.resolve(availability);
            }
        });
    }catch(err){
        deferred.reject(err);
    }
    return deferred.promise;
};

exports.getDoctoravailability = function(doctorId){
    var deferred = Q.defer();
    Availability.findOne({"doctorId":doctorId},function(err, doctor) {
        if (err) {
            deferred.reject("Error while updating the doctor");
        }else {
            deferred.resolve(doctor.dayTimeAvailbility);
        }
    });
    return deferred.promise;
}

exports.getDoctoravailability = function(doctorId){
    var deferred = Q.defer();
    Availability.findOne({"doctorId":doctorId},function(err, doctor) {
        if (err) {
            deferred.reject("Error while updating the doctor");
        }else {
            if(doctor){
                deferred.resolve(doctor.dayTimeAvailbility || {});
            }else{
                deferred.resolve({});
            }
            
        }
    });
    return deferred.promise;
}

exports.getDoctorAvailabilityObject = function(doctorId){
    var deferred = Q.defer();
    Availability.findOne({"doctorId":doctorId},function(err, doctor) {
        if (err) {
            deferred.reject("Error while updating the doctor");
        }else {
            deferred.resolve(doctor);
        }
    });
    return deferred.promise;
}

// var generateKeyForSchedule = function(day,startTime,endTime){
//     var days = [{
//         "Monday" : "Mon",
//         "Tuesday" : "Tue",
//         "Wednesday" : "Wed",
//         "Thursday" : "Thus",
//         "Friday" : "Fri",
//         "Saturday" : "Sat",
//         "Sunday" : "Sun"
//     }];
// }
    
