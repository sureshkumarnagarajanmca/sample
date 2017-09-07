/**
 * Created by pradeep on 3/17/16.
 */
module.exports = {
    "addInsurance": {
        "id": "addInsurance",
        "type": "object",
        "properties": {
            "_id": {
                "type": "string",
                "description": "insurance provider unique id"
            },
            "name": {
                "type": "string",
                "description": "insurance provider name"
            },
            "category": {
                "type": "number",
                "description": "this value can be 10 or 0"
            },
            "payerId" : {
                "type": "string",
                "description": "this is the payer id of the insurance"
            }
        }
    }
};
