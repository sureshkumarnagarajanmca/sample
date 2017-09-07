var fs = require('fs');
var moment = require('moment');
var TaxonomyService = require('../api/services/TaxonomyService');

var AppointmentService = require('../api/services/AppointmentService');
var AvailabilityService = require('../api/services/AvailabilityService');

var parentLevelService = require('./getParentsLevelsForTaxonomies.js')
var Q = require('q');


var p =0;
exports.pushData = function(data,cb){
	// console.log(JSON.stringify(data.orgIds[0].orgId));
		// var logData = {
	 //    	taxonomy : data.taxonomy,
	 //    	npi : data.npi,
	 //    	isSubscribed : data.isSubscribed,
	 //    	credentialText: data.credentialText,
	 //    	// boardCertified : data.boardCertified,
	 //    	gender : data.gender,
	 //    	userId : data.userId,
	 //    	languagesSpoken : data.languagesSpoken,
	 //    	likes : data.likes,
	 //    	lName : data.lName,
	 //    	fName : data.fName,
	 //    	mName : data.mName,
	 //    	documentType: "logs"
	 //    }
	 //    logData.practiceLocationAddress = [];
	 //    for (var i = 0; i < data.otherAddress.length; i++) {
	 //    	logData.practiceLocationAddress[i] = {};
	 //    	logData.practiceLocationAddress[i].address = data.otherAddress[i]
	 //    };
	 //    if(!!data.certifications.certficationName){
	 //    	logData.boardCertified  = true;
	 //    }else{
	 //    	logData.boardCertified  = false;
	 //    }
	 //    fs.appendFile(file, JSON.stringify(logData)+"\n", function(err) {
     //    if(err) {
  	 //    console.log(err);
	 //        }
	 //        cb();
	 //        p++;
	 //        console.log(p)
	 //    });
}
var pushDoctorDataOnPractiseLocationfile = __dirname+'/../../doctorAddress.json';
exports.pushDoctorDataOnPractiseLocation = function(data, cb){
	'use strict'
	var insertData = "";
	var updateCounter = 0;
	if(!!data){
		var logData = {
	    	npi : data.npi,
	    	isSubscribed : data.isSubscribed,
	    	credentialText: data.credentialText,
	    	certifications : data.certifications,
	    	gender : data.gender,
	    	userId : data.userId,
	    	languagesSpoken : data.languagesSpoken,
	    	likes : data.likes,
	    	lName : data.lName,
	    	fName : data.fName,
	    	mName : data.mName,
	    	action : "insert",
	    	documentType: "doctor",
	    	insuranceIds : data.insuranceIds,
	    	prefix : data.prefix || ''
	    }


	    if(!logData.certifications){
	    	logData.certifications = [];
	    }
	    if(data.taxonomy.length === 0){
	    	logData.taxonomy = [];
	    }else{
	    	logData.taxonomy = data.taxonomy;
	    }
	    // console.log(data.taxonomy);

	    if(logData.taxonomy.length > 0){
			Q.all([parentLevelService.getParentsForTaxonomies(logData.taxonomy),
	    	parentLevelService.getParentsForBoardCertifications(logData.certifications)])
		    .then(function(succ){
		    	// console.log(succ)
				// if(succ[0].length > 0){
					if(succ[0].taxonomyArray.length > 0){
			    		logData.taxonomy = succ[0].taxonomyArray ;
			    	}
			    	logData.taxonomyByLevel = succ[0].taxonomyByLevel;
		    	
		    	logData.boardCertificationsCode = succ[1];
		    	// console.log(logData);
		    		    	// console.log(JSON.stringify(logData.boardCertificationsCode));

		    	// if(logData.npi === '1215930250'){
		    		// console.log(logData);
		    	// }else{
		    		if(Array.isArray(data.otherAddress) &&  Object.keys(succ[0].taxonomyByLevel).length > 0){
		    			if(data.otherAddress.length > 0){
							pushingToLogstash();	    				
		    			}else{
		    				cb()
		    			}
					}else{
						cb()
		    		}
		    },function(err){
		    	cb();

		    })
	    }else{
	    	cb();
	    }
	    
	    function pushingToLogstash() {
		    for(let address of data.otherAddress){
		    	let element = {};
		    	for(var key in logData){
		    		element[key] = logData[key];
		    	}
		    	element.address = address;
		    	// console.log(element);
				element.addressDoctorId = element.userId+element.address.Line1StreetAddress+element.address.zipCode;
		    // console.log(element);
		    	fs.appendFile(pushDoctorDataOnPractiseLocationfile, JSON.stringify(element)+"\n", function(err) {
		            updateCounter++;
		            if(err) {
		              console.log(err);
			        }
			        if(updateCounter == data.otherAddress.length){
	   		        	p++;
				        // console.log(p)
			        	cb();
			        }
			    });
	    	}
	    }
    }
}
var deleteDoctorDataOnPractiseLocationfile = __dirname+'/../../deleteDoctorAddress.json';
exports.deleteDocumentFromDoctorAddress = function(data){
	'use strict'
	var deferred = Q.defer();
	var deleteData = "";
	var updateCounter = 0;
	if(!!data){
	 	if(Array.isArray(data.otherAddress)){
		 	if(data.otherAddress.length > 0){
				pushingToLogstash();
		 	}else{
		 		deferred.resolve();
		 	}
		}else{
			deferred.resolve();
		}
	    function pushingToLogstash() {
		    for(let address of data.otherAddress){
	    		let element = {};
		    	element.addressDoctorId = data.userId+address.Line1StreetAddress+address.zipCode;
		    	element.action = "delete";
		    	element.documentType = "doctor";
    /*                 fs.appendFileSync(deleteDoctorDataOnPractiseLocationfile, JSON.stringify(element)+"\n");
                       updateCounter++;
                                if(updateCounter == data.otherAddress.length){
                                        p++;
                                        // console.log(p)
                                        deferred.resolve();
                                }
   */			fs.appendFile(deleteDoctorDataOnPractiseLocationfile, JSON.stringify(element)+"\n", function(err) {
		            if(err) {
		              console.log(err);
			        }
			        updateCounter++;
			        if(updateCounter == data.otherAddress.length){
	   		        	p++;
				        // console.log(p)
			        	deferred.resolve();
			        }
			    });
	    	}
	    }
	}else{
		deferred.resolve();
	}
	return deferred.promise;
}

exports.deleteDocumentFromDoctorAddressOnOrgId = function(userId,orgIdsrray){
	'use strict'
	var deferred = Q.defer();
	var deleteData = "";
	var updateCounter = 0;
	if(!!orgIdsrray){
	    function pushingToLogstash() {
		    for(let orgid of orgIdsrray){
	    		let element = {};
		    	element.addressDoctorId = userId+orgid;
		    	element.action = "delete";
		    	element.documentType = "doctor";
				fs.appendFile(deleteDoctorDataOnPractiseLocationfile, JSON.stringify(element)+"\n", function(err) {
		            if(err) {
		              console.log(err);
			        }
			        updateCounter++;
			        if(updateCounter == orgIdsrray.length){
	   		        	p++;
			        	deferred.resolve();
			        }
			    });
	    	}
	    }
       pushingToLogstash();
	}else{
		deferred.resolve();
	}
	return deferred.promise;
}

var pushSingedInUpdatedDoctorDataOnPractiseLocationfile = __dirname+'/../../updatedDoctorAddress.json'
exports.pushUpdateDoctorAddressDocument = function(data){
        

	'use strict'
	var deferred = Q.defer();
	var insertData = "";
	var updateCounter = 0;
	console.log(data.certifications);
        if(!!data){
		var logData = {
	    	taxonomy : data.taxonomy,
	    	npi : data.npi,
	    	isSubscribed : data.isSubscribed,
	    	credentialText: data.credentialText,
	    	certifications : data.certifications,
	    	gender : data.gender,
	    	userId : data.userId,
	    	languagesSpoken : [37],       // data.languagesSpoken,
	    	likes : data.likes,
	    	lName : data.lName,
	    	fName : data.fName,
	    	mName : data.mName,
	 
	    	insuranceIds  :  ['58cb818c02b6787c461b3507'], // data.insuranceIds,
	    	prefix : data.prefix || ''
	    }
	    // if(!logData.certifications){
	    // 	logData.certifications = [];
	    // }

	    Q.all([parentLevelService.getParentsForTaxonomies(logData.taxonomy),
	    	parentLevelService.getParentsForBoardCertifications(logData.certifications),
	    	AvailabilityService.getDoctoravailability(data.userId)])
	    .then(function(succ){
	    	// logData.taxonomyArray  = succ[0].taxonomyArray
	    	   	if(succ[0].taxonomyArray.length > 0){
	    			logData.taxonomy = succ[0].taxonomyArray ;
	    		}else{
	    			logData.taxonomy = [];
	    		}

	    		if(!!logData.taxonomyByLevel){
			    	logData.taxonomyByLevel = succ[0].taxonomyByLevel;
	    		}else{
			    	logData.taxonomyByLevel = {};
	    		}
                console.log("succ : ");
                console.log(succ[1]);
	    	logData.boardCertificationsCode = succ[1];
	    	if(Array.isArray(data.otherAddress) &&  Object.keys(succ[0].taxonomyByLevel).length > 0){
	    		pushingToLogstash(succ[2]);
    		}else{
		    	deferred.resolve();
    		}
	    },function(err){
	    	deferred.resolve();
	    	// pushingToLogstash();
	    })
	    
	    function pushingToLogstash(availabilityData) {
		  /*  for(let organization of data.orgIds){
		    	let element = {};
		    	for(let key in logData){
		    		element[key] = logData[key];
		    	}
                        element.documentType = "doctor";
	                element.action  ="update";
		    	element.address = organization.orgId.pracAddress;
		    	element.orgName = organization.orgId.orgName;
		    	element.orgId = organization.orgId._id;
		    	if(!!availabilityData[organization.orgId._id]){
			    	element.availabileTime = availabilityData[organization.orgId._id];
			    }
			//element.addressDoctorId = element.userId+organization.orgId._id;
                 */

               for(let pracAdd of data.otherAddress){
		    	let element = {};
		    	for(let key in logData){
		    		element[key] = logData[key];
		    	}
                        element.documentType = "doctor";
	                element.action  ="update";
                var address = {
                	"geoLocation" : pracAdd.geoLocation,
                	"phoneNo" :pracAdd.phoneNo,
                    "zipCode" : pracAdd.zipCode,
                    "faxNo" :pracAdd.faxNo,
                    "state" : pracAdd.state,
                    "city" :pracAdd.city,
                    "Line1StreetAddress"  : pracAdd.Line1StreetAddress,
                    "Line2StreetAddress" : pracAdd.Line2StreetAddress,
                    "country" :"USA"
                }


		    	element.address = address ;
		    	element.orgName = pracAdd.organizationLegalName;
		    	element.orgId =  pracAdd._id;


               element.addressDoctorId = element.userId+element.address.Line1StreetAddress+element.address.zipCode;	
              console.log( JSON.stringify(element) );
    	fs.appendFile(pushSingedInUpdatedDoctorDataOnPractiseLocationfile, JSON.stringify(element)+"\n", function(err) {
		            updateCounter++;
		            if(err) {
		              console.log(err);
			        }
			        if(updateCounter == data.orgIds.length){
	   		        	p++;
				        console.log(p)
			        	deferred.resolve();
			        }
			    });
	    	}
	    }
    }else{
		deferred.resolve();
	}
	return deferred.promise;
}

// exports.pushUpdatePartialDoctorAddressDocument = function(data){
// 	'use strict'
// 	var insertData = "";
// 	var updateCounter = 0;
// 	var deferred = Q.defer();
// 	if(!!data){
// 		var logData = {
// 	    	taxonomy : data.taxonomy,
// 	    	npi : data.npi,
// 	    	isSubscribed : data.isSubscribed,
// 	    	credentialText: data.credentialText,
// 	    	certifications : data.certifications,
// 	    	gender : data.gender,
// 	    	userId : data.userId,
// 	    	languagesSpoken : data.languagesSpoken,
// 	    	likes : data.likes,
// 	    	lName : data.lName,
// 	    	fName : data.fName,
// 	    	mName : data.mName,
// 	    	documentType: "doctor",
// 	    	insuranceIds : data.insuranceIds,
// 	    	prefix : data.prefix
// 	    }
// 	    if(!logData.certifications){
// 	    	logData.certifications = [];
// 	    }
	    
// 	    Q.all([parentLevelService.getParentsForTaxonomies(logData.taxonomy),
// 	    	parentLevelService.getParentsForBoardCertifications(logData.certifications)])
// 	    .then(function(succ){
// 	    	logData.taxonomy = succ[0];
// 	    	logData.boardCertificationsCode = succ[1];
// 	    	pushingToLogstash();
// 	    },function(err){
// 	    	// pushingToLogstash();
// 	    	// cb();
// 	    	deferred.resolve();
// 	    })


	    
// 	    function pushingToLogstash() {
// 		    for(let organization of data.orgIds){
// 		    	let element = {};
// 		    	for(let key in logData){
// 		    		element[key] = logData[key];
// 		    	}
// 		    	element.address = organization.orgId.pracAddress;
// 		    	element.orgName = organization.orgId.orgName;
// 		    	element.action = "update";
// 		    	element.orgId = organization.orgId._id;
// 				element.addressDoctorId = element.userId+organization.orgId._id;
// 				console.log(element);
// 		    	fs.appendFile(pushSingedInUpdatedDoctorDataOnPractiseLocationfile, JSON.stringify(element)+"\n", function(err) {
// 		            updateCounter++;
// 		            if(err) {
// 		              console.log(err);
// 			        }
// 			        if(updateCounter == data.orgIds.length){
// 	   		        	p++;
// 	        	    	deferred.resolve();
// 			        }
// 			    });
// 	    	}
// 	    }
//     }else{
//     	deferred.resolve();
//     }
//     return deferred.promise;
// }

// exports.pushAvailabilityOfDOctorOnLocation = function(data){

// }

var fileAppointments = __dirname+'/../../appointmentsAndLeaves.json';
exports.pushAvailabilityOfDOctorOnLocation = function(data, availability,doctorAvailabitlityObject){
	'use strict'
	var deferred = Q.defer();
	var insertData = "";
	var updateCounter = 0;
	if(!!data){
		// console.log(doctorAvailabitlityObject);
		var logData = {
	    	taxonomy : data.taxonomy,
	    	npi : data.npi,
	    	isSubscribed : data.isSubscribed,
	    	credentialText: data.credentialText,
	    	certifications : data.certifications,
	    	gender : data.gender,
	    	userId : data.userId,
	    	languagesSpoken : data.languagesSpoken,
	    	likes : data.likes,
	    	lName : data.lName,
	    	fName : data.fName,
	    	mName : data.mName,
	    	documentType: "doctor",
	    	insuranceIds : data.insuranceIds,
	    	prefix : data.prefix || '',
	    	update: "availability"
	    }
	    if(!logData.certifications){
	    	logData.certifications = [];
	    }


	    
	    Q.all([parentLevelService.getParentsForTaxonomies(logData.taxonomy),
	    	parentLevelService.getParentsForBoardCertifications(logData.certifications)])
	    .then(function(succ){
	    	// logData.taxonomy = succ[0];
    		if(succ[0].taxonomyArray.length > 0){
    			logData.taxonomy = succ[0].taxonomyArray ;
    		}else{
    			logData.taxonomy = [];
    		}

    		if(!!logData.taxonomyByLevel){
		    	logData.taxonomyByLevel = succ[0].taxonomyByLevel;
    		}else{
		    	logData.taxonomyByLevel = {};
    		}
	    	logData.boardCertificationsCode = succ[1];
	    	if(Array.isArray(data.otherAddress) &&  Object.keys(succ[0].taxonomyByLevel).length > 0){
	    		pushingToLogstash();
    		}else{
		    	deferred.resolve();
    		}
	    },function(err){
	    	pushingToLogstash();
	    })
	    
	    function pushingToLogstash() {
		    for(let organization of data.orgIds){
	    		// console.log(JSON.stringify(organization));
		    	let element = {};
		    	for(let key in logData){
		    		element[key] = logData[key];
		    	}
		    	element.address = organization.orgId.pracAddress;
		    	element.orgName = organization.orgId.orgName;
		    	element.orgId = organization.orgId._id;
				element.addressDoctorId = element.userId+organization.orgId._id;
				element.action = "update";
				if(availability[organization.orgId["_id"]]){
					element.availabileTime = availability[organization.orgId["_id"]];
					for(let org of doctorAvailabitlityObject.availability){
						if(org.orgId === organization.orgId["_id"]){
							element.allowedSlots = org.allowedSlots;
						}
					}
				}
		    	fs.appendFile(pushSingedInUpdatedDoctorDataOnPractiseLocationfile, JSON.stringify(element)+"\n", function(err) {
		            if(err) {
		              console.log(err);
			        }
		            updateCounter++;
			        if(updateCounter == data.orgIds.length){
	   		        	p++;
				        console.log(p)
			        	deferred.resolve();
			        }
			    });
	    	}
	    }
    }else{
		deferred.resolve();
	}
	return deferred.promise;
}


exports.pushleaveDataIntoAppointments = function(data){
	'use strict'
	var insertData = "";
	var updateCounter = 0;
	var deferred = Q.defer();
	if(!!data){
		var logData = {
	    	orgId : data.orgId,
	    	doctorId: data.doctorId,
	    	doctorLeave : true,
	    	documentType: "appointments",
	    }
	    logData.startTime = moment(data.startTime)*1;
	    logData.endTime = moment(data.endTime)*1;
	    logData.parentId = data.doctorId+data.orgId;
	    logData.documentId = data["_id"];
	    function pushingToLogstash() {
	    	fs.appendFile(fileAppointments, JSON.stringify(logData)+"\n", function(err) {
	            if(err) {
	              console.log(err);
		        }
	        	deferred.resolve();
		    });
	    }

	    pushingToLogstash();
    }else{
    	deferred.resolve();
    }
    return deferred.promise;
}

exports.pushappointmentDataIntoAppointments = function(data){
	'use strict'
	var insertData = "";
	var updateCounter = 0;
	var deferred = Q.defer();
	AppointmentService.getAppointmentForLogstash(data)
	.then(function(succ){
		var logData = {};
		if(succ.length > 0){
			logData.startTime = data.startTime;
			logData.doctorId = data.doctorId;
			logData.endTime = data.endTime;
			logData.parentId = data.doctorId+data.orgId;
			logData.appointmentsCount = succ.length;
			logData.orgId = data.orgId;
			logData.documentId = data.doctorId+"-"+data.orgId+"-"+data.startTime+"-"+data.endTime;
			logData.documentType = "appointments";
			logData.doctorLeave = false;
		}else{
			logData.documentId = data.doctorId+"-"+data.orgId+"-"+data.startTime+"-"+data.endTime;
			logData.action  = "delete";
			logData.documentType = "appointments";
			logData.parentId = data.doctorId+data.orgId;
		}
		pushingToLogstash(logData);
	},function(err){
		deferred.resolve();
	});
	
	function pushingToLogstash(logData) {
    	fs.appendFile(fileAppointments, JSON.stringify(logData)+"\n", function(err) {
            if(err) {
              console.log(err);
	        }
        	deferred.resolve();
	    });
    }
    return deferred.promise;
}


var deleteLeaveInfo =  __dirname+'/../../deleteLeaves.json';
exports.deleteLeaveDataInAppointments = function(leaveId){
	'use strict'
	var insertData = "";
	var updateCounter = 0;
	var deferred = Q.defer();
	var logData = {};
	logData.documentId = leaveId;
	logData.action  = 'delete';
	logData.documentType = "appointments";
	fs.appendFile(deleteLeaveInfo, JSON.stringify(logData)+"\n", function(err) {
        if(err) {
          console.log(err);
        }
    	deferred.resolve();
    });
    return deferred.promise;
}


