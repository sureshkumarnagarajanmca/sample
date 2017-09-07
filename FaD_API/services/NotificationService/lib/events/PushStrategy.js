var Strategy = require('./Strategy.js');
var _ = require('lodash');
var util = require('util');
var utils = require('../../../../utils');

function PushStrategy() {}
util.inherits(PushStrategy, Strategy);


var shortenType = {
    messages: 'm',
    thread_participation: 'mth',
    thread_owner: 'to',
    screenshot: 'ss',
    password_expiry: 'pe',
    pwdpolicy_change: 'pch',
    managed_by_enterprise:'me',
    unmanaged_by_enterprise:'ume',
    msg_rule_change: 'mrc'
};

/**
 * Push notification
 * @param  {Object} notification [description]
 *                               {
 *                                   to,
 *                                   ksIds : {userId: ksId},
 *                                   message: "text message",
 *                                   body: {}
 *                                   templatename: "template name",
 *                                   templatedata: {}
 *                               }
 */
PushStrategy.prototype.notify = function(notification, options, callback) {
    var contacts = notification.to,
        self = this;
    //send notifications for each reciepients
    var userIds = [];
    var ksids = [];
    contacts.forEach(function(c) {
        var notificaitonSettings = c.settings.notifications;
        // validate notification is enabled or not
        if (notificaitonSettings && !notificaitonSettings.enable) {
            return;
        } else if (notificaitonSettings && notificaitonSettings.enable &&
            notificaitonSettings.muteTime && utils.getDate(notificaitonSettings.muteTime) > new Date()) {
            return;
        }
        
        userIds.push(c.id);
        ksids.push.apply(ksids, notification.ksids[c.id]);
        ksids = _.unique(ksids); // get unique ksids to avoid duplicate notificaions
        var templatedata = notification.templatedata;
        
        var nf = {
            message: notification.message || (notification.body && notification.body.message),
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
        if(notification.customdata){
            nf.customdata = notification.customdata;
        }
        
        nf.customdata = nf.customdata || {};

        nf.customdata.t=  shortenType[notification.type.event];
        nf.customdata.uid =  c.id;

        // publish through push notification channel
        self.publish("Pns", nf, callback);

    });
};

module.exports = new PushStrategy();
