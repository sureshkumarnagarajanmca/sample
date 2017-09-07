/**
 * Created by pradeep on 3/25/16.
 */
module.exports = {
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
    "logout":{
        "id": "logout",
        "type": "object",
        "properties": {
            "userId": {
                "type": "string",
                "description": "Enter your userId",
                "required" : true
            }
        }
    },
    "refreshToken":{
        "id": "refreshToken",
        "type": "object",
        "properties": {
            "refreshToken": {
                "type": "string",
                "description": "Enter your refreshToken",
                "required" : true
            }
        }
    },
    "verifyOtp" :{
        "id": "verifyOtp",
        "type": "object",
        "properties": {
            "username": {
                "type": "string",
                "description": "Enter your username",
                "required" : true
            },
            "otp" :{
                "type": "string",
                "description": "Enter your otp",
                "required" : true 
            }
        }
    },
    "verifyOtpOnSignUp" :{
        "id": "verifyOtp",
        "type": "object",
        "properties": {
            "userId": {
                "type": "string",
                "description": "Enter your UserId",
                "required" : true
            },
            "otp" :{
                "type": "string",
                "description": "Enter your otp",
                "required" : true 
            }
        }
    },

    "usersignUp": {
        "id": "usersignUp",
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
            }
        }
    },
    "forgotPassword":{
        "id": "restePassword",
        "type": "object",
        "properties": {
            "userId": {
                "type": "string",
                "description": "Enter your userId",
                "required" : true
            },
            "password": {
                "type": "string",
                "description": "Enter your new password",
                "required" : true
            }
        }
    },
    "restePassword":{
        "id": "restePassword",
        "type": "object",
        "properties": {
            "userId": {
                "type": "string",
                "description": "Enter your userId",
                "required" : true
            },
            "pervPassword": {
                "type": "string",
                "description": "Enter your old password",
                "required" : true
            },
            "newPassword": {
                "type": "string",
                "description": "Enter your new password",
                "required" : true
            }
        }
    }
};