/**
 * Created by pradeep on 4/27/16.
 */
module.exports = {
    "AddressH": {
        "id": "AddressH",
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
            "phoneNo" : {
                "type": "string",
                "description": "Contact Number"
            },
            "zipCode" : {
                "type": "string",
                "description": "zip/postal code"
            }
        }
    },

    "hospital": {
        "id": "hospital",
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "description": "Name of the Hospital"
            },
            "address": {
                "$ref": "AddressH",
                 "description": "Address of the Hospital"
            },
            "rating": {
                "type": "string",
                "description": "Hospital Rating"
            }

        }
    }
};

