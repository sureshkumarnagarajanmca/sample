/**
 * Created by pradeep on 3/17/16.
 */
module.exports = {
    "location": {
        "id": "location",
        "type": "object",
        "properties": {
            "lat" : {
                "type": "string",
                "description": "lattitude"
            },
            "lon" : {
                "type": "string",
                "description": "langitude"
            }
        }
    },
    "Address": {
        "id": "Address",
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
            },
            "locationCode" : {
                "type": "string",
                "description": "Location Code"
            },
            "location":{
                "$ref" : "location"
            }
        }
    },
    "licence" : {
        "id": "licence",
        "type": "object",
        "properties" :{
            "state" : {
                "type": "string",
                "description" : "State code of the licenced"
            },
            "number" : {
                "type": "string",
                "description" : "Licence number"
            }
        }
    },
    "organization": {
        "id": "organization",
        "type": "object",
        "properties": {
            "npi": {
                "type": "string",
                "description": "npi of the organizaton"
            },
            "taxonomy" : {
                "type": "array",
                "description": "list of practice address",
                "items":{"type": "string"}
            },
            "hsopitalAffliationNumber": {
                "type": "string",
                "description": "hsopitalAffliationNumber of the organizaton"
            },
            "licenceNumbers" : {
                "type": "array",
                "description" : "list of licences registered states details",
                "items" :{"$ref": "licence"}
            },
            "description": {
                "type": "string",
                "description": "MEDICARE PROVIDER/SUPPLIER TYPE DESCRIPTION Ex:General Acute Care Hospital"
            },
            "orgName": {
                "type": "string",
                "description": "organization name",
                "required" : true
            },
            "orgOtherName": {
                "type": "string",
                "description": "organization other name if any"
            },
            "rating":{
                "type": "string",
                "description": "organization rating"
            },
            "address": {
                "$ref": "Address",
                "description": "organization location address"
            },
            "pracAddress": {
                "$ref": "Address",
                "description": "organization practise location address"
            },
            "lastUpdateDate": {
                "type": "string",
                "description": "last updated name"
            },
            "authOffLastName": {
                "type": "string",
                "description": "auth last name"
            },
            "authOffFirstName": {
                "type": "string",
                "description": "auth First Name"
            },
            "authOffMiddleName": {
                "type": "string",
                "description": "auth Middle Name"
            },
            "authOffTphoneNum": {
                "type": "string",
                "description": "auth number"
            },
            "authOffTitleorPosition": {
                "type": "string",
                "description": "auth postion"
            },
            "isOrgSubpart": {
                "type": "string",
                "description": "is sub part"
            }
        }
    },
    "organizationCreate": {
        "id": "organizationCreate",
        "type": "object",
        "properties": {
            "npi": {
                "type": "string",
                "description": "npi of the organizaton"
               
            },
            "taxonomy" : {
                "type": "array",
                "description": "list of practice address",
                "items":{"type": "string"}
            },
            "hsopitalAffliationNumber": {
                "type": "string",
                "description": "hsopitalAffliationNumber of the organizaton"
            },
            "licenceNumbers" : {
                "type": "array",
                "description" : "list of licences registered states details",
                "items" :{"$ref": "licence"}
            },
            "description": {
                "type": "string",
                "description": "MEDICARE PROVIDER/SUPPLIER TYPE DESCRIPTION Ex:General Acute Care Hospital"
            },
            "orgName": {
                "type": "string",
                "description": "organization name",
                "required" : true
            },
            "orgOtherName": {
                "type": "string",
                "description": "organization other name if any"
            },
            "rating":{
                "type": "string",
                "description": "organization rating"
            },
            "address": {
                "$ref": "Address",
                "description": "organization location address"
            },
            "pracAddress": {
                "$ref": "Address",
                "description": "organization practise location address"
            },
            "lastUpdateDate": {
                "type": "string",
                "description": "last updated name"
            },
            "authOffLastName": {
                "type": "string",
                "description": "auth last name"
            },
            "authOffFirstName": {
                "type": "string",
                "description": "auth First Name"
            },
            "authOffMiddleName": {
                "type": "string",
                "description": "auth Middle Name"
            },
            "authOffTphoneNum": {
                "type": "string",
                "description": "auth number"
            },
            "authOffTitleorPosition": {
                "type": "string",
                "description": "auth postion"
            },
            "isOrgSubpart": {
                "type": "string",
                "description": "is sub part"
            }
        }
    }
};

