/**
 * Created by pradeep on 3/7/16.
 */
var Leave = require('../../db/dbModels/Leave');

var mongoose = require('mongoose');

var moment = require('moment');

var Q = require('q');

function leaveDataMapping(data){
    var leave = {};
    leave.doctorId = data.doctorId;
    leave.orgId = data.orgId;
    leave['_id'] = data.doctorId+"-"+data.orgId+"-"+data.startTime+"-"+data.endTime;
    leave.startTime = data.startTime;
    leave.endTime = data.endTime;
    leave.leaveType = data.leaveType;
    leave.leaveActiveStatus = true;
    return leave;
}

exports.saveDoctorLeave = function(data){
    var deferred = Q.defer();
    var leave = leaveDataMapping(data);
    console.log(leave);
    Leave.findOneAndUpdate({_id: leave._id},leave,{upsert: true, new: true},function(err,succ){
        if(err){
            deferred.reject(err);
        }else{
            deferred.resolve(succ);
        }
    })  
    return deferred.promise;
};

exports.deleteDoctorLeave = function(leaveId, doctorId){
    var deferred = Q.defer();
    Leave.findOneAndUpdate({_id: leaveId,doctorId : doctorId},{$set : {leaveActiveStatus : false}},{new : true},function(err,succ){
        if(err){
            deferred.reject(err);
        }else{
            deferred.resolve(succ);
        }
    })  
    return deferred.promise;
};
    
exports.getDoctorLeaves = function(doctorId,queryObj){
    var deferred = Q.defer();
    var query = {
        doctorId : doctorId
    };
    console.log(queryObj);
    if(!!queryObj.orgId){
        query.orgId = queryObj.orgId;
    }
    queryObj.leaveActiveStatus = true;
    Leave.find(query,function(err,succ){
        if(err){
            deferred.reject(err);
        }else{
            deferred.resolve(succ);
        }
    })  
    return deferred.promise;
};


