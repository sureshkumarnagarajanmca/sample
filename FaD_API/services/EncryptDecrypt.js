/*global _appConsts:true*/
/*jslint sub:true , newcap:true*/


/**
 *This service houses functionality to encrypt /decrypt
 *
 *@author shekhar
 *
 *@revision :
 *  20-11-2012 Sekhar removed console logs
 **/


var _crypto = require("crypto"),
    _stream = require('stream'),
    _fs = require("fs"),
    password = "popcornpopcorn", // TODO : Generate it dynamically   
    _sconfig = _appConsts.security,
    algo = _sconfig.contentencdecalgo;

function _genKey(key) { // TODO : make it more complex
    var _hashfun = _crypto.createHash("md5");
    _hashfun.update(key);
    return (_hashfun.digest("hex"));
}

module.exports = {
    decrypt: function(readablestream, cb, key) {
        var start, _start, decipher;

        function decryptcb(decres) {
            if (decres.stat === 201) {
                if (cb && cb.data) {
                    cb.data(decres.data);
                    return;
                }
            }
            if (decres.stat === 200) {
                if (cb && cb.complete) {
                    if (decres.data) {
                        cb.complete(decres.data);
                        return;
                    }
                    cb.complete();
                    return;
                }
            }
            if (decres.stat === 404) {
                if (cb && cb.error) {
                    cb.error('errormessage');
                    return;
                }
            }
        }
        start = new Date().valueOf();

        if (!readablestream || !(readablestream instanceof _stream)) {
            cb({
                stat: 404,
                error: 'not a valid readstream'
            });
            return;
        }

        decipher = _crypto.createDecipher(algo, _genKey(key));
        readablestream.on('data', function(data) {
            var enc, __start;
            if (!_start) {
                _start = new Date().valueOf();
            }
            __start = new Date().valueOf();
            enc = decipher.update(data);
            //console.log('decryption consumed - ' + data.length + ' - ' + (new Date().valueOf() - __start) + 'ms');
            enc = new Buffer(enc, 'binary');
            decryptcb({
                stat: 201,
                data: enc
            });
            return;
        });

        readablestream.on('end', function(_doFinal) {
            var enc;
            if (_doFinal === false) {
                decryptcb({
                    stat: 200
                });
                return;
            }
            enc = decipher.final();
            enc = new Buffer(enc, 'binary');
            if (enc.length !== 0) {
                decryptcb({
                    stat: 200,
                    data: enc
                });
                //  console.log((new Date().valueOf() - _start) + 'ms');
                //  console.log((new Date().valueOf() - start) + 'ms');
                return;
            }
            decryptcb({
                stat: 200
            });
            // console.log((new Date().valueOf() - _start) + 'ms');
            // console.log((new Date().valueOf() - start) + 'ms');

        });
    },

    encrypt: function(readstream, writestream, cb, key) {
        var cipher, list;

        function encryptcb(encres) {
            if (encres.stat === 200) {
                // console.log('encryption success');
                if (cb && cb.complete) {
                    cb.complete();
                    return;
                }
            }
            if (encres.stat === 500) {
                // console.log('encryption error - ' + encres.error);
                if (cb && cb.error) {
                    cb.error(encres.error);
                    return;
                }
            }
        }

        cipher = _crypto.createCipher(algo, _genKey(key));

        readstream.on('data', function(data) {
            var start = new Date().valueOf(),
                enc;
            enc = cipher.update(data);
            // console.log('encryption consumed - ' + (new Date().valueOf() - start) + 'ms');				
            enc = new Buffer(enc, 'binary');
            list.call('this', enc);
        });

        readstream.on('end', function() {
            var start = new Date().valueOf(),
                enc;
            enc = cipher.final();
            // console.log('encryption consumed - ' + (new Date().valueOf() - start) + 'ms');				
            enc = new Buffer(enc, 'binary');
            writestream.write(enc);
            encryptcb({
                stat: 200,
                msg: 'success'
            });
        });

        readstream.on('error', function(readerror) {
            encryptcb({
                stat: 500,
                error: JSON.stringify(readerror)
            });
        });
        readstream.pipe(writestream);
        list = readstream.listeners('data')[1];
        readstream.removeListener('data', list);
    },
    encryptAll: function(_basefilename, _extnlist, _cb, key) {
        var _self = this;
        _extnlist.forEach(function(extn) {
            var _extn = '.' + extn,
                _readstream, _writestream, _encdeccb;
            _readstream = _fs.createReadStream(_basefilename + _extn);
            _writestream = _fs.createWriteStream(_basefilename + '-enc' + _extn, {
                flags: 'a+'
            });
            _encdeccb = {
                complete: function() {
                    _cb('success - ' + _extn);
                },
                error: function(err) {
                    _cb('error' + ' - ' + _extn);
                }
            };
            _self.encrypt(_readstream, _writestream, _encdeccb, key);
        });
    }
};
