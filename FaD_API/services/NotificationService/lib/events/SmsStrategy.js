/*global config*/
var Strategy = require('./Strategy.js');
var util = require('util');

function SmsStrategy() {}
util.inherits(SmsStrategy, Strategy);

/**
 * Notify Message event
 *
 * @method notify
 * @param {Object} notification
 */
SmsStrategy.prototype.notify = function(notification) {
    notification.from = config.email.SMTPsender;
    //parse template into notification body/ message
    if (notification.templatename && notification.templatedata) {
        var templatedata = notification.templatedata;
        templatedata.bagginName = templatedata.name;
    }
    //publish notification
    this.publish("Sms", notification);
};

module.exports = new SmsStrategy();