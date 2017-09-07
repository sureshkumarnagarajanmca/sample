/**
 * Created by sai on 3/18/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var acceTokenInfo = new Schema({},{strict : false});
var accessTokens = mongoose.model('acceTokenInfo',acceTokenInfo);

module.exports = accessTokens;
