/**
 * This file contains function to return required services
 *
 * @Date: 07-05-2012
 */



function serviceLookup(serviceName) {
    var _service;
    try{
        switch (serviceName) {
            case 'Email':
                _service = require('./EmailService').getInst();
                break;

            case 'EncryptDecrypt':
                _service = require('./EncryptDecrypt');
                break;

            case 'SchedulerService':
                _service = require('./Scheduler');
                break;

            default:
                _service = function() {
                };
                break;
        }
    }catch(e){
        _service = function() {
        };
    }
    return _service;
}

// Exports
module.exports = {
    'getService' : function(serviceName) {
        return (serviceLookup(serviceName));
    }
};
