





/**
 * Created by pradeep on 3/6/16.
 */
var config      = require('../../config');
var appControlListService = require('../services/AppControlListService.js'),
    errors = require('../errors'),
    errorHandler = require('../serviceHandler').errorHandler,
    paramType = require('../validator/paramTypes.js'),
    request = require('request');

var elasticsearch = require('elasticsearch');
var client = elasticsearch.Client({
        host: config.elasticsearch.host+":"+config.elasticsearch.port
        
    });    

//var security = require('../../utils/crypto');

var Q = require('q');
var Doctor = require('../../db/dbModels/Doctors');
var mongoose = require('mongoose');
var agile = require('agile');

/**
 * This Class Implements REST API for Doctor
 */


//  function initMapping() {  
//     return elasticClient.indices.putMapping({
//         index: indexName,
//         type: "document",
//         body: {
//             properties: {
//                 title: { type: "string" },
//                 content: { type: "string" },
//                 suggest: {
//                     type: "completion",
//                     analyzer: "simple",
//                     search_analyzer: "simple",
//                     payloads: true
//                 }
//             }
//         }
//     });
// }
 var elasticsearchUrl = 'http://'+config.elasticsearch.host+":"+config.elasticsearch.port+'/findadoctor';
 // console.log(elasticsearchUrl)

 var elaticSearchConnect = function(){
    request.post({
      url:    elasticsearchUrl,
      body:    '{"mappings": {"doctor": {"properties":{"address":{"properties":{"geoLocation":{"properties":{"location":{"type":"geo_point"}}}}}}},"appointments":'+ 
          '{"_parent": {"type": "doctor"},"properties": {"startTime": {"type": "date","format":"epoch_millis"},"endTime": {"type": "date","format":"epoch_millis"},"bookedSlots" :{"type": "integer"},"doctorLeave":{ "type" : "boolean" }}}}}'
    }, function(error, response, body){
      // console.log(body,response,error);
    });
 }

 elaticSearchConnect();



function searchAPI() {
    'use strict'
    var clientAPI = this.clientAPI;

    function invokeResponse(req, res){

        function sendResponse(errCode, respMsg){
            if(!errCode){
                res.status(200);
                res.json(respMsg);
            }else{
                error = {
                    msg: respMsg,
                    code: errCode
                }
                errors =[error];
                resp = {};
                resp.errors = errors;
                res.status(errCode);
                res.setHeader('response-error-description' , JSON.stringify(resp));
                res.json(resp);
            }
        }
        return sendResponse;
    }

    function mongoDBSearch(req, res) {
      var params = req.body.params || {};
      params.lat = (params.lat || 0);
      params.lon = (params.lon || 0);
      params.specId = (params.specId || "");
      params.radius = (params.radius || "");
      params.from = (parseInt(params.from) || 0);
      params.size = (parseInt(params.size) || 10);
      params.npi = (params.npi || "");
      params.name = (params.name || "");
      params.gender = (params.gender || "");
      params.insuranceId = (params.insuranceId || "");
      params.language = (params.language || 0);
      params.boardCertification = (params.boardCertification || false);
      params.sortType = (params.sortType || "asc"); // Options are "asc", "desc"
      params.sortName = (params.sortName || "distance"); // Options are "distance", "fName", "lName"

      var searchQueryGlobalObject;
      var locationForSearchObject = {};
      var accountNameObject = {};
      var nonAccountNameObject = {};
      var nameObject = {};
      var genderObject = {};
      var specIdObject = {};
      var insuranceIdObject = {};
      var andQueryOptions = {};
      var andQueryOptionsWithoutAccountName = {};
      var skipBy = params.from * params.size;

      var globalResponse = res;
      var accountNameCount = 0;
      var nonAccountNameCount = 0;
      var totalCount = 0;
      var sortingField = params.sortName;

      var searchResponse = [];

      var globalCountForAsyncCalls = 0;
      var globalCountForAsyncCallsInner = 0;     

      var totalAccountNamePages = 0;
      var accountNameReminder = 0;
      var nonAccountNameReminder = 0;
      var totalReminder = 0;
      var lastRecord = 0;
      var recordStarts = 0;
      var limitSize = params.size;

      var conditionMode = ''; // 'accountName', 'nonAccountName' and 'both'

      if (params.lat !== "" && params.lon !== "" && params.radius !=="") {
        locationForSearchObject['locationForSearch'] = {$geoWithin: { $centerSphere: [ [ params.lon, params.lat ], parseInt(params.radius.substring(0, params.radius.length - 2)) / 3959 ] }};
      }

      accountNameObject.accountName = 'northwell';
      andQueryOptions['$and'] = [locationForSearchObject, accountNameObject];

      nonAccountNameObject.accountName = 'NULL';      
      andQueryOptionsWithoutAccountName['$and'] = [locationForSearchObject, nonAccountNameObject];

      if (params.name !=="") {
        nameObject["$or"] = [{"fName": {'$regex' : '^' + params.name, '$options' : 'i'}}, {"lName": {'$regex' : '^' + params.name, '$options' : 'i'}}];
        andQueryOptions['$and'][andQueryOptions['$and'].length] = nameObject;
        andQueryOptionsWithoutAccountName['$and'][andQueryOptionsWithoutAccountName['$and'].length] = nameObject;
      }

      if (params.gender !=="") {
        genderObject.gender = params.gender;
        andQueryOptions['$and'][andQueryOptions['$and'].length] = genderObject;
        andQueryOptionsWithoutAccountName['$and'][andQueryOptionsWithoutAccountName['$and'].length] = genderObject;
      }

      if (params.specId !== "") {
        specIdObject.taxonomy = {$elemMatch:{$eq: params.specId}};
        andQueryOptions['$and'][andQueryOptions['$and'].length] = specIdObject;
        andQueryOptionsWithoutAccountName['$and'][andQueryOptionsWithoutAccountName['$and'].length] = specIdObject;
      }

      if (params.insuranceId !== "") {
        insuranceIdObject.insuranceIds = {$elemMatch:{$eq: mongoose.Types.ObjectId(params.insuranceId)}};
        andQueryOptions['$and'][andQueryOptions['$and'].length] = insuranceIdObject;
        andQueryOptionsWithoutAccountName['$and'][andQueryOptionsWithoutAccountName['$and'].length] = insuranceIdObject;
      }

      function distanceInMiles(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1/180
        var radlat2 = Math.PI * lat2/180
        var theta = lon1-lon2
        var radtheta = Math.PI * theta/180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist
      }

      searchQueryGlobalObject = andQueryOptions;

      Doctor.count(searchQueryGlobalObject, function(err, count) {
        accountNameCount = count;

        searchQueryGlobalObject = andQueryOptionsWithoutAccountName;

        Doctor.count(searchQueryGlobalObject, function(err, innerCount) {
          nonAccountNameCount = innerCount;
          totalCount = accountNameCount + nonAccountNameCount;

          // For debugging
          // accountNameCount = 14;
          // nonAccountNameCount = 61;
          // For debugging

          if (accountNameCount === 0 && nonAccountNameCount === 0) { // 0 0
            globalResponse.send({
              data : [],
              totalRecords : totalCount,
              totalAccountNameCount: accountNameCount,
              totalNonAccountNameCount: nonAccountNameCount,
              whichCondition: 1,
              details: [skipBy, limitSize, searchQueryGlobalObject, sortingField, params.sortType]
            });
          } else {

            totalAccountNamePages = parseInt( accountNameCount / params.size );
            accountNameReminder = accountNameCount % params.size;             
            nonAccountNameReminder = nonAccountNameCount % params.size;
            totalReminder = accountNameReminder + nonAccountNameReminder;
            lastRecord = ( ( params.from + 1 ) * params.size );
            recordStarts = skipBy + 1;

            if (totalReminder > 0 && totalReminder !== params.size) {
              if (accountNameCount >= recordStarts && accountNameCount < lastRecord && nonAccountNameCount !== 0) {
                conditionMode = 'both';
              } else if (accountNameCount >= lastRecord || (accountNameCount >= recordStarts && nonAccountNameCount === 0)) {
                conditionMode = 'accountName';
              } else {
                conditionMode = 'nonAccountName';
              }
            }

            if (
              ( conditionMode === 'nonAccountName' ) 
              || (totalAccountNamePages === 0 && accountNameReminder === 0) // 0 60
              || (totalAccountNamePages < (params.from + 1) && accountNameReminder === 0) // 30 30
              || (parseInt((accountNameCount + nonAccountNameReminder) / params.size) < (params.from + 1) && ( accountNameReminder + nonAccountNameReminder) === params.size)
            ) {
              /* globalResponse.send({
                data : [andQueryOptions, andQueryOptionsWithoutAccountName, conditionMode],
                totalRecords : totalCount,
                totalAccountNameCount: accountNameCount,
                totalNonAccountNameCount: nonAccountNameCount,
                searchResponseCount: searchResponse.length,                          
                whichCondition: "test 2"
              }); */
              // Query for Non Account Name only.
              searchQueryGlobalObject = andQueryOptionsWithoutAccountName;

              if (conditionMode === 'nonAccountName' && accountNameReminder > 0) { // Recalculated skipBy Because of 4 accountName Records and 71 non Account Name Records combination.
                skipBy = skipBy - accountNameCount;
              }

              if (sortingField !== 'distance') {
                Doctor.find(searchQueryGlobalObject).sort({sortingField: (params.sortType === "asc" ? 1 : -1)}).skip(skipBy).limit(limitSize).exec(function(err, doctors) {

                  /* globalResponse.send({
                    data : doctors,
                    totalRecords : totalCount,
                    totalAccountNameCount: accountNameCount,
                    totalNonAccountNameCount: nonAccountNameCount,
                    searchResponseCount: doctors.length,
                    details: [skipBy, limitSize, searchQueryGlobalObject, sortingField, params.sortType],
                    whichCondition: 'test1'
                  }); */

                  globalCountForAsyncCalls = 0;

                  for (var i = 0; i < doctors.length; i++) {

                    try {
                      if (typeof doctors[globalCountForAsyncCalls].locationForSearch !== "undefined") {
                        var coOrdinates = doctors[globalCountForAsyncCalls].locationForSearch.coordinates;
                        var distance = distanceInMiles(params.lat, params.lon, coOrdinates[1], coOrdinates[0], 'M');                        
                      } else {
                        var distance = 0;
                      }

                      doctors[globalCountForAsyncCalls].distance = distance;
                      searchResponse[globalCountForAsyncCalls] = {"_source": doctors[globalCountForAsyncCalls], "fields": {"distance":  [distance] }};
                      globalCountForAsyncCalls++;

                      if (globalCountForAsyncCalls === doctors.length) {
                        var jsonField = "_source." + sortingField;
                        jsonField = (params.sortType === "asc" ? "" : "-") + jsonField;
                        searchResponse = agile.orderBy(searchResponse, jsonField);
                        globalResponse.send({
                          data : searchResponse,
                          totalRecords : totalCount,
                          totalAccountNameCount: accountNameCount,
                          totalNonAccountNameCount: nonAccountNameCount,
                          searchResponseCount: searchResponse.length,
                          whichCondition: 2,
                          details: [skipBy, limitSize, searchQueryGlobalObject, sortingField, params.sortType]
                        });
                      }
                    } catch(err) {
                      globalResponse.send({
                        'message': err.message
                      });                      
                    }
                  }

                });
              } else {
                Doctor.find(searchQueryGlobalObject).skip(skipBy).limit(limitSize).exec(function(err, doctors) {

                  /* globalResponse.send({
                    data : doctors,
                    totalRecords : totalCount,
                    totalAccountNameCount: accountNameCount,
                    totalNonAccountNameCount: nonAccountNameCount,
                    searchResponseCount: doctors.length,
                    details: [skipBy, limitSize, searchQueryGlobalObject, sortingField, params.sortType],
                    whichCondition: 'test2'
                  }); */

                  globalCountForAsyncCalls = 0;

                  for (var i = 0; i < doctors.length; i++) {
                    try {
                      if (typeof doctors[globalCountForAsyncCalls].locationForSearch !== "undefined") {
                        var coOrdinates = doctors[globalCountForAsyncCalls].locationForSearch.coordinates;
                        var distance = distanceInMiles(params.lat, params.lon, coOrdinates[1], coOrdinates[0], 'M');
                      } else {
                        var distance = 0;
                      }
                      doctors[globalCountForAsyncCalls].distance = distance;
                      searchResponse[globalCountForAsyncCalls] = {"_source": doctors[globalCountForAsyncCalls], "fields": {"distance":  [distance] }};
                      globalCountForAsyncCalls++;

                      if (globalCountForAsyncCalls === doctors.length ) {
                        var jsonField = "_source." + sortingField;
                        jsonField = (params.sortType === "asc" ? "" : "-") + jsonField;
                        searchResponse = agile.orderBy(searchResponse, jsonField);
                        globalResponse.send({
                          data : searchResponse,
                          totalRecords : totalCount,
                          totalAccountNameCount: accountNameCount,
                          totalNonAccountNameCount: nonAccountNameCount,
                          searchResponseCount: searchResponse.length,
                          whichCondition: 3,
                          details: [skipBy, limitSize, searchQueryGlobalObject, sortingField, params.sortType]
                        });
                      }
                    } catch(err) {
                      globalResponse.send({
                        'message': err.message
                      });
                    }
                  }
                });
              }

            } else if (
              ( conditionMode === 'accountName' ) 
              || ( totalAccountNamePages >= (params.from + 1) && accountNameCount >= params.size )
            ) {
              // Query for Account Name only.

              /* globalResponse.send({
                data : [andQueryOptions, andQueryOptionsWithoutAccountName, conditionMode],
                totalRecords : totalCount,
                totalAccountNameCount: accountNameCount,
                totalNonAccountNameCount: nonAccountNameCount,
                whichCondition: "test 3"
              }); */
              searchQueryGlobalObject = andQueryOptions;

              if (params.sortName !== 'distance') {
                Doctor.find(searchQueryGlobalObject).sort({sortingField: (params.sortType === "asc" ? 1 : -1)}).skip(skipBy).limit(limitSize).exec(function(err, doctors) {

                  /* globalResponse.send({
                    data : doctors,
                    totalRecords : totalCount,
                    totalAccountNameCount: accountNameCount,
                    totalNonAccountNameCount: nonAccountNameCount,
                    searchResponseCount: doctors.length,
                    details: [skipBy, limitSize, searchQueryGlobalObject, sortingField, params.sortType],
                    whichCondition: 'test3'
                  }); */

                  globalCountForAsyncCalls = 0;
                  for (var i = 0; i < doctors.length; i++) {
                    try {
                      if (typeof doctors[globalCountForAsyncCalls].locationForSearch !== "undefined") {
                        var coOrdinates = doctors[globalCountForAsyncCalls].locationForSearch.coordinates;
                        var distance = distanceInMiles(params.lat, params.lon, coOrdinates[1], coOrdinates[0], 'M');
                      } else {
                        var distance = 0;
                      }
                      doctors[globalCountForAsyncCalls].distance = distance;
                      searchResponse[globalCountForAsyncCalls] = {"_source": doctors[globalCountForAsyncCalls], "fields": {"distance":  [distance] }};
                      globalCountForAsyncCalls++;

                      if (globalCountForAsyncCalls === doctors.length ) {
                        var jsonField = "_source." + sortingField;
                        jsonField = (params.sortType === "asc" ? "" : "-") + jsonField;
                        searchResponse = agile.orderBy(searchResponse, jsonField);
                        globalResponse.send({
                          data : searchResponse,
                          totalRecords : totalCount,
                          totalAccountNameCount: accountNameCount,
                          totalNonAccountNameCount: nonAccountNameCount,
                          whichCondition: 4,
                          details: [skipBy, limitSize, searchQueryGlobalObject, sortingField, params.sortType]
                        });
                      }
                    } catch(err) {
                      globalResponse.send({
                        'message': err.message
                      });
                    }
                  }
                });
              } else {
                Doctor.find(searchQueryGlobalObject).skip(skipBy).limit(limitSize).exec(function(err, doctors) {

                  /* globalResponse.send({
                    data : doctors,
                    totalRecords : totalCount,
                    totalAccountNameCount: accountNameCount,
                    totalNonAccountNameCount: nonAccountNameCount,
                    searchResponseCount: doctors.length,
                    details: [skipBy, limitSize, searchQueryGlobalObject, sortingField, params.sortType],
                    whichCondition: 'test4'
                  }); */

                  globalCountForAsyncCalls = 0;
                  for (var i = 0; i < doctors.length; i++) {

                    try {
                      if (typeof doctors[globalCountForAsyncCalls].locationForSearch !== "undefined") {
                        var coOrdinates = doctors[globalCountForAsyncCalls].locationForSearch.coordinates;
                        var distance = distanceInMiles(params.lat, params.lon, coOrdinates[1], coOrdinates[0], 'M');
                      } else {
                        var distance = 0;
                      }
                      doctors[globalCountForAsyncCalls].distance = distance;
                      searchResponse[globalCountForAsyncCalls] = {"_source": doctors[globalCountForAsyncCalls], "fields": {"distance":  [distance] }};
                      globalCountForAsyncCalls++;

                      if (globalCountForAsyncCalls === doctors.length ) {
                        var jsonField = "_source." + sortingField;
                        jsonField = (params.sortType === "asc" ? "" : "-") + jsonField;
                        searchResponse = agile.orderBy(searchResponse, jsonField);
                        globalResponse.send({
                          data : searchResponse,
                          totalRecords : totalCount,
                          totalAccountNameCount: accountNameCount,
                          totalNonAccountNameCount: nonAccountNameCount,
                          whichCondition: 5,
                          details: [skipBy, limitSize, searchQueryGlobalObject, sortingField, params.sortType]
                        });
                      }
                    } catch(err) {
                      globalResponse.send({
                        'message': err.message
                      });
                    }
                  }
                });
              }
            } else if (
              ( conditionMode === 'both' ) 
              || ( totalReminder === params.size )
            ) {
             
              /* globalResponse.send({
                data : [andQueryOptions, andQueryOptionsWithoutAccountName, conditionMode],
                totalRecords : totalCount,
                totalAccountNameCount: accountNameCount,
                totalNonAccountNameCount: nonAccountNameCount,
                whichCondition: "test 4"
              }); */
              // Query for both Account Name and Non Account Name.
              // Query for Account Name
              searchQueryGlobalObject = andQueryOptions;

              if (sortingField !== 'distance') {
                Doctor.find(searchQueryGlobalObject).sort({sortingField: (params.sortType === "asc" ? 1 : -1)}).skip(skipBy).limit(limitSize).exec(function(err, doctors) {

                  /* globalResponse.send({
                    data : doctors,
                    totalRecords : totalCount,
                    totalAccountNameCount: accountNameCount,
                    totalNonAccountNameCount: nonAccountNameCount,
                    searchResponseCount: doctors.length,
                    details: [skipBy, limitSize, searchQueryGlobalObject, sortingField, params.sortType],
                    whichCondition: 'test5'
                  }); */

                  globalCountForAsyncCalls = 0;
                  for (var i = 0; i < doctors.length; i++) {
                    try {
                      if (typeof doctors[globalCountForAsyncCalls].locationForSearch !== "undefined") {
                        var coOrdinates = doctors[globalCountForAsyncCalls].locationForSearch.coordinates;
                        var distance = distanceInMiles(params.lat, params.lon, coOrdinates[1], coOrdinates[0], 'M');
                      } else {
                        var distance = 0;
                      }
                      doctors[globalCountForAsyncCalls].distance = distance;
                      searchResponse[globalCountForAsyncCalls] = {"_source": doctors[globalCountForAsyncCalls], "fields": {"distance":  [distance] }};
                      globalCountForAsyncCalls++;
                      if (globalCountForAsyncCalls === doctors.length) {
                        
                        // Query for Non Account Name.
                        searchQueryGlobalObject = andQueryOptionsWithoutAccountName;

                        var limit = params.size - doctors.length;
                        var skipByInner = 0;
                        if (sortingField !== 'distance') {
                          Doctor.find(searchQueryGlobalObject).sort({sortingField: (params.sortType === "asc" ? 1 : -1)}).skip(skipByInner).limit(limit).exec(function(err, doctorsNonAccountName) {

                            globalCountForAsyncCallsInner = 0;

                            for (var j = 0; j < doctorsNonAccountName.length; j++) {
                              try {
                                if (typeof doctorsNonAccountName[globalCountForAsyncCallsInner].locationForSearch !== "undefined") {
                                  var coOrdinates = doctorsNonAccountName[globalCountForAsyncCallsInner].locationForSearch.coordinates;
                                  var distance = distanceInMiles(params.lat, params.lon, coOrdinates[1], coOrdinates[0], 'M');
                                } else {
                                  var distance = 0;
                                }
                                doctorsNonAccountName[globalCountForAsyncCallsInner].distance = distance;
                                searchResponse[searchResponse.length] = {"_source": doctorsNonAccountName[globalCountForAsyncCallsInner], "fields": {"distance":  [distance] }};
                                globalCountForAsyncCallsInner++;
                                if (globalCountForAsyncCallsInner === doctorsNonAccountName.length) {

                                  var jsonField = "_source." + sortingField;
                                  jsonField = (params.sortType === "asc" ? "" : "-") + jsonField;
                                  searchResponse = agile.orderBy(searchResponse, ["_source.accountName", jsonField]);

                                  globalResponse.send({
                                    data : searchResponse,
                                    totalRecords : totalCount,
                                    totalAccountNameCount: accountNameCount,
                                    totalNonAccountNameCount: nonAccountNameCount,
                                    whichCondition: 6,
                                    details: [skipBy, limitSize, searchQueryGlobalObject, sortingField, params.sortType]
                                  });                              
                                }
                              } catch(err) {
                                globalResponse.send({
                                  'message': err.message
                                });
                              }
                            }

                          });
                        } else {
                          Doctor.find(searchQueryGlobalObject).skip(skipByInner).limit(limit).exec(function(err, doctorsNonAccountName) {

                            globalCountForAsyncCallsInner = 0;
                            for (var j = 0; j < doctorsNonAccountName.length; j++) {
                              try {
                                if (typeof doctorsNonAccountName[globalCountForAsyncCallsInner].locationForSearch !== "undefined") {
                                  var coOrdinates = doctorsNonAccountName[globalCountForAsyncCallsInner].locationForSearch.coordinates;
                                  var distance = distanceInMiles(params.lat, params.lon, coOrdinates[1], coOrdinates[0], 'M');
                                } else {
                                  var distance = 0;
                                }
                                doctorsNonAccountName[globalCountForAsyncCallsInner].distance = distance;
                                searchResponse[searchResponse.length] = {"_source": doctorsNonAccountName[globalCountForAsyncCallsInner], "fields": {"distance":  [distance] }};
                                globalCountForAsyncCallsInner++;
                                if (globalCountForAsyncCallsInner === doctorsNonAccountName.length) {

                                  var jsonField = "_source." + sortingField;
                                  jsonField = (params.sortType === "asc" ? "" : "-") + jsonField;
                                  searchResponse = agile.orderBy(searchResponse, ["_source.accountName", jsonField]);

                                  globalResponse.send({
                                    data : searchResponse,
                                    totalRecords : totalCount,
                                    totalAccountNameCount: accountNameCount,
                                    totalNonAccountNameCount: nonAccountNameCount,
                                    whichCondition: 7,
                                    details: [skipBy, limitSize, searchQueryGlobalObject, sortingField, params.sortType]
                                  });                              
                                }
                              } catch(err) {
                                globalResponse.send({
                                  'message': err.message
                                });
                              }
                            }

                          });
                        }
                      }
                    } catch(err) {
                      globalResponse.send({
                        'message': err.message
                      });                      
                    }
                  }                  
                });
              } else {
                Doctor.find(searchQueryGlobalObject).skip(skipBy).limit(limitSize).exec(function(err, doctors) {

                  /* globalResponse.send({
                    data : doctors,
                    totalRecords : totalCount,
                    totalAccountNameCount: accountNameCount,
                    totalNonAccountNameCount: nonAccountNameCount,
                    searchResponseCount: doctors.length,
                    details: [skipBy, limitSize, searchQueryGlobalObject, sortingField, params.sortType],
                    whichCondition: 'test6'
                  }); */

                  globalCountForAsyncCalls = 0;
                  for (var i = 0; i < doctors.length; i++) {
                    try {
                      if (typeof doctors[globalCountForAsyncCalls].locationForSearch !== "undefined") {
                        var coOrdinates = doctors[globalCountForAsyncCalls].locationForSearch.coordinates;
                        var distance = distanceInMiles(params.lat, params.lon, coOrdinates[1], coOrdinates[0], 'M');                        
                      } else {
                        var distance = 0;
                      }
                      doctors[globalCountForAsyncCalls].distance = distance;
                      searchResponse[globalCountForAsyncCalls] = {"_source": doctors[globalCountForAsyncCalls], "fields": {"distance":  [distance] }};
                      globalCountForAsyncCalls++;
                      if (globalCountForAsyncCalls === doctors.length) {
                        // Query for Non Account Name.
                        searchQueryGlobalObject = andQueryOptionsWithoutAccountName;

                        var limit = params.size - doctors.length;
                        var skipByInner = 0;                        
                        if (sortingField !== 'distance') {
                          Doctor.find(searchQueryGlobalObject).sort({sortingField: (params.sortType === "asc" ? 1 : -1)}).skip(skipByInner).limit(limit).exec(function(err, doctorsNonAccountName) {

                            globalCountForAsyncCallsInner = 0;
                            for (var j = 0; j < doctorsNonAccountName.length; j++) {
                              try {
                                if (typeof doctorsNonAccountName[globalCountForAsyncCallsInner].locationForSearch !== "undefined") {
                                  var coOrdinates = doctorsNonAccountName[globalCountForAsyncCallsInner].locationForSearch.coordinates;
                                  var distance = distanceInMiles(params.lat, params.lon, coOrdinates[1], coOrdinates[0], 'M');
                                } else {
                                  var distance = 0;
                                }
                                doctorsNonAccountName[globalCountForAsyncCallsInner].distance = distance;
                                searchResponse[searchResponse.length] = {"_source": doctorsNonAccountName[globalCountForAsyncCallsInner], "fields": {"distance":  [distance] }};
                                globalCountForAsyncCallsInner++;
                                if (globalCountForAsyncCallsInner === doctorsNonAccountName.length) {

                                  var jsonField = "_source." + sortingField;
                                  jsonField = (params.sortType === "asc" ? "" : "-") + jsonField;
                                  searchResponse = agile.orderBy(searchResponse, ["_source.accountName", jsonField]);

                                  globalResponse.send({
                                    data : searchResponse,
                                    totalRecords : totalCount,
                                    totalAccountNameCount: accountNameCount,
                                    totalNonAccountNameCount: nonAccountNameCount,
                                    whichCondition: 8,
                                    details: [skipBy, limitSize, searchQueryGlobalObject, sortingField, params.sortType]
                                  });                              
                                }
                              } catch(err) {
                                globalResponse.send({
                                  'message': err.message
                                });
                              }
                            }

                          });
                        } else {                         
                          Doctor.find(searchQueryGlobalObject).skip(skipByInner).limit(limit).exec(function(err, doctorsNonAccountName) {
                                /* globalResponse.send({
                                  'message': [doctorsNonAccountName, skipByInner, limit]
                                }); */ 
                            globalCountForAsyncCallsInner = 0;
                            for (var j = 0; j < doctorsNonAccountName.length; j++) {
                              try {
                                if (typeof doctorsNonAccountName[globalCountForAsyncCallsInner].locationForSearch !== "undefined") {
                                  var coOrdinates = doctorsNonAccountName[globalCountForAsyncCallsInner].locationForSearch.coordinates;
                                  var distance = distanceInMiles(params.lat, params.lon, coOrdinates[1], coOrdinates[0], 'M');
                                } else {
                                  var distance = 0;
                                }
                                doctorsNonAccountName[globalCountForAsyncCallsInner].distance = distance;
                                searchResponse[searchResponse.length] = {"_source": doctorsNonAccountName[globalCountForAsyncCallsInner], "fields": {"distance":  [distance] }};
                                globalCountForAsyncCallsInner++;
                                if (globalCountForAsyncCallsInner === doctorsNonAccountName.length) {

                                  var jsonField = "_source." + sortingField;
                                  jsonField = (params.sortType === "asc" ? "" : "-") + jsonField;
                                  searchResponse = agile.orderBy(searchResponse, ["_source.accountName", jsonField]);

                                  globalResponse.send({
                                    data : searchResponse,
                                    totalRecords : totalCount,
                                    totalAccountNameCount: accountNameCount,
                                    totalNonAccountNameCount: nonAccountNameCount,
                                    whichCondition: 9,
                                    details: [skipBy, limitSize, andQueryOptions, andQueryOptionsWithoutAccountName, sortingField, params.sortType]
                                  });                              
                                }
                              } catch(err) {
                                globalResponse.send({
                                  'message': err.message
                                });
                              }
                            }

                          });
                        }

                      }
                    } catch(err) {
                      globalResponse.send({
                        'message': err.message
                      });                      
                    }
                  }

                });                
              }
            }
          }
        });
      });
    }

    function elasticSearch(req,res){
      console.log(req.body.params);
      var params = req.body.params || {};
       var payload = {
            "query" : {
                "bool" : {
                     "must" : [],
                     "filter":[]
                }
            }
       }
        payload["fields"]= ["_source"];
        params.specId = (params.specId || "")
        var specId = params.specId.toLowerCase();

        for(var i in params){
            if(i === 'lat'){
                if(!!params.lat && !!params.lon){

                    params.radius  =  params.radius || "50mi";
                    var geo =   { 
                        "geo_distance" : {
                              "distance" : params.radius || "50mi",
                              "address.geoLocation.location" : {
                                  "lat" :params.lat,
                                  "lon" :params.lon
                              }
                        }
                    }
                    
                   // console.log(specId);
                   
                   var radius = parseInt(params.radius.substring(0,params.radius.length-2));
                    payload.query.bool.filter.push(geo);

                    payload["script_fields"]= {
                      "distance" : {
                         "lang": "groovy",
                         "params" : {
                            "lat":params.lat,
                            "lon" : params.lon
                         },
                         "script" : "doc['address.geoLocation.location'].arcDistanceInMiles(lat,lon)"
                      }
                      // ,
                      // "certificationCodes" : {
                      //    "lang": "groovy",
                      //    "params" : {
                      //       "taxonomy":specId
                      //    },
                      //    "script" : "!!doc['boardCertificationsCode'].values.contains(taxonomy)"
                      // }
                    };
                     var sort;
                      if(!params.sortName){
                           params.sortName = 'distance';
                        }
                    if(params.sortName === 'distance'){
                      params.sortType = params.sortType || "asc";
                        sort = {    
                            "sort" : {
                            "_script" : {
                                "type" : "number",
                                "script" : {
                                    "inline": "distance = doc['address.geoLocation.location'].arcDistanceInMiles(lat,lon);difference = radius-distance;factor = difference/radius;multiple = factor*3;"+
                                    "if(doc['boardCertificationsCode'].values.contains(taxonomy)){ return (multiple )/5}else{return multiple/5}",
                                    "params" : {
                                         "shift":1,
                                         "lat":params.lat,
                                         "lon" : params.lon,
                                         "taxonomy" : specId,
                                         "radius" : radius
                                      }
                                    },
                                  "order" : "desc"
                                }
                              }
                          }
                    }

                    else if (params.sortName === 'fName'){
                        sort =
                             { 
                          "sort" : 
                          [
                              {
                                "fName": {
                                 "order": params.sortType
                                   }
                               }
                           ]
                          }
                        }
                    else if (params.sortName === 'lName'){
                        sort =
                        { 
                          "sort" : 
                          [
                              {
                                "lName": {
                                 "order": params.sortType
                                   }
                               }
                           ]
                          }
                        }





                    else{
                      if(!!specId){
                          sort = {    
                            "sort" : {
                            "_script" : {
                                "type" : "number",
                                "script" : {
                                    "inline": "distance = doc['address.geoLocation.location'].distanceInMiles(lat,lon);difference = radius-distance;factor = difference/radius;multiple = factor*3;"+
                                    "if(doc['boardCertificationsCode'].values.contains(taxonomy)){ return (multiple+2)/5}else{return multiple/5}",
                                    "params" : {
                                         "shift":1,
                                         "lat":params.lat,
                                         "lon" : params.lon,
                                         "taxonomy" : specId,
                                         "radius" : radius
                                      }
                                    },
                                  "order" : "desc"
                                }
                              }
                          }
                      }else{
                        sort = {    
                          "sort" : {
                          "_script" : {
                              "type" : "number",
                              "script" : {
                                  "inline": "distance = doc['address.geoLocation.location'].distanceInMiles(lat,lon);difference = radius-distance;factor = difference/radius;multiple = factor*3;"+
                                  "if(doc['boardCertificationsCode'].values.size() > 0){ return (multiple+2)/5}else{return multiple/5}",
                                  "params" : {
                                       "shift":1,
                                       "lat":params.lat,
                                       "lon" : params.lon,
                                       "taxonomy" : specId,
                                       "radius" : radius
                                    }
                                  },
                                "order" : "desc"
                              }
                            }
                        }
                      }
                    }
                      
                   
                    payload.sort = sort.sort;
                } 
            }else if(i === 'boardCertification'){
              if(!!params.boardCertification){
                if(!!specId){
                  var boardFilter = {
                      "script" : {
                        "script" :  {
                           "lang": "groovy",
                           "params" : {
                              "taxonomy":specId
                           },
                           "script" : "!!doc['boardCertificationsCode'].values.contains(taxonomy)"
                        }
                     }
                  }
                }else{
                  var boardFilter = {
                      "script" : {
                        "script" :  {
                           "lang": "groovy",
                           "params" : {
                              "taxonomy":specId
                           },
                           "script" : "doc['boardCertificationsCode'].size() > 0"
                        }
                     }
                  }
                }
                payload.query.bool.filter.push(boardFilter);
              }
            }else if(i === 'name'){
                if(!!params.name){
                    payload.query.bool.must.push({
                      "query_string" : {
                        "query":      "*"+params.name+"*",
                        // "type":       "most_fields",
                            // "analyzer":   "standard",
                        "fields":    [ "lName","fName","mName"]
                      }
                    });
                }
            }else if(i === 'lon' || i === 'radius' || i === 'from' || i === 'size' || i === 'sortType' || i === 'sortName'){

            }
            else if(i === 'specId' ){
                if(!!params[i]){
                    payload.query.bool.must.push({"match" : { 'taxonomy': params[i]}});
                }
            }else if(i === 'npi' ){
                if(!!params[i]){
                    payload.query.bool.must.push({"match" : { 'npi': params[i]}});
                }
            }else if(i === 'insuranceId' ){
                if(!!params[i]){
                    payload.query.bool.must.push({"match" : { 'insuranceIds': params[i]}});
                }
            }
            else if(i === 'language' ){
                if(!!params[i]){
                    payload.query.bool.must.push({"match" : { 'languagesSpoken': params[i]}});
                }
            }
            else{
                if(!!params[i]){
                    payload.query.bool.must.push({"match" : { [i]: params[i]}});  
                }
            }

        }

        // phone number mandatory check 
        payload.query.bool.must.push({"exists" : { "field": "address.phoneNo"}});  

        console.log(params);
         
        payload.size = parseInt(params['size']) || 10; 
        payload.from = parseInt(params['from'])*payload.size || 0;   
        payload.query.bool.should = [{has_child :{ 
                type : "appointments",
                "query" : {
                    "match_all": {}
                },
                inner_hits : {}
            }
        },{
            match_all : {}
        }];
        payload.query.bool["minimum_should_match"] = 0;

                // payload = {
                //     // "fields": [
                //     //     "_source"
                //     // ],
                //     "query" : { "match_all": {} },
                //     "script_fields" : {
                //       "sortField" : {
                //         "script": "

                //         b = doc['type'].value;
                //         c = 'N';
                //         if(b === c){ a = 10;}else{a = 100;};return a;",
                //          "params":{
                //             "shift":1
                //           }
                
                //     }}
         // a = doc['location'].distance(38,-71); 
          //  "sort": [
          //   "_score",
          //   {
          //     "_geo_distance": {
          //       "practiceLocationAddress.address.geoLocation.location": { 
          //         "lat":  40.715,
          //         "lon": -73.998
          //       },
          //       "order":         "asc",
          //       "unit":          "km", 
          //       "distance_type": "plane" 
          //     }
          //   }
          // ],
          //  "script_fields" : {
          //     "distance" : {
          //        "lang": "groovy",
          //        "params" : {
          //           "lat" : 47.1,
          //           "lon" : 8.1
          //        },
          //        "script" : "doc['practiceLocationAddress.address.geoLocation.location'].distanceInKm(lat,lon)"
          //     }
          //  }




          // solutig for smaple 

          // var payload = {
          // "query" : { "match_all": {} },
          // "fields": ["_source"],
          //           "script_fields" : {
          //             "sortField" : {
          //               "script": "doc['certifications.certficationName'].values",
          //                "params":{
          //                   "shift":1
          //                 }
          //       }
          //   }


            //  "sort" : {
            //     "_script" : {
            //         "type" : "number",
            //         "script" : {
            //             "inline": "if(shift == doc['type'].value){return doc['location'].distance(40,-73)*3;}else{return doc['location'].distance(40,-73)*4};",
            //             "params" : {
            //                  "shift":1
            //             }
            //         },
            //         "order" : "asc"
            //     }
            // }
            // }

            // {"query":{"match_all":{}},"fields":["_source"],"script_fields":{"sortField":{"script":"return doc['certifications.specialities.taxonomyCode'].values.contains(code);","params":{"shift":1,"code" : "fadc2med_gp2"}}}}
                    //  sort: [{
                    //     _geo_distance: {
                    //         "practiceLocationAddress.address.geoLocation.location": [{ 
                    //           "lat":  40.715,
                    //           "lon": -73.998
                    //         }],
                    //         order: "asc",
                    //         unit: "km"
                    //     }
                    // }]
                // }
              
                // payload = {
                //         query : {has_child : { type : "appointments",
                //             "query" : {
                //                 "match_all": {}
                //             },
                //             inner_hits : {}
                //         }
                //     }
                // }
                // payload.query.inner_hits = {};  

      console.log(JSON.stringify(payload));

        client.search({
          index: 'findadoctor',
          type: 'doctor',
          // index: 'sample',
          // type: 'restaurant',
          body: payload
        }).then(function (resp) {
            // console.log(resp._shards.failures);
            // console.log(resp.hits.total);
            // console.log(JSON.stringify(resp.hits.hits));
            // console.log(resp.hits.hits[0].inner_hits.appointments.hits.hits);
            // for(let val of resp.hits.hits)
            // {
            //     console.log(val.inner_hits.appointments.hits.hits);
            // }
            // console.log([0].fields);
            // var hits = resp.hits.hits;
            //  if(!!params.lat&& !!params.lon){
            //      for (var i = 0; i < hits.length; i++) {
            //         for (var j = 0; j < hits[i]._source.practiceLocationAddress.length; j++) {
            //          hits[i]._source.practiceLocationAddress[j].distance = distance(hits[i]._source.practiceLocationAddress[j].address.geoLocation.location.lat, hits[i]._source.practiceLocationAddress[j].address.geoLocation.location.lon, +params.lat,+params.lon, "M");
            //                 if( parseInt(hits[i].sort[0]) == parseInt( hits[i]._source.practiceLocationAddress[j].distance ) ){ 
            //                     hits[i]._source.practiceLocationAddress = [hits[i]._source.practiceLocationAddress[j]];
            //                     break;
            //                 } 
            //             };
            //         };
            // }

            // var sol = sendResponse(req,res);
            // console.log(sol);


			var hits = resp.hits.hits;
			var total = resp.hits.total;
			var count =0;
			for (var i = 0; i < hits.length; i++) {
				var npi = hits[i]._source.npi;
				Doctor.findOne({'npi':npi}, function(err, user) {
					if (user) {					
						for (var j = 0; j < hits.length; j++) {
							if (hits[j]._source.npi === user.npi) {
								hits[j]._source.accountName = user.accountName;
								count++;
								if (count === hits.length) {
									res.send({
										data : hits,
										totalRecords : resp.hits.total
									});							
								}								
							}
						}
					}					
				});
			}
            
            /* res.send({
                data : resp.hits.hits,
                totalRecords : resp.hits.total
            }); */
        }, function (err) {

            console.log(err);
            console.trace(err.message);
        });

    };

    // function distance(lat1, lon1, lat2, lon2, unit) {
    //     var radlat1 = Math.PI * lat1/180
    //     var radlat2 = Math.PI * lat2/180
    //     var theta = lon1-lon2
    //     var radtheta = Math.PI * theta/180
    //     var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    //     dist = Math.acos(dist)
    //     dist = dist * 180/Math.PI
    //     dist = dist * 60 * 1.1515
    //     if(unit == "M"){
    //     }else if (unit=="K"){
    //         { dist = dist * 1.609344 }
    //     }else if (unit=="N") { dist = dist * 0.8684 }
    //     return dist
    // }

    this.resourcePath = '/search';
    this.description = "Search For doctors";
    this.getMappings = function() {
        return {
            '/search': {
                'post' :{
                    // callbacks: [elasticSearch],
                    callbacks: [mongoDBSearch],
                    resource: 'Doctor',
                    action: 'getDoctorBySearch',
                    summary: "getDoctorBySearch",
                    notes: "This method returns list of doctor by search",
                    parameters: [
                        paramType.body("body", "Enter search parameters", "serachObj", true)
                    ],
                    responseMessages: [{
                        "code": 400,
                        "message": "Invalid parameters"
                    }]
                }
            }
        }
    };
};

module.exports = {
    getInst : function() {
        return new searchAPI();
    }
};


// {
//  "query" : { "match_all": {} }, "script_fields" : {
//       "distance" : {
//          "script" : {
//             "lang" : "painless",
//             "inline" : "doc[practiceLocationAddress]"
//             }
//         },
//     }
//    size: 1
// }


// mr = db.runCommand({
//   "mapreduce" : "doctors",
//   "map" : function() {
//     for (var key in this) { emit(key, null); }
//   },
//   "reduce" : function(key, stuff) { return null; }, 
//   "out": "doctors" + "_keys"
// })


