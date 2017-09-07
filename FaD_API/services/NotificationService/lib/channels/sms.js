var request = require('request');
var QueryString = require('querystring');

var contentType = {
    JSON: "application/json",
    RAW: "application/x-www-form-urlencoded; charset=utf-8",
    FORM: "application/x-www-form-urlencoded; charset=utf-8"
};

function Sms(conf) {
    this.config = conf;
    this.options = {
        url: conf.apiEndpoint.replace('{AccountSid}', conf.accountId),
        headers: {
            'Content-Type': contentType[conf.message.contentType],
            'Accept': 'application/json'
        },
        method: 'POST'
    };
    this.options.auth = {
        user: conf.accountId,
        pass: conf.authToken,
        sendImmediately: true
    }
};


Sms.prototype.send = function(args, callback) {
    var config = this.config,
        options, body = {};
    options = this.options;
    if (args.to.substring(0, 1) !== "+") {
        args.to = '+' + args.to;
    }
    if (config.from.substring(0, 1) !== "+") {
        config.from = '+' + config.from;
    }
    body[config.message.from] = QueryString.escape(config.from);
    body[config.message.to] = QueryString.escape(args.to);
    body[config.message.text] = QueryString.escape(args.message);

    if (config.message.contentType.toLowerCase() === 'form') {
        options.body = config.message.from + '=' + body[config.message.from] + '&' + config.message.to + '=' + body[config.message.to] + '&' + config.message.text + '=' + body[config.message.text];
    } else {
        options.body = JSON.stringify(body);
    }
    request.post(options, function(err, response, body) {
        if (typeof callback === 'function') {
            try {
                body = JSON.parse(body);
            } catch (e) {
                err = "error";
            }
            callback(err, body);
        }
    });
};

module.exports = Sms;