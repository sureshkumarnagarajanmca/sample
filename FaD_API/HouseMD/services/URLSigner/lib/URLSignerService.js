var url = require('url');
var crypto = require('crypto');
var querystring = require('querystring');

function URLSigner(options) {
    this.secret =options.secret;
    this.hashalgo = options.hashalgo || 'sha256';
    this.ttl = options.ttl;
    this.encoding = options.encoding || 'base64';
};

function useTTL(ttlValue) {
    return (Math.floor(+new Date() / 1000) + ttlValue);
}

function createHash(message , algo, secret, encoding) {
    //console.log(arguments);
    return crypto.createHmac(algo, secret)
        .update(message , 'utf-8')
        .digest(encoding);
}

function escapeB64(str) {
    var s = str.replace(/\//g, "_")
        .replace(/\+/g, "-")
        .replace(/[=]/g, "$");
    return s;
}

function unEscapeB64(str) {
    var s = str.replace(/_/g, "/")
        .replace(/-/g, "+")
        .replace(/\$/g, "=");
    return s;
}

function encodeToB64AndEscape(obj) {
    var s, b64Str;
    s = JSON.stringify(obj);
    b64Str = new Buffer(s).toString('base64');
    return escapeB64(b64Str);
}

function unEscapeAndDecodeToB64(escb64Str) {
    var uEscStr;
    uEscStr = unEscapeB64(escb64Str);
    return new Buffer(uEscStr, 'base64').toString('utf8');
}

function parseURL(rurl) {
    var urlParsed;

    urlParsed = url.parse(rurl);	
    return {
		p:urlParsed.pathname
    };
}

URLSigner.prototype.sign = function(url, options) {
    var message, expiration, ttl, encoding , qs, base64Hash;

    options = options || {};
    ttl = options.ttl || this.ttl;
    expiration = options.exp;
    encoding = options.encoding || this.encoding;

    if (!expiration && !ttl) {
        return;
    }

    if (!expiration) {
        expiration = useTTL(ttl);
    }

    message = {};
    message.r = parseURL(url);
    message.n = Math.floor(Math.random() * 10000000000); //random
    message.m = 'GET';
    message.e = expiration;
    qs=['e=' + expiration , 'n=' + message.n ];

    if (options.policy) {
        message.p = encodeToB64AndEscape(options.policy);
        qs.push('p='+message.p);
    }

    if (options.keyID) {
        message.k = options.keyID;
        qs.push('k='+message.k);
    }
    message = encodeToB64AndEscape(message);

    mHash = createHash(message, this.hashalgo ,this.secret, encoding);
    base64Hash = encodeToB64AndEscape(mHash);
    url += (url.indexOf('?') == -1 ? '?' : '&') + qs.join('&') + '&s=' + base64Hash;
    return url;
}


URLSigner.prototype.verifySignature = function(url, qsJson) {
    var message, expiration, vHash, urlHash, base64Hash;
    
    expiration = qsJson.e;
    encoding = this.encoding;

    if (!expiration) {
        return;
    }

    message = {};
    message.r = parseURL(url);
    message.n = eval(qsJson.n) //random
    message.m = 'GET';
    message.e = eval(expiration);
    if (qsJson.p) {
        message.p = qsJson.p;
    }

    if (qsJson.k) {
        message.k = qsJson.k;
    }
    message = encodeToB64AndEscape(message);
    vHash = createHash(message, this.hashalgo ,this.secret, encoding);
    base64Hash = encodeToB64AndEscape(vHash);
	urlHash = qsJson.s;
	//urlHash = urlHash.replace(/\s/g, '+');
	if(base64Hash === urlHash){
		//console.log('valid signature');
		return true;
	}else{
		return false;
	}
};

function getQueryStringJson(rurl) {
    var urlParsed, dataJson;
    urlParsed = url.parse(rurl);
	dataJson = querystring.parse(urlParsed.query);
    return dataJson
}

URLSigner.prototype.verifyUrl = function(reqUrl) {
	var dataJson;
    dataJson = getQueryStringJson(reqUrl);
    
    if(eval(dataJson.e) < Math.ceil(+new Date()/1000)){
        console.log('URL expired');
        return 'expired';
    }

	
	if(!this.verifySignature(reqUrl,dataJson)){
        console.log('invalid signature');
		return 'invalid';
	}
	
	
	
	return true;
};

module.exports = function(options) {
    return new URLSigner(options);
};
