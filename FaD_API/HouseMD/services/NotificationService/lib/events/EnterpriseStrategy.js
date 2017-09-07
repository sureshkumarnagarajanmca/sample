/*global AppLogger*/
var Strategy = require('./Strategy.js');
var util = require('util');
var _ = require('lodash');
var utils = require('../../../../utils');

function EnterpriseStrategy() {
    this.name = 'enterprise';
}
util.inherits(EnterpriseStrategy, Strategy);
var shortenType = {
    enterpriserequest: 'er'
};

/**
 * Notify enterprise event
 *
 * @method notify
 * @param {Object} notification
 */
EnterpriseStrategy.prototype.notify = function(notification, options, callback) {
    AppLogger.trace('Notification service: push notifications args preparation in enterprise strategy started');
    var contacts = notification.to;
    var self = this;
    //send notifications for each reciepients
    var userIds = [];
    var ksids = [];
    var messagetype = options && options.messagetype;

    contacts.forEach(function(c) {
        var notificationSettings = c.settings.notifications;
        // validate notification is enabled or not
        if (notificationSettings && !notificationSettings.enable) {
            // check notifications enabled
            return;
        } else if (notificationSettings &&
            notificationSettings.muteTime && utils.getDate(notificationSettings.muteTime) > new Date()) {
            // check notifications muteTime
            return;
        } else if (notificationSettings && notificationSettings[messagetype] && !notificationSettings[messagetype].enable) {
            //check messagetype is enabled for notification
            return;
        }

        userIds.push(c.id);
        ksids.push.apply(ksids, notification.ksids[c.id]);
        ksids = _.unique(ksids); // get unique ksids to avoid duplicate notificaions
        var templatedata = notification.templatedata;
        templatedata.hidepreviewtext = notificationSettings[messagetype] && notificationSettings[messagetype].hidePreviewText;
        templatedata.body = notification.body;
        var nf = {
            ksids: ksids,
            userIds: userIds,
            from: notification.from,
            to: notification.to,
            body: notification.body,
            templatename: notification.templatename,
            templatedata: templatedata,
            publishTo: notification.publishTo || ["push", "presence"]
        };
        //prepare custom data for push notifications
        if (notification.body) {
            nf.customdata = {
                t: shortenType[notification.type.event],
                uid: c.id
            };
        }
        AppLogger.trace('Notification service: push notifications args preparation in teams strategy done');
        // publish through push notification channel
        self.publish("Pns", nf, callback);
    });
};

module.exports = new EnterpriseStrategy();