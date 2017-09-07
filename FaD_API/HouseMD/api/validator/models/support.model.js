/**
 * Created by sai on 3/17/16.
 */
module.exports = {
    "supportObject" : {
        "id": "supportObject",
        "type": "object",
        "properties": {
            "email": {
                "type": "string",
                "description": "enter emailId",
                "required" : true
            },
            "message" : {
                "type" : "string",
                "description" : "Enter email Id",
                "required" : true
            },
            "name"  : {
                "type" : "string",
                "description" : "Enter your name",
                "required" : true
            }
        },
    }
};
