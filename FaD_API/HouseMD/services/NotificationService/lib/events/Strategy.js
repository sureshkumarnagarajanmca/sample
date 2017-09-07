/*global config, AppLogger*/

var ejs = require('ejs');
var baseURL = config.app.baseURL;

// Available chanels (Email, Sms, Push notificaiton)
var NotificationChannels = require('../notificationchannels.js')(config);

/**
 * @desc Base event strategy
 *
 * @class BaseEventStrategy
 * @constructor
 */
function Strategy() {}

Strategy.prototype.notify = function() {
    throw new Error("'" + this.name + "'" + 'notify needs to be overridden.');
};

/**
 * @desc Parse template method. Parse given template with template data and generate needed payload
 *
 * @method parseTemplate
 * @param {String} template Template string (html/ text)
 * @param {Object} data Data to parse template
 */
Strategy.prototype.parseTemplate = function(template, data) {
    // parse template using ejs template engine
    var result = ejs.render(template, {
        locals: data
    });
    return result;
};

/**
 * @desc Publish method. Publish event to the specied channel(s)
 *
 * @method publish
 * @param {String} channel Notification channel to publish event
 * @param {String} template Template string (html/ text)
 * @param {Object} data Data to parse template
 */
Strategy.prototype.publish = function(channel, notification, callback) {
    //get notification templatestring.
    var templateInfo = config.templates[channel.toLowerCase()][notification.templatename];
    if (notification.templatestring) {
        templateInfo.template = notification.templatestring;
    }
    //validate notification contains template and template data
    if (templateInfo && notification.templatedata) {
        notification.subject = notification.templatedata.subject = notification.templatedata.subject || templateInfo.subject || '';

        notification.templatedata.mailTokenLink = baseURL + '/' + templateInfo.relativeUrl;

        var urlQueryString = notification.templatedata.urlQueryString;

        //construct mail link
        if (urlQueryString) {
            notification.templatedata.mailTokenLink += (urlQueryString[0].toLowerCase() === '?' ? urlQueryString : '?' + urlQueryString);
        }

        //parse template into actual message content
        notification.message = this.parseTemplate(templateInfo.template, notification.templatedata);
    }
    // send notificaiton through given channel
    NotificationChannels[channel].send(notification, function(err, res) {
        if (err) {
            AppLogger.error({resource: 'NotificationStrategy', action: 'Send', channel: channel, err: err});
        }
        if (typeof callback === 'function') {
            callback(err, res);
        }
    });
};

module.exports = Strategy;
module.exports.NotificationChannels = NotificationChannels;
