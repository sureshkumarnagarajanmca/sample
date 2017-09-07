

function getAccessTokenForBasicAuth(authHeader){
    var startIndex, parts, scheme, credentials, token;

    startIndex = authHeader.indexOf('Basic ');

    if(startIndex === -1){
        return null;
    }
    parts       = authHeader.split(" "),             // Basic base64EncodedString
    scheme      = parts[0],                             // Basic
    credentials = decodeFromBase64(parts[1]).split(":"); // username:password
    if(credentials.length !== 2){
        token = parts[1];
    }else{
        token = credentials[1];
    }
    return token;
}

function getAccessToken(req) {
    var authHeader, bearer, startIndex, spaceIndex;
    if (!req || !req.headers || !req.headers.authorization) {
        if (req.query && req.query.access_token) {
            return req.query.access_token;
        }
        return null;
    }
    authHeader = req.headers.authorization;
    startIndex = authHeader.toLowerCase().indexOf('bearer ');
    if (startIndex === -1) {
        //return null;
        return getAccessTokenForBasicAuth(authHeader);
    }

    bearer = authHeader.substring(startIndex + 7);
    spaceIndex = bearer.indexOf(' ');

    if (spaceIndex > 0) {
        bearer = bearer.substring(0, spaceIndex);
    }

    return bearer;
}

module.exports.getAccessToken = getAccessToken;