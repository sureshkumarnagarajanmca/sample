/**
 * Created by pradeep on 3/18/16.
 */
module.exports = {
    "insuranceplan": {
        "id": "insuranceplan",
        "type": "object",
        "properties": {
            "providerId": {
                "type": "string",
                "description": "insurance provider id for map"
            },
            "name": {
                "type": "string",
                "description": "insurance plan name"
            },
            "category": {
                "type": "string",
                "description": "this value can be popular or normal. Default value is popular"
            },
            "status": {
                "type": "string",
                "description": "this value provides the status. Default value is true"
            }
        }
    }
};
