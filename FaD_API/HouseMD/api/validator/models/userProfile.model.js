module.exports = {
    "ContactNumber": {
        "id": "ContactNumber",
        "type": "object",
        "properties": {
            "ctype": {
                "type": "string",
                "description": "type of contact (like Home, work, office, business etc)"
            },
            "cvalue": {
                "type": "string",
                "description": "phone number or mobile number"
            }
        }
    },
    "contactObj": {
        "id": "contactObj",
        "type": "object",
        "description": "Contact number of the user",
        "properties": {
            "primary": {
                "$ref": "ContactNumber"
            },
            "other": {
                "type": "array",
                "items": {
                    "$ref": "ContactNumber"
                }
            }
        }
    },
    "addressObject": {
        "id": "addressObject",
        "type": "object",
        "properties": {
            "street": {
                "type": "string"
            },
            "suiteNo": {
                "type": "string"
            },
            "city": {
                "type": "string"
            },
            "state": {
                "type": "string"
            },
            "zip": {
                "type": "string"
            },
            "country": {
                "type": "string"
            }
        }
    },
    "addressObj": {
        "id": "addressObj",
        "type": "object",
        "description": "additional information of the user",
        "properties": {
            "home": {
                "$ref": "addressObject"
            },
            "work": {
                "$ref": "addressObject"
            },
            "other": {
                "type": "array",
                "items": {
                    "$ref": "addressObject"
                }
            }
        }
    },
    "personalInfo": {
        "id": "personalInfo",
        "type": "object",
        "properties": {
            "firstName": {
                "type": "string",
                "description": "user first name"
            },
            "middleName": {
                "type": "string",
                "description": "user middle name"
            },
            "lastName": {
                "type": "string",
                "description": "user last name"
            },

            "displayName": {
                "type": "string",
                "description": "user display name"
            }
        }
    },
    "userPersonalInfo": {
        "id": "userPersonalInfo",
        "type": "object",
        "properties": {
            "firstName": {
                "type": "string",
                "description": "user first name"
            },
            "middleName": {
                "type": "string",
                "description": "user middle name"
            },
            "lastName": {
                "type": "string",
                "description": "user last name"
            }

        }
    },
    "accountInfo": {
        "id": "accountInfo",
        "type": "object",
        "properties": {
            "jTitle": {
                "type": "string",
                "description": "job title of the user"
            },
            "dept": {
                "type": "string",
                "description": "Department of the user"
            },
            "fax": {
                "type": "string",
                "description": "fax "
            },
            "activationStatus": {
                "type": "string",
                "description": "user status "
            },
            "profImage": {
                "type": "string",
                "description": "user profile image "
            },
        }
    },
    "userAccountInfo": {
        "id": "userAccountInfo",
        "type": "object",
        "properties": {
            "jTitle": {
                "type": "string",
                "description": "job title of the user"
            },
            "dept": {
                "type": "string",
                "description": "Department of the user"
            },
            "fax": {
                "type": "string",
                "description": "fax "
            },
        }
    },
    "additionalFieldObj": {
        "id": "additionalFieldObj",
        "type": "object",
        "properties": {
            "key": {
                "type": "string",
                "description": "additional information key"
            },
            "value": {
                "type": "string",
                "description": "additional information value"
            }
        }
    },
    "userProfileUpdateBody": {
        "id": "userProfileUpdateBody",
        "type": "object",
        "properties": {
            "personalInfo": {
                "$ref": "personalInfo",
                "description": "user personal information"
            },
            "jTitle": {
                "type": "string",
                "description": "job title of the user"
            },
            "shareLocationWith": {
                "type": "string",
                "description": "share Location With ('public','noone','favorites','company','contacts')"
            },
            "rememberMe": {
                "type": "boolean",
                "description": "Remember me Boolean value true/false"
            },
            "clientStatus": {
                "type": "string",
                "description": "status should be Available/Invisible"
            },
            "address": {
               "$ref": "addressObj"
            },
            "contacts": {
                "$ref": "contactObj"
            },
            "additionalFields": {
                "type": "array",
                "description": "additional information for user",
                "items": {
                    "$ref": "additionalFieldObj"
                }
            }
        }
    },
    "orgUserProfileBody": {
        "id": "orgUserProfileBody",
        "type": "object",
        "properties": {
            "personalInfo": {
                "$ref": "userPersonalInfo",
                "description": "user personal information"
            },
            "role": {
                "type": "string",
                "description": "user role"
            },
            "orgDomain": {
                "type": "string",
                "description": "user organization domain"
            },
            "accountInfo": {
                "$ref": "accountInfo",
                "description": " account information"
            },
            "address": {
               "$ref": "addressObj"
            },
            "contacts": {
                "$ref": "contactObj"
            },
            "additionalFields": {
                "type": "array",
                "description": "additional information for user",
                "items": {
                    "$ref": "additionalFieldObj"
                }
            }

        }
    },
    "orgUserProfileUpdateBody": {
        "id": "orgUserProfileUpdateBody",
        "type": "object",
        "properties": {
            "personalInfo": {
                "$ref": "userPersonalInfo",
                "description": "user personal information"
            },
            "accountInfo": {
                "$ref": "userAccountInfo",
                "description": " account information"
            },
            "address": {
               "$ref": "addressObj"
            },
            "contacts": {
                "$ref": "contactObj"
            },
            "additionalFields": {
                "type": "array",
                "description": "additional information for user",
                "items": {
                    "$ref": "additionalFieldObj"
                }
            },
            "oldStatus": {
                "type": "string",
                "description": "current status of the user"
            },
            "toStatus": {
                "type": "string",
                "description": "change status of the user"
            },
            "oldRole": {
                "type": "string",
                "description": "current Role of the user"
            },
            "toRole": {
                "type": "string",
                "description": "change Role of the userr"
            },
            "statusAlertFlag": {
                "type": "boolean",
                "description": "Email alert will send if statusAlertFlag is set to true"
            },
            "roleAlertFlag": {
                "type": "boolean",
                "description": "Email alert will send if roleAlertFlag is set to true"
            }
        }
    },
    
};