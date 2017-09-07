/**
 * Created by pradeep on 3/17/16.
 */
module.exports = {
    // "user": {
    //     "id": "user",
    //     "type": "object",
    //     "properties": {

    //         "email": {
    //             "type": "string",
    //             "description": "Enter email id, this field used to login",
    //             "required" : true
    //         },
    //         "mobile": {
    //             "type": "string",
    //             "description": "Enter mobile number, this field used to login",
    //             "required" : true
    //         },
    //         "npi": {
    //             "type": "string",
    //             "description": "Enter NPI Id Only for Doctors"
    //         },
    //         "password": {
    //             "type": "string",
    //             "description": "preffered password"
    //         },
    //         "fName": {
    //             "type": "string",
    //             "description": "user first name"
    //         },
    //         "lName": {
    //             "type": "string",
    //             "description": "user last name"
    //         },
    //         "type": {
    //             "type": "string",
    //             "description": "possible options are doctor or user",
    //             "default":"user"
    //         },
    //         "dob": {
    //             "type": "string",
    //             "description": "date of birth in YYYY-MM-DD fromat"
    //         },
    //         "gender": {
    //             "type": "string",
    //             "description": "gender"
    //         }
    //     }
    // },
    "userProfileObject":{
        "id": "userProfileObject",
        "type": "object",
        "properties": {
            // "email": {
            //     "type": "string",
            //     "description": "Enter email id, this field used to login",
            //     "required" : true
            // },
            // "mobile": {
            //     "type": "string",
            //     "description": "Enter mobile number, this field used to login",
            //     "required" : true
            // },
            // "password": {
            //     "type": "string",
            //     "description": "preffered password"
            // },
            "fName": {
                "type": "string",
                "description": "user first name"
            },
            "lName": {
                "type": "string",
                "description": "user last name"
            },
            // "type": {
            //     "type": "string",
            //     "description": "possible options are doctor or user",
            //     "default":"user"
            // },
            "dob": {
                "type": "string",
                "description": "date of birth in YYYY-MM-DD fromat"
            },
            "gender": {
                "type": "string",
                "default":"M",
                "description": "Doctor's gender. Possible options M or F or T. Required field",
                'enum':['M','F','T']
            },
            "imageId": {
                "type": "string",
                "description": "imageId after uploading the image"
            },
            "notifications":{
                "$ref": "notificationType"
            }
        }
    },
    "userLogin": {
        "id": "userLogin",
        "type": "object",
        "properties": {

            "username": {
                "type": "string",
                "description": "Enter email id, this field used to login",
                "required" : true
            },
            "mobile": {
                "type": "string",
                "description": "Enter mobile number, this field used to login",
                "required" : true
            },
            "npi": {
                "type": "string",
                "description": "Enter NPI Id Only for Doctors"
            },
            "password": {
                "type": "string",
                "description": "preffered password"
            },
            "fName": {
                "type": "string",
                "description": "user first name"
            },
            "lName": {
                "type": "string",
                "description": "user last name"
            },
            "type": {
                "type": "string",
                "description": "possible options are doctor or user",
                "default":"user",
                "required" : true
            },
            "countryCode" : {
                "type": "string",
                "description": "possible options are doctor or user"
            },
            "deviceId" : {
                "type": "string",
                "description": "Device id of the user device",
            }
        }
    },
    "login":{
        "id": "login",
        "type": "object",
        "properties": {
            "username": {
                "type": "string",
                "description": "Enter your username",
                "required" : true
            },
            "password": {
                "type": "string",
                "description": "Enter your password",
                "required" : true
            }
        }
    },
    "notificationType":{
        "id": "notificationType",
        "type": "object",
        "properties": {
            "email": {
                "type": "string",
                "default":"Y",
                "description": "Indicator to receive noifications via email",
                "required" : true,
                'enum':['N','Y']
            },
            "mobile": {
                "type": "string",
                "default":"Y",
                "description": "Indicator to receive noifications via mobile",
                "required" : true,
                'enum':['N','Y']
            },
        }
    }
};