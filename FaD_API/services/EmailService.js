/*global _appConsts:true*/

function nconfig(){
    return this.config;
}

var config = _appConsts.emailConfig,
    nodemailerModule = require('nodemailer'),
    nodemailer,
    ejs = require('ejs'),
    fs = require('fs'),
    LAYOUT_DIR = _appConsts.webdir.layouts + '/',
    EMail_Types = {
        "VerifyEmail": {
            subject: "client: Please confirm your email address",
            layout: 'InviteToJoin.html'
        },
        "PasswordReset": {
            subject: "client: Reset Password",
            layout: 'ResetPassword.html'
        }
    },
    allowedDomains=nconfig().email.allowedDomains;


// Setup SMTP server
nodemailer = nodemailerModule.createTransport('SMTP', {
    debug: config.SMTPdebug,
    host: config.SMTPHost,
    port: config.SMTPPort,
    ignoreTLS: !config.SMTPisTLS,
    use_authentication: config.SMTPauthentication,
    //ssl: false,
    //
    // added the office service into wellknowns.js as a temp fix
    //service:'Office',
    auth:{
        user: config.SMTPUserName,
        pass: config.SMTPUserPassword
    }
    //requiresAuth: config.SMTPauthentication
});

function isAllowedDomain(emailId){
    var _at_idx , domain;
    if(!emailId || typeof emailId!=='string'){
        return false;
    }

    _at_idx = emailId.lastIndexOf('@');

    if(_at_idx==-1){
        return false;
    }

    domain = emailId.substring(_at_idx+1);

    if(allowedDomains[domain]){
        return true;
    }
    return false;
}

//@temp - Override to not allow any emails outside client and gmail domains -- START
//var nodemailer_send = nodemailer.sendMail.bind(nodemailer);
//var nodemailerModule_send = nodemailerModule.sendMail.bind(nodemailerModule);

nodemailer.sendMail__ = nodemailer.sendMail;
nodemailerModule.sendMail__ = nodemailerModule.sendMail;

function sendMail_(message , callBack){
    var toList , allowedTo , emailsIgnored;

    callBack = callBack || function(){};
    emailsIgnored = [];
    toList = message.to;
    toList = (typeof toList === 'string')? toList.split(','):undefined;

    if(!toList){
        callBack(null);
        return;
    }

    allowedTo='';

    toList.forEach(function(emailId){
        if(isAllowedDomain(emailId)){
            allowedTo+=(emailId)+',';
            return;
        }
        emailsIgnored.push(emailId);
    });

    if (emailsIgnored.length > 0) {
        console.log("=====================================");
        console.log("List of Emails Ignored %j", emailsIgnored );
        console.log("=====================================");
    }

    if(allowedTo!==''){
        console.log("=====================================");
        console.log("List of Emails considered %j", allowedTo );
        console.log("=====================================");
        message.to = allowedTo;
        this.sendMail__(message , callBack);
        return;
    }
    callBack(null);
}

//overide only incase allowedDomains is an object
if(allowedDomains && (typeof allowedDomains === 'object') && Object.keys(allowedDomains).length!==0){
    nodemailer.sendMail = sendMail_;
    nodemailerModule.sendMail = sendMail_;
}
//@temp - Override to not allow any emails outside client and gmail domains --- END

function EmailService() {

}

EmailService.prototype = {
    defaultCallback: function() {
        // Nothing to do
    },
    compileBody: function(layout, options) {
        var _bodyStr;
        try {
            _bodyStr = fs.readFileSync(LAYOUT_DIR + layout, 'utf8');
            _bodyStr = ejs.render(_bodyStr, {
                locals: options
            });
        } catch (e) {
            _bodyStr = "";
        }
        return _bodyStr;
    },
    prepareEmail: function(emailType, props) {
        if (!EMail_Types.hasOwnProperty(emailType)) {
            throw "Invalid Email Type.";
        }
        var _EMAIL = EMail_Types[emailType],
            emailBody = this.compileBody(
                _EMAIL.layout, {
            subject: _EMAIL.subject,
            bagginName: props.name,
            mailTokenLink: (props.VerifyEmailEndPoint || config.VerifyEmailEndPoint),

            token: props.token
        });

        return {
            subject: _EMAIL.subject,
            body: emailBody
        };
    },
    sendInvitationToJoin: function(props, callback) {
        var _callBack = callback || this.defaultCallback,
            _Email, _messageConf;
        try {
            if (!(props && props.name && props.email && props.token)) {
                _callBack({
                    status: 500,
                    error: 'Not enough arguments to continue'
                });
            }

            _Email = this.prepareEmail("VerifyEmail", props);
            _messageConf = {
                sender: config.SMTPsender,
                to: props.email,
                subject: _Email.subject,
                html: _Email.body
            };


            nodemailer.sendMail(_messageConf, _callBack);

            _callBack({
                status: 200,
                message: 'Email sent successfully.'
            });
        } catch (e) {
            _callBack({
                status: 500,
                error: e
            });
        }
    },
    sendPasswordReset: function(props, callback) {
        var _callBack = callback || this.defaultCallback,
            _Email, _messageConf;
        try {
            if (!(props && props.name && props.email && props.token)) {
                _callBack({
                    status: 500,
                    error: 'Not enough arguments to continue'
                });
            }

            _Email = this.prepareEmail("PasswordReset", props);
            _messageConf = {
                sender: config.SMTPsender,
                to: props.email,
                subject: _Email.subject,
                html: _Email.body
            };


            nodemailer.sendMail(_messageConf, _callBack);

            _callBack({
                status: 200,
                message: 'Email sent successfully.'
            });
        } catch (e) {
            _callBack({
                status: 500,
                error: e
            });
        }
    },

    sendAlertEmail: function(props, callback) {
        var _callBack = callback || this.defaultCallback,
            _Email, _messageConf;
        try {
            if (!(props && props.subject && props.email && props.body)) {
                _callBack({
                    status: 500,
                    error: 'Not enough arguments to continue'
                });
            }

            _messageConf = {
                sender: config.SMTPsender,
                to: props.email,
                subject: props.subject,
                html: props.body
            };


            nodemailer.sendMail(_messageConf, _callBack);

            _callBack({
                status: 200,
                message: 'Email sent successfully.'
            });
        } catch (e) {
            _callBack({
                status: 500,
                error: e
            });
        }
    }


};

module.exports = {
    "getInst": function() {
        return (new EmailService());
    }
};
