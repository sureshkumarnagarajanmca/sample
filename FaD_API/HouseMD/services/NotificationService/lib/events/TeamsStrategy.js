/*global AppLogger*/
var Strategy = require('./Strategy.js');
var util = require('util');
var _ = require('lodash');
var utils = require('../../../../utils');

function TeamsStrategy() {
    this.name = 'teams';
}
util.inherits(TeamsStrategy, Strategy);

var shortenType = {
    teamrequest: 'tr',
    teaminvite: 'ti',
    teamownerchange: 'toc',
    teaminviteaccepted: 'tia', //team owner recieves push when member accepts team invitation
    teamacceptrequesttojoin: 'tarj', // team member  recieve push when admin accepts requesttojoin request
    teamremovemember: 'trm'  // team member  recieve push when team admin removes from a team
};

/**
 * Notify Teams event
 *
 * @method notify
 * @param {Object} notification
 */
TeamsStrategy.prototype.notify = function(notification, options, callback) {
    AppLogger.trace('Notification service: push notifications args preparation in teams strategy started');
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
                teamId: notification.body.teamId,
                t: shortenType[notification.type.event],
                uid: c.id
            };
        }
        AppLogger.trace('Notification service: push notifications args preparation in teams strategy done');
        // publish through push notification channel
        self.publish("Pns", nf, callback);
    });
};

module.exports = new TeamsStrategy();