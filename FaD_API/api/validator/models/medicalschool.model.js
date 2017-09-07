/**
 * Created by pradeep on 4/27/16.
 */
module.exports = {
    "AddressMS": {
        "id": "AddressMS",
        "type": "object",
        "additionalProperties": false,

        "properties": {
            "Line1StreetAddress" : {
                "type" :"string",
                "description": "Address Line 1"
            },
            "Line2StreetAddress" : {
                "type" :"string",
                "description": "Address Line 2"
            },
            "city" : {
                "type" :"string",
                "description": "City code"
            },
            "state" : {
                "type" :"string",
                "description": "City code"
            },
            "countyName" : {
                "type" :"string",
                "description": "Name of the countyName"
            },
            "country" : {
                "type" :"string",
                "description": "Name of the country"
            },
            "zipCode" : {
                "type": "string",
                "description": "zip/postal code"
            }
        }
    },

    "medicalSchool": {
        "id": "medicalSchool",
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "description": "Name of the MedicalSchool"
            },
            "address": {
                "$ref": "AddressMS",
                 "description": "Address of the MedicalSchool"
            }
            

        }
    }
};

