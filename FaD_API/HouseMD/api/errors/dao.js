/*
 * errors to be handled at dao
 */

module.exports = {
    'RecordNotFound': {
        'customCode': 404,
        'statusCode': 404
    },
    'DBError': {
        'customCode': 508,
        'statusCode': 500
    },
    'Duplicate': {
        'customCode': 422
    },
    'InvalidUsers': {
        'customCode': 400,
        'statusCode': 400
    },
    'NoUpdateArguments' : {
        'message': 'Nothing to Update',
        'statusCode': 400,
        'customCode': 404
    },
    'NoMatchConditions' : {
        'customCode': 404
    }
};
