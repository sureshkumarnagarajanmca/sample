var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

/* var url = 'mongodb://10.12.62.135:27017/fadupload_ms';
// var url = 'mongodb://127.0.0.1:27017/fadupload_ms';
				MongoClient.connect(url, function(err, db) {
					assert.equal(null, err);
						console.log("Connected correctly to server.");
						db.collection('doctors').find({"locationForSearch": {$exists: false}, "address.geoLocation.location.lon": {$exists: true}}).sort({'_id': -1}).limit(50000).toArray(function(err, result) {
							if(!err) {
								var location;
								for (var i = 0; i < result.length; i++) {
									location = {
										"locationForSearch" : {
											"type": "Point",
											"coordinates": [parseFloat(result[i].address.geoLocation.location.lon), parseFloat(result[i].address.geoLocation.location.lat)]
										}
									};
									db.collection('doctors').update({"npi": result[i].npi}, {$set: location}, function(err, updateResult) {
										console.log('success');
									});
								}
							} else
								console.log(err);
						});
				
				});*/
				

var url = 'mongodb://10.12.62.135:27017/fadupload_ms';
MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	mongodbSearch(db);
});

function mongodbSearch(db) {
	db.collection('doctors').count({"$and":[{"locationForSearch":{"$near":{"$geometry":{"type":"Point","coordinates":[-74.09463110000002,40.62743940000001]},"$maxDistance":8046.7}}},{"accountName":"NULL"},{"taxonomy":{"$elemMatch":{"$eq":"207Q00000X"}}}]}, function(err, count) {
		console.log(count);
	});
	db.collection('doctors').find({"$and":[{"locationForSearch":{"$near":{"$geometry":{"type":"Point","coordinates":[-74.09463110000002,40.62743940000001]},"$maxDistance":8046.7}}},{"accountName":"NULL"},{"taxonomy":{"$elemMatch":{"$eq":"207Q00000X"}}}]}).sort({'fName': 1}).skip(10).limit(10).toArray(function(err, result) {
		if(!err) {
			for (var i = 0; i < result.length; i++) {
				console.log(result[i].fName);
			}
		}
	});
}