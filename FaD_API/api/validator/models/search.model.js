/**
 * Created by sai on 3/17/16.
 */
module.exports = {
    "search": {
        "id": "search",
        "type": "object",
        "properties": {
            "lat": {
                "type": "number",
                "description": "Enter the latitude of the location"
                // ,"required" : true
            },
            "lon": {
                "type": "number",
                "description": "Enter the logitude of the location"
                // ,"required" : true
            },
            "specId": {
                "type": "string",
                "description": "Enter taxonomy code"
            },
            "radius": {
                "type": "string",
                "description": "Enter radius in miles"
            },
            "from": {
                "type": ["number","string"],
                "description": "page number",
                "default" : 0
            },
            "size": {
                "type": "number",
                "description": "number of results per page"
            },
            "npi": {
                "type": "string",
                "description": "Enter the npi"
            },
            "name": {
                "type": "string",
                "description": "search on  name"
            },
            "gender": {
                "type": "string",
                "description": "search on gender"
            },
            "insuranceId": {
                "type": "string",
                "description": "search on insurance"
            },
            "language" : {
               "type": "number",
                "description": "id of language"
             },
            "boardCertification": {
                "type": "boolean",
                "description": "board certification filter"
            },
            "sortType" : {
                "type" : "string",
                "description" : "sort type ascor Desc",
                "enum" : ["asc", "desc"]
            },
            "sortName"  :{
                "type" : "string",
                "description" : "enter the sort parameter",
                "enum" : ["distance","fName","lName"]
            }
        }
    },
    "serachObj" : {
        "id": "serachObj",
        "type": "object",
        "properties": {
            "params": {
                "$ref": "search"
            }
        },
    }
};
