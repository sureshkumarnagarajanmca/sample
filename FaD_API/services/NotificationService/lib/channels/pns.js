/*global AppLogger*/
var kms, presence, log = {
    resource: "Messages",
    action: "Send"
};
var AWS = require('aws-sdk');
var Promise = require('bluebird');

function Sns(conf) {
    var SUPPORTED_PLATFORMS = {
        android: 'gcm',
        androidgcm: 'gcm',
        ios: 'apns',
        iphone: 'apns'
    };
    var arns = conf.platformApplicationArns;
    var sns = new AWS.SNS({
        accessKeyId: conf.accessKeyId,
        secretAccessKey: conf.secretAccessKey,
        region: conf.region,
        apiVersion: conf.apiVersion,
        logger: AppLogger
    });

    var existingEndpointRegex = new RegExp(/Reason: Endpoint (.+) already exists with the same Token/);
    var awsSnsArnRegex = new RegExp(/^arn:aws:sns:/);


    function createPlatformEndpointP(params) {
        return new Promise(function(resolve, reject) {
            sns.createPlatformEndpoint(params, function(err, data) {
                AppLogger.trace('PushNotification: createPlatformEndpointP : ', {error: err, data: data});
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }

    function reSubscribe(endpointArn, params, callback) {
        var uargs = {
            ksid: endpointArn
        };
        var unSubscribeP = Promise.promisify(unSubscribe);

        unSubscribeP(uargs)
            .then(function() {
                return createPlatformEndpointP(params);
            })
            .then(function(data) {
                log.data = data;
                AppLogger.debug('Subscribed successfully', log);
                callback(null, data.EndpointArn);
            })
            .catch(function(err) {
                AppLogger.error({
                    resource: "PushNotification",
                    action: "Subscribe/ Unsubscribe",
                    error: err
                });
                callback(err);
            });
    }

    function handleSubscribeError(err, args, params, callback) {
        AppLogger.trace('PushNotification: handleSubscribeError');
        if (err && err.code && err.code.toLowerCase() === 'invalidparameter' && err.message) {
            var g = err.message.match(existingEndpointRegex) || [];
            if (awsSnsArnRegex.test(g[1])) {
                AppLogger.trace('PushNotification: subscribe invalid parameter error');
                if (args.getEndpointArnFn) {
                    args.getEndpointArnFn(args)
                        .then(function(endpointArn) {
                            reSubscribe(endpointArn, params, callback);
                        });
                } else {
                    AppLogger.trace('PushNotification: subscribe resubscribe started');
                    reSubscribe(g[1], params, callback);
                }
            } else {
                AppLogger.trace('PushNotification: subcribe response with failure');
                callback(err);
            }
        } else {
            AppLogger.trace('PushNotification: subcribe response with failure');
            callback(err);
        }
    }

    /**
     * @desc Subscribe for push notifications with AWS SNS
     * @param args
     *          contains ksid / body (payload to subscribe with KMS)
     * @param callback
     *        callback function to call after subscribing
     */
    function subscribe(args, callback) {
        AppLogger.trace('PushNotification: subscribe started');
        var log = {
            resource: 'PushNotification',
            action: 'Subscribe'
        };

        args.osType = args.osType && args.osType.toLowerCase();

        var platformApplicationArn = arns[SUPPORTED_PLATFORMS[args.osType]];
        if (!platformApplicationArn) {
            AppLogger.trace('PushNotification: invalid platform', args.osType);
            return callback(new config.errors.BadRequest('Invalid platform'));
        }

        var params = {
            PlatformApplicationArn: platformApplicationArn,
            Token: args.deviceToken || args.deviceId
        };
        AppLogger.trace('PushNotification: subscribe with :', params);
        createPlatformEndpointP(params)
            .then(function(data) {
                log.data = data;
                AppLogger.debug('Subscribed successfully', log);
                callback(null, data.EndpointArn);
            })
            .then(null, function(err) {
                log.error = err;
                AppLogger.error('PushNotification: subscribe error', log);
                handleSubscribeError(err, args, params, callback);
            });
    }

    /**
     * @desc Unsubscribe for push notifications with AWS SNS
     * @param args
     *          contains ksid (endpointArn) (payload to unsubscribe with SNS)
     * @param callback
     *        callback function to call after subscribing
     */
    function unSubscribe(args, callback) {
        var log = {
            resource: 'PushNotification',
            action: 'UnSubscribe'
        };
        var params = {
            EndpointArn: args.ksid
        };
        sns.deleteEndpoint(params, function(err, data) {
            if (err) {
                log.error = err;
                AppLogger.error(log);
                return callback(err);
            }
            log.data = data;
            AppLogger.debug('Unsubscribed successfully', log);

            callback(null, true);
        });
    }

    function convertMsgToGcmFormat(args) {
        return {
            GCM: JSON.stringify({
                data: {
                    content: args.message,
                    customdata: args.customdata
                }
            })
        };
    }

    function convertMsgToApnsFormat(args) {
        var msg = {};
        msg[args.pkey] = JSON.stringify({
            aps: {
                alert: args.message,
                sound: 'DEFAULT',
            },
            customdata: JSON.stringify(args.customdata)
        });
        return msg;
    }

    // Publish notification to SNS
    function publishToSNS(args, callback) {
        if (!(args && args.ksids && args.ksids.length > 0)) {
            return AppLogger.info('Push notification not sent (ksids not available)', {
                resource: 'PushNotification',
                action: 'Send'
            });
        }
        args.message = args && args.message && args.message.trim();
        args.ksids.forEach(function(endpointArn) {
            var log = {
                resource: 'PushNotification',
                action: 'Send'
            };
            args.pkey = endpointArn && endpointArn.split('/')[1];
            var convrtMsgFn = convertMsgToApnsFormat;
            if (args.pkey === 'GCM') {
                convrtMsgFn = convertMsgToGcmFormat;
            }

            var params = {
                Message: JSON.stringify(convrtMsgFn(args)),
                MessageStructure: 'json',
                TargetArn: endpointArn
            };
            sns.publish(params, function(err, data) {
                var cbRes = {
                    push: true,
                    ksid: endpointArn
                };
                log.ksid = endpointArn;

                if (err) {
                    log.error = err;
                    if (typeof callback === 'function') {
                        callback(err, cbRes);
                    }
                    return AppLogger.error(log);
                }

                log.data = data;
                AppLogger.debug('Push notification sent successfully.', log);
            });
        });
    }

    return {
        push: publishToSNS,
        subscribe: subscribe,
        unsubscribe: unSubscribe
    };
}

function presencePush() {
    var config = require('../../../../config');
    var createRedisClient = require('../../../../services/RedisClient').createClient;
    var redisClient = createRedisClient(config.redis.pns);
    var debug = require('debug')('pns:presence');

    /**
     * publish notifications via redis to presence servers
     * @params {Object} args
     * @params {Array} args.userIds - userids array
     * @params {Object} args.message - message to push
     */
    function publish(args) {
        if (!Array.isArray(args.userIds)) args.userIds = [args.userIds];
        debug(args.userIds);

        for (var i = 0; i < args.userIds.length; i++) {
            redisClient.publish('pushNotification',
                JSON.stringify({
                    'userId': args.userIds[i],
                    'notification': args.message,
                    'customdata': args.customdata
                }));
        }
        AppLogger.debug('Presence notification sent:' + args.message, log);
    }

    return {
        push: publish
    };
}

function Pns(conf) {
    if (conf.enableSNS) {
        kms = new Sns(conf.sns);
    }

    if (conf.enablePresence) {
        presence = presencePush();
    }
}

/*
 *@desc Subscribe to push notifications
 */
Pns.prototype.subscribe = function(args, callback) {
    log.action = "Subscribe";

    if (kms) {
        kms.subscribe(args, callback);
    } else {
        callback();
    }
};

/*
 *@desc Unsubscribe push notifications
 */
Pns.prototype.unsubscribe = function(args, callback) {
    log.action = "Unsubscribe";
    if (kms) {
        kms.unsubscribe(args, callback);
    } else {
        callback();
    }
};

/**
 * @desc Push message using KMS and presence server
 * @param args
 *          with ksid's and message to sent
 *          example: args = {message: 'what message to sent', ksids: [1,2,3]}
 * @param callback
 *        callback function to call after send message
 */
Pns.prototype.send = function(args, callback) {
    log.action = "Send";
    args.publishTo = args.publishTo || ['push', 'presence'];
    // push message to KMS
    if (kms && args.publishTo.indexOf('push') >= 0) {
        kms.push(args, callback);
    }

    // push message to presence server
    if (presence && args.publishTo.indexOf('presence') >= 0) {
        presence.push(args);
    }

    if (args.publishTo.indexOf('push') <= -1 && typeof callback === 'function') {
        callback(null);
    }
};

module.exports = Pns;