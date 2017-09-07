/*
 *errors to be handled at api/rest
 */

module.exports = {
    'NotModified': {
        'message': 'Not Modified',
        'statusCode': 304,
        'customCode': 304
    },
    'BadRequest': {
        'message': 'Bad Request',
        'statusCode': 400,
        'customCode': 400
    },
    'Unauthorized': {
        'message': 'Unauthorized',
        'statusCode': 401,
        'customCode': 401
    },
    'Forbidden': {
        'message': 'Forbidden',
        'statusCode': 403,
        'customCode': 403
    },
    'NotFound': {
        'message': 'Not Found',
        'statusCode': 404,
        'customCode': 404
    },
    'MethodNotAllowed': {
        'message': 'Method Not Allowed',
        'statusCode': 405,
        'customCode': 405,
    },
    'Conflict': {
        'message': 'Request could not be completed due to current state of the resource',
        'statusCode': 409,
        'customCode': 409
    },
    'Gone': {
        'message': 'Resource Gone',
        'statusCode': 410,
        'customCode': 410
    },
    'TooManyRequests': {
        'message': 'Too Many Requests',
        'statusCode': 429,
        'customCode': 429
    },
    'Internal': {
        'message': 'Internal Server Error',
        'statusCode': 500,
        'customCode': 500
    },
    'NotImplemented': {
        'message': 'Not Implemented',
        'statusCode': 501,
        'customCode': 501
    },
    'ServiceUnavailable': {
        'message': 'Service Unavailable',
        'statusCode': 503,
        'customCode': 503
    },
    'ValidationError':{
        "message": 'Validation errors/ Invalid arguments',
        'statusCode': 412,
        'customCode': 'ValidationError'
    }
};
