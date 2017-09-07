var js2xmlparser = require('js2xmlparser');

var request = require('request');
var reqJson = {
	"Authentication" :{
		"UserName" : "chtesting",
		"Password" : "chtesting"
	},
	"EligibilityRequestData" : {
		"RequestTraceNo" : 	994452653,
		"PayerName" : "ABC WELFARE TRUST FUND",
		"PayerID" : "PayerID",
		"ProviderLastName": "Anderson",
		"ProviderFirstName": "Joseph",
		"ProviderMiddleName":"",
		"ProviderNPI" : 1234567893,
		"SubscriberLastName" : "Smith",
		"SubscriberFirstName" : "Jacob",
		"SubscriberMiddleName" : "",
		"SubscriberID" : "ABC000001",
		"SubscriberDOB" : "05/21/1980",
		"SubscriberGender" : "M",
		"Relationship" : "Spouse",
		"PatientLastName" : "Smith",
		"PatientFirstName" : "Katherine",
		"PatientMiddleName" : "",
		"PatientDOB" : "Katherine",
		"PatientGender" : "M"
	}
}

var jsonxml = require('jsontoxml');
var xml = jsonxml({RequestInfo : reqJson});

var request = require('request');
request('http://70.35.195.177/MCHRealtimeAPI/api/values/SubmitRequest?requestXML='+xml, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Show the HTML for the Google homepage. 
  }else{
  	console.log(response);
  }
})

// var requestObj = js2xmlparser.parse("RequestInfo", reqJson);

// console.log(requestObj);