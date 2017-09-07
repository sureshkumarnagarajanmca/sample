module.exports = {
    "appointmentObject": {
        "id": "appointmentObject",
        "type": "object",
        "properties": {
            "doctorId": {
                "type": "string",
                "description": "Enter thedoctor Id",
                "required":true
            },
            "startTime": {
                "type": "number",
                "description": "the selected slot time and date in date format",
                "required":true
            },
            "orgId": {
                "type": "string",
                "description": "Enter the organisation id",
                "required":true
            },
            "endTime": {
                "type": "number",
                "description": "the selected slot time and date in date format",
                "required":true
            },
            "consultingForUser" : {
                "type": "boolean",
                "description": "the selected slot time and date in date format",
                "required":true
            },
            "InsuranceId" : {
                "type": "string",
                "description": "insurance Id"
            },
            "reason" : {
                "type" : "string",
                description : "enter the reason you are visitn doctor"
            },
            "message" : {
                type : "string",
                description : "Enter the message for doctor"
            },
            "speciality" : {
                type : "string",
                description : "Enter the Speciality selected",
                "required":true
            },
            "appointmentCancellationStatus":{
                "type": "boolean",
                "description": "patient guardian or not indicator"
            },
            "patientInfo" : {
                "$ref": "patientInfo"
            },
            "paymentMode" :{
                type : "string",
                description:"payment ype is it insurance or cash",
                enum : ['insurance','cash'],
                "required":true
            }
        }
    },
    "patientInfo" : {
        "id": "patientInfo",
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "description": "Enter the name of the patient"
            },
            "dob": {
                "type": "string",
                "description": "enter the patient date of birth"
            },
            "emailId": {
                "type": "string",
                "description": "Enter the email-id of the patient"
            },
            "gender": {
                "type": "string",
                "description": "enter the patient Gender",
                enum : ['M','F','']
            },
            "patientGuardian" : {
                "type": "boolean",
                "description": "patient guardian or not indicator"
            }
        }
    }
    // "insuranceObject" : {
    //     "id": "insuranceObject",
    //     "type": "object",
    //     "properties": {
    //         "name": {
    //             "type": "string",
    //             "description": "Enter the name of the insurance"
    //         },
    //         "id": {
    //             "type": "string",
    //             "description": "enter the insurance Id"
    //         },
    //         "plan" : {
    //             "type": "string",
    //             "description": "insurance plan name or Id"
    //         }
    //     }
    // }
};