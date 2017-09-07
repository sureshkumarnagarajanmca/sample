var nodemailer = require('nodemailer');

function Email(conf) {
    nodemailer.SMTP = {
        debug: conf.SMTPdebug,
        host: conf.SMTPHost,
        port: conf.SMTPPort,
        //ssl: conf.SMTPisSSL,
        ignoreTLS: !conf.SMTPisTLS,
        use_authentication: conf.SMTPauthentication,
        auth: {
            user: conf.SMTPUserName,
            pass: conf.SMTPUserPassword
        }
    };
};

Email.prototype.send = function(args, callback) {
    var options = {
        from: args.from || config.email.SMTPsender,
        to: args.to,
        subject: args.subject,
        html: args.message
    };
    if (args.replyTo) {
        options.replyTo = args.replyTo;
    }
    nodemailer.sendMail(options, function(err, res) {
        if (typeof callback === 'function') {
            callback(err, res);
        }
    });
};

module.exports = Email;