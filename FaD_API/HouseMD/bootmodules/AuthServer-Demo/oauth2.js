/*global config*/

/**
 * Module dependencies.
 */
var oauth2orize = require('oauth2orize')
    , passport = require('passport')
    , SamlStrategy = require('passport-saml').Strategy
    , _authService = require('../../api/services/AuthenticationService')
    , Oauth2Service = require('./Oauth2Service.js')
    , keyGenerationService = require(config.app.root + '/security/KeyGenerationService.js');



function SamlStrategyClosure(options){
    var samlStrategy = new SamlStrategy(
        {
        logoutUrl : options.logoutUrl,
        path : options.path,
        RelayState : options.RelayState,
        entryPoint : options.entryPoint,
        issuer: options.issuer,
        protocol : options.protocol,
        cert : options.cert
        /*entryPoint: 'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php',
        issuer: 'passport-saml',
        protocol: 'https://',
        cert: 'MIICizCCAfQCCQCY8tKaMc0BMjANBgkqhkiG9w0BAQUFADCBiTELMAkGA1UEBhMCTk8xEjAQBgNVBAgTCVRyb25kaGVpbTEQMA4GA1UEChMHVU5JTkVUVDEOMAwGA1UECxMFRmVpZGUxGTAXBgNVBAMTEG9wZW5pZHAuZmVpZGUubm8xKTAnBgkqhkiG9w0BCQEWGmFuZHJlYXMuc29sYmVyZ0B1bmluZXR0Lm5vMB4XDTA4MDUwODA5MjI0OFoXDTM1MDkyMzA5MjI0OFowgYkxCzAJBgNVBAYTAk5PMRIwEAYDVQQIEwlUcm9uZGhlaW0xEDAOBgNVBAoTB1VOSU5FVFQxDjAMBgNVBAsTBUZlaWRlMRkwFwYDVQQDExBvcGVuaWRwLmZlaWRlLm5vMSkwJwYJKoZIhvcNAQkBFhphbmRyZWFzLnNvbGJlcmdAdW5pbmV0dC5ubzCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAt8jLoqI1VTlxAZ2axiDIThWcAOXdu8KkVUWaN/SooO9O0QQ7KRUjSGKN9JK65AFRDXQkWPAu4HlnO4noYlFSLnYyDxI66LCr71x4lgFJjqLeAvB/GqBqFfIZ3YK/NrhnUqFwZu63nLrZjcUZxNaPjOOSRSDaXpv1kb5k3jOiSGECAwEAATANBgkqhkiG9w0BAQUFAAOBgQBQYj4cAafWaYfjBU2zi1ElwStIaJ5nyp/s/8B8SAPK2T79McMyccP3wSW13LHkmM1jwKe3ACFXBvqGQN0IbcH49hu0FKhYFM/GPDJcIHFBsiyMBXChpye9vBaTNEBCtU3KjjyG0hRT2mAQ9h+bkPmOvlEo/aH0xR68Z9hw4PF13w=='*//*,
        privateCert: fs.readFileSync('./cert.pem', 'utf-8')*/
      },
      function(req, profile, done) {

        if (!profile.email) {
          return done(new Error("No email found"), null);
        }
        // asynchronous verification, for effect...
        process.nextTick(function () {

            username = profile.email;
            //password = "client@123456";
            password = "";
            var cId = (req.body.RelayState.split("?")[1]).split("=")[1];
            Oauth2Service().createToken(req,
                cId, username, password, "scope", true, function(){},function(err, tokenData){
                    if(err){
                        return done(null, false);
                    }else{
                        return done(null, req.body.RelayState+'&token='+tokenData.accessToken+'&resourceOwnerID='+tokenData.resourceOwnerID+'&user='+username);
                    }
                }
            )
        });
      }
    );

    passport.use(samlStrategy);
    return samlStrategy;
}

// create OAuth 2.0 server
var server = oauth2orize.createServer();

// Register supported grant types.
//
// OAuth 2.0 specifies a framework that allows users to grant client
// applications limited access to their protected resources.  It does this
// through a process of the user granting access, and the client exchanging
// the grant for an access token.

/**
 * Grant authorization codes
 *
 * The callback takes the `client` requesting authorization, the `redirectURI`
 * (which is used as a verifier in the subsequent exchange), the authenticated
 * `user` granting access, and their response, which contains approved scope,
 * duration, etc. as parsed by the application.  The application issues a code,
 * which is bound to these values, and will be exchanged for an access token.
 */
server.grant(oauth2orize.grant.code(function (client, redirectURI, user, ares, done) {

    /*var code = utils.uid(config.token.authorizationCodeLength);

        db.authorizationCodes.save(code, client.id, redirectURI, user.id, client.scope, function (err) {
        if (err) {
            return done(err);
        }
        return done(null, code);
    });*/

}));

/**
 * Grant implicit authorization.
 *
 * The callback takes the `client` requesting authorization, the authenticated
 * `user` granting access, and their response, which contains approved scope,
 * duration, etc. as parsed by the application.  The application issues a token,
 * which is bound to these values.
 */
server.grant(oauth2orize.grant.token(function (client, user, ares, done) {

}));

/**
 * Exchange authorization codes for access tokens.
 *
 * The callback accepts the `client`, which is exchanging `code` and any
 * `redirectURI` from the authorization request for verification.  If these values
 * are validated, the application issues an access token on behalf of the user who
 * authorized the code.
 */
server.exchange(oauth2orize.exchange.code(function (client, code, redirectURI, done) {

}));

function isEmptyObject(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key]) {
      return false;
    }
  }
  return true;
}


/**
 * Exchange user id and password for access tokens.
 *
 * The callback accepts the `client`, which is exchanging the user's name and password
 * from the token request for verification. If these values are validated, the
 * application issues an access token on behalf of the user who authorized the code.
 */
server.exchange(oauth2orize.exchange.password(function(req, res, client, username, password, scope, done) {
    function assignaccountid(userinfo , token){
        userinfo.accountId = token.accountId;
    }
    var _dName,_options;

    //if user is a enterprise user and need to be authenticated via saml idp
    _dName = getDomainName(username);
    if (_dName){
        Oauth2Service().getAcctDet(_dName, function(Msg){
            if ( typeof Msg == 'object'){
                // Msg = Msg.toJSON();
            }
            if ((Msg.idpInfo) && !isEmptyObject(Msg.idpInfo)){
                _options = prepareIdpOptions(req, Msg.idpInfo);
                _options.RelayState = req.body.relayState +'?clientId='+client.getClientID();

                SamlStrategyClosure(_options);
                passport.authenticate('saml')(req, res);

                return;

            }else if(req.body.relayState){
                res.redirect(req.body.relayState);
                res.end();
                return;
            }
        });
    }

    if ( !req.body.relayState){
        Oauth2Service().createToken(req,client.getClientID(), username, password, scope, function(err, tokenData, userId){

            if(err){
                return sendErrResp(res, tokenData, req.locale[tokenData]);
            }else{
                var _refreshToken = null;

                 //I mimic openid connect's offline scope to determine if we send
                //a refresh token or not
                //TODO: need to put proper scope check for refresh token
                if (scope && scope.indexOf("offline_access") === 0) {
                    //TODO: get refreshToken
                    _refreshToken = _refreshToken;
                }

                //tokenData.refreshToken = _refreshToken;

                return done(null, tokenData.accessToken,
                                tokenData.refreshToken,
                                {expires_in: tokenData.expiresDate, userid: userId});

            }
        },
        /*backward compatibility callback, prepare login response,
        record user visit and notify Pns */
        function(err, tokenData, userInfo){

            if(err){
                return sendErrResp(res, tokenData, req.locale[tokenData]);
            }else{


            authServiceInst = _authService.getInst();
            authServiceInst.postAuthenticate(req, tokenData, userInfo, function(auth) {
                var _error = auth.error , _userInfo, resp, errors, error, cAccessToken;
                 if(auth.errorCode){
                    _error = auth.errorCode;
                    _error = req.locale[_error];
                }

                if(_error){

                    error = {
                        msg: _error,
                        code: 404
                    };
                    errors =[error];
                    resp = {};
                    resp.errors = errors;
                    res.setHeader('response-error-description' , JSON.stringify(resp));
                    res.status(404);
                    res.json(resp);
                    return;
                }
                _userInfo = auth.userInfo;
                // assignaccountid(_userInfo , auth.authorization);

                UsageLogger.data({
                    userContext: tokenData,
                    orgId:tokenData.orgID,
                    userId:tokenData.resourceOwnerID,
                    resource: "User",
                    action: "Login",
                    event_type: "explicit"
                });

                keyGenerationInst = keyGenerationService.getInst();
                //cAccessToken = keyGenerationInst.encrypt(auth.authorization.accessToken);
                cAccessToken = auth.authorization.accessToken;
                res.cookie('accessToken', cAccessToken, { domain: '.client.com', path: '/'});
                res.json({
                    status:200,
                    authorization: Oauth2Service().sanitize(auth.authorization),
                    userInfo : _userInfo

                });
            });
        }})
    }
}));


/**
 * Exchange the client id and password/secret for an access token.
 *
 * The callback accepts the `client`, which is exchanging the client's id and
 * password/secret from the token request for verification. If these values are validated, the
 * application issues an access token on behalf of the client who authorized the code.

server.exchange(oauth2orize.exchange.clientCredentials(function(client, scope, done) {
    var token = utils.uid(config.token.accessTokenLength);
    //Pass in a null for user id since there is no user when using this grant type
    db.accessTokens.save(token, config.token.calculateExpirationDate(), null, client.id, scope, function (err) {
        if (err) {
            return done(err);
        }
        return done(null, token, null, {expires_in: config.token.expiresIn});
    });
}));*/

/**
 * Exchange the refresh token for an access token.
 *
 * The callback accepts the `client`, which is exchanging the client's id from the token
 * request for verification.  If this value is validated, the application issues an access
 * token on behalf of the client who authorized the code
 */

server.exchange(oauth2orize.exchange.refreshToken(function(req, res, client, refreshToken, scope, done) {
    Oauth2Service().exchangeRefreshToken(refreshToken, client.getClientID(), function(err, tokenData, oldToken){
            if(err){
                //client.getClientID()
                console.log(err)
                return sendErrResp(res, tokenData, req.locale[tokenData]);
            }else{
                UsageLogger.data({
                    userContext: tokenData,
                    req: req,
                    resource: "User",
                    action: "Logout",
                    event_type: "implicit"
                });
                UsageLogger.data({
                    userContext: tokenData,
                    req: req,
                    resource: "User",
                    action: "Login",
                    event_type: "implicit"
                });
                //@@CS override response
                // return done(null, tokenData.accessToken,
                //                 tokenData.refreshToken,
                //                 {expires_in: tokenData.expires_in});
                return res.json({
                    status:200,
                    authorization:tokenData
                });
            }
        });
}));

/**
 * User authorization endpoint
 *
 * `authorization` middleware accepts a `validate` callback which is
 * responsible for validating the client making the authorization request.  In
 * doing so, is recommended that the `redirectURI` be checked against a
 * registered value, although security requirements may vary accross
 * implementations.  Once validated, the `done` callback must be invoked with
 * a `client` instance, as well as the `redirectURI` to which the user will be
 * redirected after an authorization decision is obtained.
 *
 * This middleware simply initializes a new authorization transaction.  It is
 * the application's responsibility to authenticate the user and render a dialog
 * to obtain their approval (displaying details about the client requesting
 * authorization).  We accomplish that here by routing through `ensureLoggedIn()`
 * first, and rendering the `dialog` view.
 */
exports.authorization = [
    /*login.ensureLoggedIn(),
    server.authorization(function (clientID, redirectURI, scope, done) {
        db.clients.findByClientId(clientID, function (err, client) {
            if (err) {
                return done(err);
            }
            if(client) {
                client.scope = scope;
            }
            // WARNING: For security purposes, it is highly advisable to check that
            //          redirectURI provided by the client matches one registered with
            //          the server.  For simplicity, this example does not.  You have
            //          been warned.
            return done(null, client, redirectURI);
        });
    }),
    function (req, res, next) {
        //Render the decision dialog if the client isn't a trusted client
        //TODO Make a mechanism so that if this isn't a trusted client, the user can recorded that they have consented
        //but also make a mechanism so that if the user revokes access to any of the clients then they will have to
        //re-consent.
        db.clients.findByClientId(req.query.client_id, function(err, client) {
            if(!err && client && client.trustedClient && client.trustedClient === true) {
                //This is how we short call the decision like the dialog below does
                server.decision({loadTransaction: false}, function(req, callback) {
                    callback(null, { allow: true });
                })(req, res, next);
            } else {
                res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
            }
        });
    }*/
];

/**
 * User decision endpoint
 *
 * `decision` middleware processes a user's decision to allow or deny access
 * requested by a client application.  Based on the grant type requested by the
 * client, the above grant middleware configured above will be invoked to send
 * a response.
 */
exports.decision = [
   /* login.ensureLoggedIn(),
    server.decision()*/
];

/**
 * Token endpoint
 *
 * `token` middleware handles client requests to exchange authorization grants
 * for access tokens.  Based on the grant type being exchanged, the above
 * exchange middleware will be invoked to handle the request.  Clients must
 * authenticate when making requests to this endpoint.
 */



//we can also pass callback in basic
exports.token = [
    passport.authenticate('oauth2-client-password'),
    server.token({ session: false, "passReqToCallback":true}),
    server.errorHandler()
];


exports.logout = function(req, res) {

    var tokenUtil =  require('./lib/util');
    var accessToken = tokenUtil.getAccessToken(req), _strategyObj
                    , _options, _uName, _usrDomain, sessionTime;

    if(!accessToken) // no access token in the request
        return sendSuccessResp(res);
    //from token->get tokenobject->get token user->get user idp information
    Oauth2Service().getAccessToken(accessToken, null, function (isvalid, tokenInst) {
       if(isvalid===false && !tokenInst) // invalid token passed ( logout with invalidate accesstoken)
            return sendSuccessResp(res);

        sessionTime = ((new Date() - tokenInst.getIssuedDate())/1000)/60 ;
        Oauth2Service().deleteAccessToken( accessToken, function(Err){
        if(Err || !isvalid ){
            sendErrResp(res, 'INVALID_TOKEN',  req.locale['INVALID_TOKEN'] );
        }});

        if (isvalid) {
            Oauth2Service().getTokenUser( tokenInst, function(Err, _userInst){
                if(Err){
                    sendErrResp(res, 'INVALID_TOKEN' , req.locale['INVALID_TOKEN'] );
                }else{

                    UsageLogger.data({
                        req: req,
                        resource: "User",
                        action: "Logout",
                        event_type: "explicit",
                        sessionTime: sessionTime || 0
                    });
                    _uName = _userInst.emailId || _userInst.phoneNo;
                    _usrDomain = getDomainName(_uName)
                    if (_usrDomain){
                        Oauth2Service().getAcctDet(_usrDomain, function(Msg){

                            if (Msg.idpInfo && !isEmptyObject(Msg.idpInfo)){

                                if(!req.user){
                                    req.user = {};
                                }

                                req.user.nameIDFormat = config.saml.nameIDFormat;
                                req.user.nameID = _uName;

                                _options = prepareIdpOptions(req, Msg.idpInfo);

                                _strategyObj = SamlStrategyClosure(_options);
                                _strategyObj.logout(req, function(Err, url){
                                    if( Err ){
                                        sendErrResp(res, 'INVALID_TOKEN', req.locale['INVALID_TOKEN']);
                                    }else{
                                        console.log("logout callback"+url);
                                        res.redirect(url);
                                    }
                                });
                            }else{
                                sendSuccessResp(res);
                            }
                        });
                    }else{
                        sendSuccessResp(res);
                    }
                }
            });
        }
    });

}


function prepareIdpOptions(req, idpInfo){
    var options = {};
    //Idp details- get the resource server domain / redirect URI

    options.entryPoint = idpInfo.entryPoint,
    options.logoutUrl = idpInfo.logoutUrl,
    options.issuer = idpInfo.issuer,
    options.protocol = idpInfo.protocol,
    options.cert = idpInfo.cert,
    //SP Details
    options.path = config.saml.callbackPath;

    if (req.body){
        options.RelayState = req.body.relayState;
    }

    return options;
}

function getDomainName(username){
    var domain = null;

    if(!username)
        return;
    var startIndex = username.lastIndexOf('@');
    if (startIndex >= 1){
        domain = username.substr(startIndex + 1, username.length);
    }
    return domain;
}



// Register serialialization and deserialization functions.
//
// When a client redirects a user to user authorization endpoint, an
// authorization transaction is initiated.  To complete the transaction, the
// user must authenticate and approve the authorization request.  Because this
// may involve multiple HTTPS request/response exchanges, the transaction is
// stored in the session.
//
// An application must supply serialization functions, which determine how the
// client object is serialized into the session.  Typically this will be a
// simple matter of serializing the client's ID, and deserializing by finding
// the client by ID from the database.

server.serializeClient(function (client, done) {
    //TODO: Put proper code for token grant type
    //return done(null, client.id);
    return done(null, true);
});

server.deserializeClient(function (id, done) {
    //TODO: Put proper code for token grant type
   /* db.clients.find(id, function (err, client) {
        if (err) {
            return done(err);
        }
        return done(null, client);
    });*/
    return done(null, true);
});

function sendSuccessResp(res){
    res.status(200);
    res.json({status: 200});
}

var ERROR_MESSAGE_MAP = {};

ERROR_MESSAGE_MAP['INVALID_REFRESH_TOKEN'] = {
    httpStatus: '400',
    code : 42,
    msg: "invalid_grant"
};

ERROR_MESSAGE_MAP['NOT_ACTIVE_USER'] = {
    httpStatus: '403',
    code : 42,
    msg: "NOT_ACTIVE_USER"
};

ERROR_MESSAGE_MAP['ACCOUNT_LOCK'] = {
    httpStatus: '403',
    code : 44,
    msg: "ACCOUNT_LOCK"
};

ERROR_MESSAGE_MAP['SUSPENDED_USER'] = {
    httpStatus: '403',
    code : 45,
    msg: "INVALID_USER"
};

ERROR_MESSAGE_MAP['INVALID_USER'] =
ERROR_MESSAGE_MAP['INVALID_CREDENTIALS'] = {
    httpStatus: '403',
    code : 40,
    msg: "INVALID_CREDENTIALS"
};
ERROR_MESSAGE_MAP['PASSWORD_POLICY_CHANGED'] = {
    httpStatus: '401',
    code : 46,
    msg: "PASSWORD_POLICY_CHANGED"
};
ERROR_MESSAGE_MAP['PASSWORD_EXPIRED'] = {
    httpStatus: '401',
    code : 47,
    msg: "PASSWORD_EXPIRED"
};

ERROR_MESSAGE_MAP['CATCH_ALL'] = {
    httpStatus: '500',
    code:-1000,
    msg: "INTERNAL_SERVER_ERROR"
};


function sendErrResp(res, errCode, errMsg){
    // console.log(res)

    var map;

    map = ERROR_MESSAGE_MAP[errCode] || ERROR_MESSAGE_MAP['CATCH_ALL'];

    error = {
        msg: map.msg,
        code: map.code
    }
    errors =[error];
    resp = {};
    resp.errors = errors;
    res.status(map.httpStatus);
    res.setHeader('response-error-description' , JSON.stringify(resp));
    res.json(resp);
}