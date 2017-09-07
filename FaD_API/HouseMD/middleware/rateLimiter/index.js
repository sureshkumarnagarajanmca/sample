/*global config, exports, require, console*/
exports.Base             = require('express-rate/lib/base');
exports.Memory           = require('express-rate/lib/memory');
exports.Redis            = require('express-rate/lib/redis');
var rateRedisConfig = config.redis.common;

exports.defaults = function () {

    var warnOnce = false, redisDB = require('redis'),
        redisClient = redisDB.createClient(rateRedisConfig.options.port, rateRedisConfig.options.host);

    redisClient.on("error", function () {
        warnOnce || console.log("Not connected to Redis..");
        warnOnce =true;
    });

    var redisHandler =  redisClient ? new exports.Redis.RedisRateHandler({client: redisClient}) : null;

    return {

        handler: redisHandler,

        LimiterKeyGenerator : require('./LimitStrategy.js'),
        
        getRequestPath: function (req) {
            return req.originalUrl;
        },
        /**
        * this function takes limit/interval attributes as parameter
        * and looks for their values from config file,
        * incase there is no value for given endpointStaticPath then it will look 
        * for default values
        */
        getLimiterValue: function (endpointStaticPath, reqMethod, limiterAttribute){

            var attrVal = (config.limiter[endpointStaticPath][reqMethod] &&
            config.limiter[endpointStaticPath][reqMethod][limiterAttribute]) ||              
            (config.limiter[endpointStaticPath]["ALL"] && 
            config.limiter[endpointStaticPath]["ALL"][limiterAttribute]) || 
            config.limiter["defaultLimit"]["ALL"][limiterAttribute];
    
            return attrVal;
        },

        interval: 0,

        limit: 0,

        setHeaders: true,

        setHeadersHandler: function (req, res, rate, limit, resetTime) {

            var remaining = limit - rate;

            // remaining can be smaller than 0 because it just counts how many requests were made
            // and is incremented whether or not it is over the limit
            // we just won't allow the request to continue to the controller if its over the limit
            // we zero it here so it doesnt confuse the user

            // logic behind this is so for REDIS, we only have to make one increment request (which returns
            // the current count), with 
            // one roundtrip to the server. Otherwise, we would have to first check what the value is and
            // then increment if smaller (which is two roundtrips to the server)
            // if someone knows how to do conditionals in REDIS multi transactions, let me know!
            if (remaining < 0) {
                remaining = 0;
            }


            // follows Twitter's rate limiting scheme and header notation
            // https://dev.twitter.com/docs/rate-limiting/faq#info
            res.setHeader('X-RateLimit-Limit', limit);
            res.setHeader('X-RateLimit-Remaining', remaining);
            res.setHeader('X-RateLimit-Reset', resetTime);
        },

        onLimitReached: function (req, res, rate, limit, resetTime, next) {

            // HTTP code 420 from http://mehack.com/inventing-a-http-response-code-aka-seriously
            res.json({error: 'Rate limit exceeded. Check headers for limit information.'}, {status: 420});
        }

    };
};

//
// MIDDLEWARE
//


exports.middleware = function recordRate(options) {
    var defaults = exports.defaults();
    options = options || {};

    for (var prop in defaults) {
        if (options[prop] == null) options[prop] = defaults[prop];
    }



    return function recordRate(req, res, next) {

        var limitStrategy, limitKey,requestPath,reqMethod,
            endpointStaticPath = req.staticPath;
        
        if (config.limiter[endpointStaticPath] && options.handler && options.handler.connected){

            //get the limit strategy- user, ip,..
            limitStrategy = (config.limiter[endpointStaticPath] && 
                        config.limiter[endpointStaticPath].strategy) || 
                        config.limiter["defaultLimit"].strategy;


            limitKey = options.LimiterKeyGenerator.getKey(limitStrategy , req);

            //get the rest API path and request method
            requestPath = options.getRequestPath(req);
            reqMethod = req.method.toUpperCase();

            //set the limit and interval
            options.limit = options.getLimiterValue(endpointStaticPath, reqMethod, "limit");
            options.interval = options.getLimiterValue(endpointStaticPath, reqMethod, "interval");

            console.log("options.limit="+options.limit+" options.interval="+options.interval);


            // use the callback to get the rate
            var incrementCallback = function (rate, resetTime) {

                if (options.setHeaders) {
                    options.setHeadersHandler(req, res, rate, options.limit, resetTime);
                }

                if (rate > options.limit) {
    
                    // we are officially over the limit
                    options.onLimitReached(req, res, rate, options.limit, resetTime, next);
        
                } else {
        
                    next();
                    
                }
            };

            


            options.handler.increment(requestPath, limitKey, options, next, incrementCallback);

        }else{
            next();
        }
    }
};

