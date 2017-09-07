/*global AppLogger*/
var Strategy = require('./Strategy.js');
var util = require('util');

function DataSyncStrategy() {}
util.inherits(DataSyncStrategy, Strategy);

/**
 * Notify Read Receipt Message event
 *
 * @method notify
 * @param {Object} notification
 */
DataSyncStrategy.prototype.notify = function(notification) {
    var userarray = [ notification.data.msg.sender];
    var nf = {
        userIds:   userarray, 
        publishTo: ["presence"]
    };
    nf.message = notification.message; 
    nf.customdata = {
        event_type: notification.event_type, 
        action: notification.action, 
        data: notification.data 
    };
    this.publish("Pns", nf);
};

module.exports = new DataSyncStrategy();