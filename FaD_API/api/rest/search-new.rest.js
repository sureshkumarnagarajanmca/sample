var config      = require('../../config');
var appControlListService = require('../services/AppControlListService.js'),
    errors = require('../errors'),
    errorHandler = require('../serviceHandler').errorHandler,
    paramType = require('../validator/paramTypes.js'),
    request = require('request');
	
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var Q = require('q');
var Doctor = require('../../db/dbModels/Doctors');
var mongoose = require('mongoose');
var agile = require('agile');

function searchNewAPI() {
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
	
	
	function mongoDBSearch(req,res) {
		var url = 'mongodb://10.12.62.135:27017/fadupload_ms';
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			searchResults(db, req,res);
		});		
	}
	
	
	function searchResults(db, req,res) {
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
			// locationForSearchObject['locationForSearch'] = {$geoWithin: { $centerSphere: [ [ params.lon, params.lat ], parseInt(params.radius.substring(0, params.radius.length - 2)) / 3959 ] }};
			locationForSearchObject['locationForSearch'] = {"$near" :{"$geometry" : {"type" : "Point", "coordinates" : [params.lon, params.lat] }, "$maxDistance" : parseInt(params.radius.substring(0, params.radius.length - 2)) * 1609.34}};
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
		
		db.collection('doctors').count(searchQueryGlobalObject, function(err, count) {		
			accountNameCount = count;

			searchQueryGlobalObject = andQueryOptionsWithoutAccountName;

			db.collection('doctors').count(searchQueryGlobalObject, function(err, innerCount) {
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
						db.collection('doctors').find(searchQueryGlobalObject).sort({sortingField: (params.sortType === "asc" ? 1 : -1)}).skip(skipBy).limit(limitSize).toArray(function(err, doctors) {

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
						db.collection('doctors').find(searchQueryGlobalObject).skip(skipBy).limit(limitSize).toArray(function(err, doctors) {

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
						db.collection('doctors').find(searchQueryGlobalObject).sort({sortingField: (params.sortType === "asc" ? 1 : -1)}).skip(skipBy).limit(limitSize).toArray(function(err, doctors) {

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
						db.collection('doctors').find(searchQueryGlobalObject).skip(skipBy).limit(limitSize).toArray(function(err, doctors) {

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

						db.collection('doctors').find(searchQueryGlobalObject).sort({sortingField: (params.sortType === "asc" ? 1 : -1)}).skip(skipBy).limit(limitSize).toArray(function(err, doctors) {

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
									
									// db.collection('doctors').find({"$and": [{"locationForSearch": {"$near": {"$geometry": {"type": "Point","coordinates": [-74.09463110000002,40.62743940000001]},"$maxDistance": 8046.7}}},{"accountName": "NULL"},{"taxonomy": {"$elemMatch": {"$eq": "207Q00000X"}}}]}, {"fName" : 1, "_id" : 0}).sort({"fName": 1}).skip(0).limit(10).toArray(function(err, doctors) {
									// {"fName": 1}
									var sortingOrderInNumbers = (params.sortType === "asc" ? 1 : -1);
									var sortObj = {};
									sortObj[sortingField] = sortingOrderInNumbers;
									db.collection('doctors').find(searchQueryGlobalObject, {"fName" : 1, "_id" : 0}).sort(sortObj).skip(0).limit(10).toArray(function(err, doctors) {
									  globalResponse.send({
										data : doctors,
										whichCondition: 'new'
									  });							
									});
								  db.collection('doctors').find(searchQueryGlobalObject).sort({sortingField: (params.sortType === "asc" ? 1 : -1)}).skip(skipByInner).limit(limit).toArray(function(err, doctorsNonAccountName) {								  
									  
						  /* globalResponse.send({
							data : [doctors, doctorsNonAccountName],
							totalRecords : totalCount,
							totalAccountNameCount: accountNameCount,
							totalNonAccountNameCount: nonAccountNameCount,
							searchResponseCount: doctors.length,
							details: [skipBy, limitSize, searchQueryGlobalObject, sortingField, params.sortType],
							whichCondition: 'test7'
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
								  db.collection('doctors').find(searchQueryGlobalObject).skip(skipByInner).limit(limit).toArray(function(err, doctorsNonAccountName) {

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
						db.collection('doctors').find(searchQueryGlobalObject).skip(skipBy).limit(limitSize).toArray(function(err, doctors) {

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
								  db.collection('doctors').find(searchQueryGlobalObject).sort({sortingField: (params.sortType === "asc" ? 1 : -1)}).skip(skipByInner).limit(limit).toArray(function(err, doctorsNonAccountName) {

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
								  db.collection('doctors').find(searchQueryGlobalObject).skip(skipByInner).limit(limit).toArray(function(err, doctorsNonAccountName) {
									  
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
	
    this.resourcePath = '/searchNew';
    this.description = "Search For doctors";
    this.getMappings = function() {
        return {
            '/searchNew': {
                'post' :{
					callbacks: [mongoDBSearch],
                    resource: 'Doctor',
                    action: 'mongoDBSearch',
                    summary: "mongoDBSearch",
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
}

module.exports = {
    getInst : function() {
        return new searchNewAPI();
    }
};