/*global _appConsts*/
/** *  *  * @Date:  * */
var util = require('util'),
    cache = false,
    kutils = require(config.app.root + '/data/entities/utils')
    , ModelFactory = appGlobals.ModelFactory;

function ClientService() {    
    this.getById = function(clientId, cb) {
        var self = this,
            clientModel;
        clientModel = ModelFactory.getClientsModel(); 
        if (!clientId || 'string' !== typeof clientId) {
            cb(null);
            return;
        }
        clientModel.fetchClientbyId(clientId, function(fetcherr, clientInst) {
            if (fetcherr || !clientInst) {
                cb(null);
                return;
            }
            return cb(clientInst);
        });
    };
}
module.exports = function() {
    if (!cache) {
        cache = new ClientService();
    }
    return cache;
};
