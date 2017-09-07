var crypto = require('crypto');
var algo = 'aes-256-cbc';
var secretkey= 'qwerty123456';

function encrypt(text){
  var cipher = crypto.createCipher(algo,secretkey);
  var crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algo,secretkey);
  var dec = decipher.update(text,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
}

function encryptJson(json){
    var jsonString = JSON.stringify(json);
    return encrypt(jsonString);
}

function decryptJson(text){
    var jsonString = decrypt(text);
    return JSON.parse(jsonString);
}

function random(howMany, chars) {
  chars = chars || "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
  var rnd = crypto.randomBytes(howMany);
  var value = new Array(howMany)
  var len = chars.length;

  for (var i = 0; i < howMany; i++) {
    value[i] = chars[rnd[i] % len]
  };

  return value.join('');
}

function randomNumber(howMany) {
  var chars = "0123456789";
  return random(howMany, chars);
}

module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;

module.exports.encryptJson = encryptJson;
module.exports.decryptJson = decryptJson;

module.exports.random = random;
module.exports.randomNumber = randomNumber;