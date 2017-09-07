
/*jslint sub:true , newcap:true */

var ModelFactory = appGlobals.ModelFactory;


function agendaAdapter(data,contextProvider){
    var nextRunAt = data.schedule && new Date(data.schedule).toISOString() || null;
    var _mmsid = data.msg;
    var _job = {
                "info": {
                    "msg": _mmsid,
                    "context": contextProvider.toJSON()
                },
                "type":data.type,
                "status": "created",
                "scheduledOn": Number(data.schedule)
            };

    var jobmeta = {
                "data" : _job,
                "lastFinishedAt" : Date.now(),
                "lastModifiedBy" : null,
                "lastRunAt" : Date.now(),
                "lockedAt" : null,
                "name" : data.type,
                "nextRunAt" : nextRunAt,
                "priority" : 0,
                "type" : "normal"
            };
    return jobmeta;
}

function postAgendaAdapter(data,contextProvider){
    var nextRunAt = data.schedule && new Date(data.schedule).toISOString() || null;
    var post = data.post;
    var userId = data.userId;
    var topicId = data.topicId;
    var teamId = data.teamId;
    var isSch = data.isSch;
    var stateChange = data.stateChange;
    var _job = {
                "info": {
                    "post": post,
                    "userId": userId,
                    "topicId": topicId,
                    "teamId": teamId,
                    "isSch": isSch,
                    "stateChange": stateChange,
                    "context": contextProvider.toJSON()
                },
                "type":data.type,
                "status": "created",
                "scheduledOn": Number(data.schedule)
            };

    var jobmeta = {
                "data" : _job,
                "lastFinishedAt" : Date.now(),
                "lastRunAt" : Date.now(),
                "name" : data.type,
                "nextRunAt" : nextRunAt
            };

    return jobmeta;
}

function commentAgendaAdapter(data,contextProvider){
    var nextRunAt = data.schedule && new Date(data.schedule).toISOString() || null;
    var post = data.post;
    var userId = data.userId;
    var topicId = data.topicId;
    var comment = data.comment;
    var isSch = data.isSch;
    var stateChange = data.stateChange;
    var _job = {
                "info": {
                    "post": post,
                    "userId": userId,
                    "topicId": topicId,
                    "comment": comment,
                    "isSch": isSch,
                    "stateChange": stateChange,
                    "context": contextProvider.toJSON()
                },
                "type":data.type,
                "status": "created",
                "scheduledOn": Number(data.schedule)
            };

    var jobmeta = {
                "data" : _job,
                "lastFinishedAt" : Date.now(),
                "lastRunAt" : Date.now(),
                "name" : data.type,
                "nextRunAt" : nextRunAt
            };

    return jobmeta;
}

function agendaPolicyAdapter(data,contextProvider){
    var nextRunAt = data.schedule && new Date(data.schedule).toISOString() || null;
    var _mmsid = data.msg;
    var _job = {
                "info": {
                    "msg": _mmsid,
                    "data": data,
                    "context": contextProvider.toJSON()
                },
                "type":data.type,
                "status": "created",
                "scheduledOn": Number(data.schedule),
                "name": data.type+"_"+data.orgId
            };

    var jobmeta = {
                "data" : _job,
                "lastFinishedAt" : Date.now(),
                "lastModifiedBy" : null,
                "lastRunAt" :"",
                "lockedAt" : null,
                "name" : data.type,
                "nextRunAt" : nextRunAt,
                "priority" : 0,
                "type" : "normal"
            };
    return jobmeta;
}

var schedulerService = {
    scheduleMessageJob : function(data,_contextProvider,callback){
        var ScheduleJobsModel;
        var jobmeta = agendaAdapter(data,_contextProvider); 
        ScheduleJobsModel = ModelFactory.getScheduleJobsModel(_contextProvider);    
        ScheduleJobsModel.createScheduledJob(jobmeta,function(err){
            callback(err);
        });
    },
    scheduleMsgExpireJob : function(data,_contextProvider,callback){
        var ScheduleJobsModel;
        var jobmeta = agendaAdapter(data,_contextProvider); 
        ScheduleJobsModel = ModelFactory.getScheduleJobsModel(_contextProvider);    
        ScheduleJobsModel.createScheduledJob(jobmeta,function(err){
            callback(err);
        });
    },
    schedulePwdExpireJob : function(data,_contextProvider,callback){
        var ScheduleJobsModel;
        var jobmeta = agendaPolicyAdapter(data,_contextProvider); 
        ScheduleJobsModel = ModelFactory.getScheduleJobsModel(_contextProvider); 
        console.log("Job created for schedulePwdExpireJob............................. ");
        ScheduleJobsModel.createScheduledJob(jobmeta,function(err){
            callback(err);
        });
    },
    schedulePwdPolicyChangeJob : function(data,_contextProvider,callback){
        var ScheduleJobsModel;
        var jobmeta = agendaPolicyAdapter(data,_contextProvider); 
        ScheduleJobsModel = ModelFactory.getScheduleJobsModel(_contextProvider); 
        console.log("Job created for schedulePwdPolicyChangeJob............................. ");
        ScheduleJobsModel.createScheduledJob(jobmeta,function(err){
            callback(err);
        });
    },
    scheduleADsyncJob : function(data,_contextProvider,callback){
        var ScheduleJobsModel;
        var jobmeta = agendaPolicyAdapter(data,_contextProvider); 
        ScheduleJobsModel = ModelFactory.getScheduleJobsModel(_contextProvider); 
        console.log("Job created for scheduleADsyncJob............................. ",data);
        ScheduleJobsModel.createScheduledJob(jobmeta,function(err){
            callback(err);
        });
    },
    schedulePostJob : function(data,_contextProvider,callback){
        var ScheduleJobsModel;
        var jobmeta = postAgendaAdapter(data,_contextProvider); 
        ScheduleJobsModel = ModelFactory.getScheduleJobsModel(_contextProvider);    
        ScheduleJobsModel.createScheduledJob(jobmeta,function(err){
            callback(err);
        });
    },
    schedulePostExpireJob : function(data,_contextProvider,callback){
        var ScheduleJobsModel;
        var jobmeta = postAgendaAdapter(data,_contextProvider); 
        ScheduleJobsModel = ModelFactory.getScheduleJobsModel(_contextProvider);    
        ScheduleJobsModel.createScheduledJob(jobmeta,function(err){
            callback(err);
        });
    },
    scheduleCommentJob : function(data,_contextProvider,callback){
        var ScheduleJobsModel;
        var jobmeta = commentAgendaAdapter(data,_contextProvider); 
        ScheduleJobsModel = ModelFactory.getScheduleJobsModel(_contextProvider);  
        console.log("Job created for scheduleCommentJob."); 
        ScheduleJobsModel.createScheduledJob(jobmeta,function(err){
            callback(err);
        });
    },
    scheduleCommentExpireJob : function(data,_contextProvider,callback){
        var ScheduleJobsModel;
        var jobmeta = commentAgendaAdapter(data,_contextProvider); 
        ScheduleJobsModel = ModelFactory.getScheduleJobsModel(_contextProvider);
        console.log("Job created for scheduleCommentExpireJob.");   
        ScheduleJobsModel.createScheduledJob(jobmeta,function(err){
            callback(err);
        });
    }
};

module.exports = schedulerService;
