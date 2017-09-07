var Strategy = require('./Strategy.js');
var util = require('util');

function RecallStrategy() {}
util.inherits(RecallStrategy, Strategy);

/**
 * Notify Recall Message event
 *
 * @method notify
 * @param {Object} notification
 */
RecallStrategy.prototype.notify = function(notification) {
    var userarray = [ notification.data.to];
    var nf = {
        userIds:   userarray, 
        publishTo: ["presence"]
    };
    nf.message = notification.message || 'Recall'; 
    nf.customdata = {
        event_type: notification.event_type, 
        action: notification.action, 
        data: notification.data,
        uid: notification.data.to
    };
    this.publish("Pns", nf);
};

module.exports = new RecallStrategy();
