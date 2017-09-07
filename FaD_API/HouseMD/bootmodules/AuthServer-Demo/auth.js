var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy
    , BasicStrategy = require('passport-http').BasicStrategy
    , ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy
    , BearerStrategy = require('passport-http-bearer').Strategy
    , ClientService = require('./lib/ClientService.js')
    , AuthService = require('./lib/AuthorizationService.js')
    , TokenService = require('./lib/TokenService.js')
    , Oauth2Service = require('./Oauth2Service.js');

/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.
 */
passport.use(new LocalStrategy( {passReqToCallback:true},
    function (req, username, password, done) {

        return done(null, true);
    }
));

/**
 * BasicStrategy & ClientPasswordStrategy
 *
 * These strategies are used to authenticate registered OAuth clients.  They are
 * employed to protect the `token` endpoint, which consumers use to obtain
 * access tokens.  The OAuth 2.0 specification suggests that clients use the
 * HTTP Basic scheme to authenticate.  Use of the client password strategy
 * allows clients to send the same credentials in the request body (as opposed
 * to the `Authorization` header).  While this approach is not recommended by
 * the specification, in practice it is quite common.
 */
passport.use( new BasicStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
   
    function (req, username, password, done) {
        //todo:find the user and its pwd and match the pwd with hashed header pwd
        return done(null, true);
    }
));

/**
 * Client Password strategy
 *
 * The OAuth 2.0 client password authentication strategy authenticates clients
 * using a client ID and client secret. The strategy requires a verify callback,
 * which accepts those credentials and calls done providing a client.
 */
passport.use(new ClientPasswordStrategy(
    {passReqToCallback:true},

    function (req, clientId, clientSecret, done) {
        //TODO: do client validation here,  ie client_id, client_secret    
        ClientService().getById(clientId, function(client){
            if(! (client && client.getClientID())){
                return done(null, false);
            }else{
                return done(null, client);
            }
        });
    }
));

/**
 * BearerStrategy
 *
 * This strategy is used to authenticate either users or clients based on an access token
 * (aka a bearer token).  If a user, they must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 */
passport.use(new BearerStrategy(
    //this has defined a callback done is that callback
    {session: false, "passReqToCallback":true },

    function (req, accessToken, done) {

        Oauth2Service().getAccessToken(accessToken, req.scope, function(isTokenValid, tokenInst){
            return done(null, tokenInst);
        });
}));
    


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

passport.serializeUser(function (user, done) {
    done(null,true);
   // done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    /*db.users.find(id, function (err, user) {
        done(err, user);
    });*/

});
