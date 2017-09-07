/**
 * Created by pradeep on 3/17/16.
 */
module.exports = {
    "certification":{
        "id": "certification",
        "type": "object",
        "properties": {
            "name": {
                "type": "String",
                "description": "Enter your Certiification name",
                "required" : true
            },
           "specialities" : {
                "type": "array",
                "items":{"$ref": "specialitiesCertificationsObject"},
                "required" : true
            }
        }
    },
 "specialitiesCertificationsObject" : {
        "id": "specialitiesCertificationsObject",
        "type": "object",
        "properties" :{
            "taxonomyString" : {
                "type": "string",
                "description" : "taxonomy name"
            },
            "status" : {
                "type": "string",
                "description" : "certificationStatus"
            },
            "taxonomyCode" : {
                "type": "string",
                "description":"TAXONOMYIDS"
            }
        }
    }
}