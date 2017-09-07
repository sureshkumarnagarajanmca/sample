/*global AppLogger*/
var Strategy = require('./Strategy.js');
var util = require('util');
var _ = require('lodash');
var utils = require('../../../../utils');

function MessageStrategy() {
    this.name = 'message';
}
util.inherits(MessageStrategy, Strategy);

var shortenType = {
    messages: 'm',
    thread_addparticipation: 'ta',
    thread_remparticipation: 'trp',
    thread_owner: 'to',
    screenshot: 'ss'
};

/**
 * Notify Message event
 *
 * @method notify
 * @param {Object} notification
 */
MessageStrategy.prototype.notify = function(notification, options, callback) {
    AppLogger.trace('Notification service: push notifications args preparation in message strategy started');
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
            var namespaceId = notification.body.namespaceId;
            // TODO should find a better way to identify team chats
            var isTeamChat = namespaceId ? namespaceId.slice(0,2) !== 'o-':false;
            nf.customdata = {
                t: shortenType[notification.type.event],
                uid: c.id,
                mid: notification.body && notification.body.messageId || notification.body.id
            };
            if(isTeamChat) nf.customdata.nid= namespaceId;
            else  nf.customdata.tid= notification.body.threadId;

            if(notification.type.event === 'screenshot'){ // send messageIf if screenshot alert
                delete nf.customdata.tid;
                nf.customdata.mid = notification.body.messageId || notification.body.id;
            }
        }
        AppLogger.trace('Notification service: push notifications args preparation in message strategy done');
        // publish through push notification channel
        self.publish("Pns", nf, callback);
    });
};

module.exports = new MessageStrategy();