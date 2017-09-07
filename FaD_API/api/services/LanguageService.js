/**
 * Created by pradeep on 3/7/16.
 */
var Language = require('../../db/dbModels/Language');

var mongoose = require('mongoose');

var Q = require('q');

function createLanguageMap(data){
    var lang = {};
    lang._id = data._id;
    lang.languageName = data.languageName;
    for (var i in lang) {
        if(!lang[i]){
            delete lang[i];
        }
    };
    return lang;
}

// function createLanguageMap()

exports.uploadLanguages = function(data){
    // console.log(data);
    var deferred = Q.defer();
    var language = createLanguageMap(data);
    Language.findOneAndUpdate({"_id":data._id},{$set:language},{new: true, upsert : true},function(err, lang) {
        if (err) {
            deferred.reject("Error while updating the language");
        }else {
            if(!lang){
                deferred.reject("Error while updating the language");
            }else{
                deferred.resolve(lang);
            }
        }
    });
    return deferred.promise;
};

exports.getLanguagesList = function(){
    var deferred = Q.defer();
    Language.find({},function(err, lang) {
        console.log(lang);
        if (err) {
            deferred.reject("Error while fetching the language");
        }else {
            deferred.resolve(lang);
        }
    });
    return deferred.promise;
}



