module.exports = {
    "Authorization": {
        "id": "Authorization",
        "type": "object",
        "properties": {
            "accessToken": {
                "type": "string",
                "required": true,
                "description": "Oauth 2.0 access token"
            },
            "refreshToken": {
                "type": "string",
                "required": false,
                "description": "Oauth 2.0 refresh token"
            },
            "token_type": {
                "type": "string",
                "required": true,
                "description": "token type"
            },
            "expires_in": {
                "type": "number",
                "required": false,
                "description": "number of seconds left in the lifetime of the access token"
            },
            "expiresDate": {
                "type": "Date",
                "required": false,
                "description": "date of expiration"
            },
            "resourceOwnerID": {
                "type": "string",
                "required": true,
                "description": "userid of the client Application User"
            },
            "accountId": {
                "type": "string",
                "required": true,
                "description": "accountId of the client Application User"
            }

        }
    },

    "Auth": {
        "id": "Auth",
        "type": "object",
        "additionalProperties": false,
        "properties": {
            "username": {
                "type": "string"
            },
            "password": {
                "type": "string"
            },
            "client_id": {
                "type": "string",
                "required": true
            },
            "client_secret": {
                "type": ["string", "integer"],
                "required": true
            },
            "scope": {
                "type":"string",
                "required":true
            },
            "grant_type" : {
                "description" : "oauth 2.0 grant types",
                "type" : "enum",
                "enum" : ["password" , "refresh_token"],
                "required" : true
            },
            "refresh_token": {
                "description" : "is required if grant_type===\"refresh_token\" ",
                "type": "string"
            },
            "remember": {
                "type": ["string", "boolean"]
            }
        }
    },
    "AuthResponse": {
        "id": "AuthResponse",
        "type": "object",
        "properties": {
            "authorization": {
                 "$ref": "Authorization"
            }
        }

    }
};