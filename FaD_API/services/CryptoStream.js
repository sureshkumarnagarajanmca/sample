/*global _appConsts:true*/

/*
 *provides encryption and decryption streams
 */

var Transform = require('stream').Transform;
var util = require('util');
var crypto = require('crypto');
var sconfig = _appConsts.security;
var algo = sconfig.contentencdecalgo;

function genKey(key) { // TODO : make it more complex
    var hashfun = crypto.createHash("md5");
    hashfun.update(key);
    return (hashfun.digest("hex"));
}

function CipherStream(opts) {
    if (!(this instanceof CipherStream)) {
        return new CipherStream(opts);
    }
    Transform.call(this, opts);
    this.opts = opts;
    this.cipher = crypto.createCipher(algo, genKey(opts.key));
}

util.inherits(CipherStream, Transform);

CipherStream.prototype._transform = function (chunk, encoding, done) {
    this.push(this.cipher.update(chunk));
    done();
};

CipherStream.prototype._flush = function (done) {
    this.push(this.cipher.final());
    done();
};

exports.CipherStream = CipherStream;

function DecipherStream(opts) {
    if (!(this instanceof DecipherStream)) {
        return new DecipherStream(opts);
    }

    Transform.call(this, opts);
    this.opts = opts;
    this.decipher = crypto.createDecipher(algo, genKey(this.opts.key));
}

util.inherits(DecipherStream, Transform);

DecipherStream.prototype._transform = function (chunk, encoding, done) {
    this.push(this.decipher.update(chunk));
    done();
};

DecipherStream.prototype._flush = function (done) {
    this.push(this.decipher.final());
    done();
};

exports.DecipherStream = DecipherStream;

function RangeStream(opts) {
    if (!(this instanceof RangeStream)) {
        return new RangeStream(opts);
    }

    Transform.call(this, opts);
    this.opts = opts;
    this.start = opts.start;
    this.offset = opts.offset;
    this.stop = this.start + this.offset;
    this.pos = 0;
}

util.inherits(RangeStream, Transform);

RangeStream.prototype._transform = function (chunk , encoding, done) {

    var currentPos = this.pos;
    this.pos = currentPos + chunk.length;

    if (currentPos > this.stop) {
        console.log('stop');
        done();
        //this.stop();
    }

    if (this.pos < this.start) {
        done();
        return;
    }

    if ((currentPos < this.start) && (this.pos > this.start)) {
        console.log('start', chunk.length);
        console.log(this.pos, this.start, currentPos);
        this.push(chunk.slice(this.pos - this.start, this.end - this.pos));
        done();
        return;
    }

    if ((currentPos < this.stop) && (this.pos > this.stop)) {
        console.log('middle');
        this.push(chunk.slice(0, (this.pos - this.stop)));
        // can this.stop here?
        done();
        return;
    }

};

RangeStream.prototype._flush = function (done) {
    done();
};

exports.RangeStream = RangeStream;
