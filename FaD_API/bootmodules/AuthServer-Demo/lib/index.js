/**
 * This file contains function to return required services
 *
 * @Date: 07-05-2012
 */

// Imports
var ClientService = require('./ClientService.js'),
    AuthorizationService = require('./AuthorizationService.js'),
    //MembershipService = require('./MemberShipService.js'),
    TokenService = require('./TokenService.js');

function NoService(){

}

function serviceLookup(serviceName) {
    var _service, _dummy = {};

    if (!serviceName || serviceName === '') {
        throw new Error('serviceName required');
    }

    switch (serviceName) {
        case 'client':
            _service = ClientService();
            break;

        case 'authorization':
            _service = AuthorizationService();
            break;

        case 'token':
            _service = TokenService();
            break;

        default:
            _service = NoService;
            break;
    }
    return _service;
}

// Exports
module.exports = {
    'getService': function(serviceName) {
        return (serviceLookup(serviceName));
    }
};
