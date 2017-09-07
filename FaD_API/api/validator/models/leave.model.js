/**
 * Created by sai on 3/17/16.
 */
module.exports = {
    "leaveObject": {
        "id": "leaveObject",
        "type": "object",
        "properties": {
            "orgId" : {
                type : "string",
                description: "Please Enter organization Id",
                "required" : true
            },
            "startTime":{
                type : "number",
                description : "Please leave start date",
                "required" : true
            },
            "endTime" : {
                type : "number",
                description : "Please enter leave End Date",
                "required" : true
            },
            "leaveType":{
                type : "string",
                description : "Please enter leave type",
                enum : ["Urgent", "Planned"],
                "required" : true
            }
        }
    }
};