/*global config*/
var Strategy = require('./Strategy.js');
var util = require('util');

function EmailStrategy() {}
util.inherits(EmailStrategy, Strategy);

/**
 * Notify Message event
 *
 * @method notify
 * @param {Object} notification
 */
EmailStrategy.prototype.notify = function(notification) {
    notification.from = notification.from || config.email.SMTPsender;
    //parse template into notification body/ message
    if (notification.templatename && notification.templatedata) {
        var templatedata = notification.templatedata;
        templatedata.bagginName = templatedata.name;
    }
    //publish notification
    this.publish("Email", notification);
};

module.exports = new EmailStrategy();