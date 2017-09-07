/**
 * Created by pradeep on 3/7/16.
 */


var Doctor = require('../../db/dbModels/Doctors');
var TaxonomyService = require('../services/TaxonomyService');
var HospitalService = require('../services/HospitalService');
var Q = require('q');
var Client = require('node-rest-client').Client;
var moment = require('moment');

/*
* getDoctorByQuery() returns list of doctors
* This method serves like a generic query builder.
* @param <Object> query is a json object which contains condition key and value Ex: key : 'address.state' value: 'CA'
* @return <Array> doctors This method returns 10 records and it sorts on _id field in descending order
 */
exports.getDoctorByQuery = function(query){
    var deferred = Q.defer();
    Doctor.find(query)
        .sort({'_id': -1})
        .limit(10)
        .exec(function(err, doctors) {
            if (err) {
                deferred.reject({"error":"Error while retrieving the doctors list"});
            }else {
                deferred.resolve(doctors);
            }
        });
    /*Doctor.find(query, function(err, doctors) {
        if (err) {
            deferred.reject({"error":"Error while finding the doctor"});
        }else {
            deferred.resolve(doctors);
        }
    });*/
    return deferred.promise;
};
/*
 * getDoctorsList() returns a list of doctors
 * @return <Array> doctors This method returns 10 doctor's records in ascending order
 */
exports.getDoctorsList = function(){
    var deferred = Q.defer();
    Doctor.find({})
        .sort({'_id': -1})
        .limit(10)
        .exec(function(err, doctors) {
            if (err) {
                deferred.reject({"error":"Error while retrieving the doctors list"});
            }else {
                deferred.resolve(doctors);
            }
        });

   /* Doctor.find({},{}, function(err, doctors) {
        if (err) {
            deferred.reject("Error while retrieving the doctors list");
        }else {
            deferred.resolve(doctors);
        }
    });*/
    return deferred.promise;
};
/*
* getDoctorById()
* This method return the doctor details
* @param <String> id
* @return <Object> doctor
 */

exports.getDoctorById = function(id){
// var id = mongoose.Types.ObjectId('4edd40c86762e0fb12000003');
    var deferred = Q.defer();
    // console.log(id);
    // Doctor.findOne({'userId':mongoose.Types.ObjectId(id)}, function(err, user) {
    //     // console.log(user)
    //     if (user) {
    //         deferred.resolve(user);
    //     }else {
    //         deferred.reject("Error while retrieving the doctor");
    //     }
    // }); 
    Doctor.findOne({'userId':id})
    .populate('taxonomy','title level parent')
    .populate('pSubSpeciality','title level parent')
    .populate('languagesSpoken','languageName')
    .populate('insuranceIds','name')
    .populate('orgIds.orgId','pracAddress orgName npi')
    .populate('medicalSchoolName.collegeId','name')
    .populate('medicalSchoolName.taxanomyId','taxonomyName title')
    .exec(function (err, doctor) {
        if (err) {
            deferred.reject(err);
        }else {
            
          deferred.resolve(doctor);
        }
    });
    return deferred.promise;
};

/*
 * getDoctorByNpi()
 * This method return the doctor details
 * @param <String> npi
 * @return <Object> doctor
 */

exports.getDoctorByNpi = function(npi){
    var deferred = Q.defer();
   
    Doctor.findOne({'npi':npi}, function(err, user) {
        if (user) {
            deferred.resolve(user);
        }else {
            if(err){
                deferred.reject("Error while retrieving the doctor");
            }else{
                deferred.resolve(user);  
            }
            
        }
    }); 
    // Doctor.findOne({'npi':npi}).populate('userId orgId taxonomy hospitalAffillation')
    //     .exec(function (err, user) {
    //         if (err) {
    //             deferred.reject({"error":"Error while retrieving the doctor"});
    //         }else {
    //             deferred.resolve(user);
    //         }
    //     });
    return deferred.promise;
};



/*
 * createDoctorMap() returns mapped input data to the doctor schema fields
 * @param <Object> data
 * @return doctor
 */
this.createDoctorMapForUpdate = function(data) {
    'use strict'
    var doctor = {};

    doctor.lName = data.lName;
    doctor.fName = data.fName;
    doctor.mName = data.mName;
    doctor.prefix = data.prefix || "";
    if(!doctor.prefix){
        delete doctor.prefix;
    }

    doctor.suffix = data.suffix;
    doctor.gender = data.gender;
    // doctor.credentialText = data.credentialText;
    if(Array.isArray(data.credentialText)){
        doctor.credentialText = data.credentialText;
    }
    //factual update
    /*
    if(Array.isArray(data.medicalSchoolName)){
        doctor.medicalSchoolName = [];
        for(let obj of data.medicalSchoolName){
            let schoolObj = {};
            schoolObj.collegeName = obj.collegeName;
            schoolObj.courseName = obj.courseName;
            doctor.medicalSchoolName.push(schoolObj);
        }
    }*/
     if(Array.isArray(data.medicalSchoolName)){
        doctor.medicalSchoolName = [];
        for(let obj of data.medicalSchoolName){
            let schoolObj = {};
            schoolObj.collegeId = obj.collegeId ;
            schoolObj.degreeName = obj.degreeName;
            schoolObj.taxanomyId = obj.taxanomyId ;
            doctor.medicalSchoolName.push(schoolObj);
        }
    }
  
    //factual update 
    doctor.website = data.website;

    doctor.graduationYear = data.graduationYear;
    doctor.hospitalAffillation = data.hospitalAffillation;
    // doctor.boardCertificates = data.boardCertificates;
    doctor.educationTraining = data.educationTraining;
    doctor.awardsAndAccolades = data.awardsAndAccolades;
    doctor.experience = data.experience;
    doctor.pSpeciality = data.primSpecialty;
    doctor.taxonomy = data.taxonomy;
    doctor.phoneNo = data.phoneNo;
    doctor.imageId = data.imageId;
    doctor.certificationsLastModified = data.certificationsLastModified;
    

    doctor.likes = data.likes;
    doctor.ProfessionalacceptsMedicareAssignment = data.ProfessionalacceptsMedicareAssignment;
    doctor.isSubscribed = data.isSubscribed;
    if( data.languagesSpoken)
        doctor.languagesSpoken = data.languagesSpoken;
    // else
    //     doctor.languagesSpoken = [37];
    doctor.licenceNumbers = data.licenceNumbers;
    doctor.orgId = data.orgId;
    doctor.insurancePlans = data.insurancePlans;
    doctor.pacId  = data.pacId;
    doctor.pedId   = data.pedId;
    if(data.hasOwnProperty("address")){
        doctor.address   = {};
        doctor.address.Line1StreetAddress = data.address.Line1StreetAddress;
        doctor.address.Line2StreetAddress = data.address.Line2StreetAddress;
        doctor.address.city = data.address.city;
        doctor.address.state = data.address.state;
        doctor.address.country = data.address.country;
        if(data.address.locationCode)
            doctor.address.locationCode = data.address.locationCode
        if(data.address.zipCode)
            doctor.address.zipCode = data.address.zipCode;
        doctor.address.phoneNo = data.address.phoneNo;
        doctor.address.faxNo = data.address.faxNo;
        if(data.address.location){
            doctor.address['geoLocation'] = {};
            doctor.address.geoLocation['location'] = {};
            doctor.address.geoLocation.location['lat'] = data.address.location.lat;
            doctor.address.geoLocation.location['lon'] = data.address.location.lon;

        }
    }

    if(data.hasOwnProperty("orgIds")){
        doctor.orgIds = [];
        for(var item in data.orgIds){
            var pld = {}; // Practice Location address
            pld.orgId = data.orgIds[item].orgId;
            pld.orgType = data.orgIds[item].orgType;
            doctor.orgIds.push(pld);
        }
    }

    // doctor.otherAddress = [];
    var pld = {}; // Practice Location address
    if(data.hasOwnProperty("otherAddress")){
        doctor.otherAddress = [];  
        if(data.otherAddress.length>0){
            for( let item of data.otherAddress){
                pld._id = item._id;
                pld.organizationLegalName = item.organizationLegalName;
                pld.Line1StreetAddress = item.Line1StreetAddress;
                pld.Line2StreetAddress = item.Line2StreetAddress;
               // pld.street = pracAddress.street;
                pld.city = item.city;
                pld.state = item.state;
                pld.country = item.country;
                pld.faxNo = item.faxNo;
                pld.isPrimary = item.isPrimary || false;
                if(item.locationCode)
                    pld.locationCode = item.locationCode
                if(item.zipCode)
                    pld.zipCode = item.zipCode;
                pld.phoneNo = item.phoneNo;
                if(item.geoLocation){
                    pld.geoLocation = {};
                    pld.geoLocation['location'] = {};
                    pld.geoLocation.location['lat'] = item.geoLocation.location.lat;
                    pld.geoLocation.location['lon'] = item.geoLocation.location.lon;
                }
                doctor.otherAddress.push(pld);
                pld = {};
            }
        }
    }
    
    // doctor.doctorType = data.doctorType;
    if(data.hasOwnProperty("insuranceIds")){
        doctor.insuranceIds = [];
        if(Array.isArray(data.insuranceIds)){
            for (var value = 0; value < data.insuranceIds.length; value++) {
                doctor.insuranceIds.push(data.insuranceIds[value]);
            };
        }else{
            doctor.insuranceIds = [];
        }
    }

    doctor.pSubSpeciality = data.pSubSpeciality;
    doctor.imageId = data.imageId;
    doctor.briefIntro = data.briefIntro;
    doctor.reasons = data.reasons;
    doctor.updateDate = parseInt(data.updateDate) || moment()*1;
    if(data.dob){
        doctor.dob =  moment(data.dob)*1;
    }

    // doctor.certifications = data.certifications;
    if(data.hasOwnProperty("certifications")){
        if(data.certifications.length > 0){
            doctor.certifications = [];
            for (var j in data.certifications) {
                var cert = {};


                cert.certficationName = data.certifications[j].certficationName;
                  cert.certficationId = data.certifications[j].certficationId;
                if(!!data.certifications[j].dateInMonths){
                    cert.dateInMonths = data.certifications[j].dateInMonths;  
                }
                if(!!data.certifications[j].level){
                    cert.level=data.certifications[j].level;
                }
                
                cert.specialities = [];
                if(data.certifications[j].specialities.length > 0){
                    for(var i in  data.certifications[j].specialities){
                        var spec = {};
                        spec.taxonomyString = data.certifications[j].specialities[i].taxonomyString;
                        spec.status = data.certifications[j].specialities[i].status;
                        spec.taxonomyCode = data.certifications[j].specialities[i].taxonomyCode || "";
                        cert.specialities.push(spec);
                    }
                }else{
                    cert.specialities.push([]);
                }
                doctor.certifications.push(cert);
            };
        }else{
            doctor.certifications = [];
        }   
    }

    


    // console.log(doctor.certifications);
    for (var i in doctor) {
       if ( doctor[i] === null || doctor[i] == undefined) {
            delete doctor[i];
        }
    }
      var Q = require('q');
      var deferred = Q.defer();
        deferred.resolve(doctor)
      return    deferred.promise;
   //return doctor
  /*
 var Q = require('q');
         var deferred = Q.defer();
         
  mapCertificationLevels(doctor).then(function(result){
    deferred.resolve(result);
   
 })
   
  return deferred.promise;

*/

   function mapCertificationLevels(doctor){
     var data = doctor.certifications;
     var async = require('async');
     var Q = require('q');
      var deferred = Q.defer();
     if(!!data){
           if(Array.isArray(data)){
                    var async = require('async');
                   
                    async.mapSeries(data,  appendLevel , function(err,result){
                        if(!!err){
                          deferred.resolve(err);
                        }
                         else{
                           doctor.certifications= result  
                           deferred.resolve(doctor);
                       }
                     });
                  
                }
                else{
                 deferred.resolve(doctor);
                }


    }
    else{
         deferred.resolve(data);
    }
     return deferred.promise;
 }



  function appendLevel(val,callback){
                         var Client = require('node-rest-client').Client;
                         var client = new Client();
                         var hostPath = "http://localhost:3004/api/taxonomy";
                         var Q = require('q');
                         var deffered = Q.defer();
                         var taxonomyName = val.specialities[0].taxonomyString.toUpperCase();
                             console.log(val.specialities[0]);
                         var taxonomyCode =  val.specialities[0].taxonomyCode.toUpperCase();
                    var args = { "taxonomyName" : val.specialities[0].taxonomyString.toUpperCase()};
                         hostPath = hostPath+"/"+taxonomyCode ; //2084P0804X  taxonomyCode
                     console.log( hostPath);   
                      client.get(hostPath,function(data,res){
                                  if(!!data.level ){
                                    val.level = data.level;

                                 }
                                 else {

                                   console.log(val.specialities[0]);
                                }
                                return callback(null,val);
                           }) ;
                       }
    

};

this.createDoctorMap = function(data) {
    var doctor = {};
    doctor.userId = data.userId;
    doctor.npi   = data.npi;
    doctor.isSubscribed = data.isSubscribed;
    // console.log(doctor.certifications);
    for (var i in doctor) {
       if ( doctor[i] === null || doctor[i] == undefined) {
            delete doctor[i];
        }
    }
    return doctor;
};
this.createDoctorMapforUpload = function(data) {
    'use strict';
    var doctor = {};
    doctor.userId = data.userId;
    doctor.npi   = data.npi;
    doctor.entityTypeCode   = data.entityTypeCode;
    doctor.lName = data.lName;
    doctor.fName = data.fName;
    doctor.mName = data.mName;
    doctor.prefix = data.prefix || "";
    doctor.suffix = data.suffix;
    doctor.gender = data.gender;
    //factual update
    if(Array.isArray(data.credentialText)){
        doctor.credentialText = data.credentialText;
    }else{
        doctor.credentialText = [];
        if(!!data.credentialText){
            doctor.credentialText.push(data.credentialText);
        }
    }
    //factual update
    /*

    if(Array.isArray(data.medicalSchoolName)){
        doctor.medicalSchoolName = [];
        for(let obj of data.medicalSchoolName){
            let schoolObj = {};
            schoolObj.collegeName = obj;
            schoolObj.courseName = "";
            doctor.medicalSchoolName.push(schoolObj);
        }
    }else{
        if(!!data.medicalSchoolName){
             doctor.medicalSchoolName = [];
            doctor.medicalSchoolName = [{}];
            doctor.medicalSchoolName[0].collegeName = data.medicalSchoolName;
            doctor.medicalSchoolName[0].courseName = "";
        }
    }
    */
    //factual update 
    doctor.website = data.website;

   
    doctor.graduationYear = data.graduationYear;
    //doctor.boardCertificates = data.boardCertificates;
    doctor.educationTraining = data.educationTraining;
    doctor.awardsAndAccolades = data.awardsAndAccolades;
    doctor.experience = data.experience;
    doctor.pSpeciality = data.primSpecialty;
    doctor.taxonomy = data.taxonomy;

   
    if(!! data.certifications && Array.isArray(data.certifications)){
        doctor.certifications = [];
        for (var j in data.certifications) {
            var cert = {};
            cert.certficationName = data.certifications[j].certficationName;
            if(!!data.certifications[j].level){
                    cert.level=data.certifications[j].level;
                }
            cert.certficationId = data.certifications[j]._id;
            cert.specialities = [];

            if(data.certifications[j].specialities.length > 0){
                for(var i in  data.certifications[j].specialities){
                    var spec = {};
                    spec.taxonomyString = data.certifications[j].specialities[i].taxonomyString;
                    spec.status = data.certifications[j].specialities[i].status;
                    spec.taxonomyCode = data.certifications[j].specialities[i].taxonomyCode || "";
                    cert.specialities.push(spec);
                }
            }
            doctor.certifications.push(cert);
        };
    }

    doctor.likes = data.likes;
   



    doctor.ProfessionalacceptsMedicareAssignment = data.ProfessionalacceptsMedicareAssignment;
    doctor.isSubscribed = data.isSubscribed;
    if(data.languagesSpoken)
        doctor.languagesSpoken = data.languagesSpoken;
    else
        doctor.languagesSpoken = [37];
    doctor.licenceNumbers = data.licenceNumbers;
    doctor.orgId = data.orgId;
    doctor.insurancePlans = data.insurancePlans;
    doctor.pacId  = data.pacId;
    doctor.pedId   = data.pedId;
    doctor.imageId = data.imageId;
    if(data.hasOwnProperty("address")){
         doctor.address   = {};
        //doctor.address.street = data.address.street;
        doctor.address.Line1StreetAddress = data.address.Line1StreetAddress;
        doctor.address.Line2StreetAddress = data.address.Line2StreetAddress;
        doctor.address.city = data.address.city;
        doctor.address.state = data.address.state;
        doctor.address.country = data.address.country;
        if(data.address.locationCode)
            doctor.address.locationCode = data.address.locationCode;
        if(data.address.zipCode)
            doctor.address.zipCode = data.address.zipCode;
        doctor.address.phoneNo = data.address.phoneNo;
        doctor.address.faxNo = data.address.faxNo;
        // if(!!data.address)
        if(data.address.location){
            doctor.address['geoLocation'] = {};
            //var geoLocation = {};
            doctor.address.geoLocation['location'] = {};
            doctor.address.geoLocation.location['lat'] = data.address.location.lat;
            doctor.address.geoLocation.location['lon'] = data.address.location.lon;

        }
    }

    // for (var i in data.address) {
    //     if (data.address[i] == "" || data.address[i] === null || data.address[i] == undefined) {
    //         delete data.address;
    //     }
    // }

    // doctor.practiceLocationAddress = [];

    // doctor.doctorType = data.doctorType;
    if(data.hasOwnProperty("practiceLocationAddress")){
        doctor.otherAddress = [];
        for( let pracAddress of data.practiceLocationAddress){
            console.log(pracAddress);
            var pld = {}; // Practice Location address
            pld.organizationLegalName = pracAddress.organizationLegalName;
            pld.Line1StreetAddress = pracAddress.Line1StreetAddress;
            pld.Line2StreetAddress = pracAddress.Line2StreetAddress;
           // pld.street = pracAddress.street;
            pld.city = pracAddress.city;
            pld.state = pracAddress.state;
            pld.country = pracAddress.country || 'USA';
            pld.faxNo = pracAddress.faxNo;
            if(pracAddress.locationCode)
                pld.locationCode = pracAddress.locationCode;
            if(pracAddress.zipCode)
                pld.zipCode = pracAddress.zipCode;
            pld.phoneNo = pracAddress.phoneNo;


           if(pracAddress.location){
                pld.geoLocation = {};
                //var geoLocation = {};
                pld.geoLocation['location'] = {};
                pld.geoLocation.location['lat'] = pracAddress.location.lat;
                pld.geoLocation.location['lon'] = pracAddress.location.lon;
                //pld.geoLocation.location = geoLocation;
            }

            else   if(!!pracAddress.lat && pracAddress.lon) {
                   pld.geoLocation = {};
                //var geoLocation = {};
                pld.geoLocation['location'] = {};
                pld.geoLocation.location['lat'] = pracAddress.lat;
                pld.geoLocation.location['lon'] = pracAddress.lon;

               }
            doctor.otherAddress.push(pld);
            pld = {};
        }
    }
    doctor.pSubSpeciality = data.pSubSpeciality;
    doctor.briefIntro = data.briefIntro;

    if(data.hasOwnProperty("insuranceIds")){
        doctor.insuranceIds = [];
        if(Array.isArray(data.insuranceIds)){
            for (var value = 0; value < data.insuranceIds.length; value++) {
                doctor.insuranceIds.push(data.insuranceIds[value]);
            };
        }
    }
    
    doctor.reasons = data.reasons;
    if(data.dob){
        doctor.dob =  moment(data.dob)*1;
    }

    for (var i in doctor) {

        if ( doctor[i] === null || doctor[i] == undefined) {
            delete doctor[i];
        }
    }
      
    var deferred = Q.defer();
    console.log("above hsp map in doc"); 






     HospitalService.getHospitalMapping(data.hospitalAffillation).then(function(hospitalIds){
                 cosole.log(hospitalIds);
                doctor.hospitalAffillation = hospitalIds;
               deferred.resolve(doctor);
     })
           return deferred.promise;
    
};

/*
 * createDoctor()
 * This method creates a new doctor or If already npi is registered it will update the record
 * @param <Object> data
 * @return <Object> doctor
 */


exports.createDoctor = function(data){
    var deferred = Q.defer();
    var doctor = this.createDoctorMap(data);
    Doctor.findOneAndUpdate({npi:data.npi},{$set:doctor},{upsert: true}, function(err, doctor) {
        if (err) {
            deferred.reject({'error':err.message});
        }else {
            deferred.resolve(doctor);
        }
    });
    return deferred.promise;
};
/*
 * uploadDoctor() returns the doctor object
 * This method creates a new doctor or If already npi is registered it will update the record
 * @param <Object> data
 * @return <Object> doctor
 */


function getTaxonomyLevels(doctor){
    'use strict'
    var deferred = Q.defer();
    let taxonomies = doctor.taxonomy;
     console.log(taxonomies);
    if(!!taxonomies){
        if(taxonomies.length > 0){
            var promiseArray = [];
            for (let val of taxonomies) {
                promiseArray.push(TaxonomyService.getAllLevelsById(val));
            };
            Q.all(promiseArray).then(function(succ){
               let result = [];
               for(let list of succ){
                    for(let key in list){
                        if(result.indexOf(list[key]) === -1 && !!list[key] && list[key] !== 'NOTFOUND'){
                            result.push(list[key]);
                        }
                    }
               }
               console.log("result of taxonomy");
               console.log(result)
               doctor.taxonomy = result;
               deferred.resolve(doctor);
            },function(error){
                deferred.reject(error);
            });
        }else{
            deferred.resolve([]);
        }
    }else{
        deferred.resolve([]);
    }
   
    return deferred.promise;
}
exports.uploadDoctor = function(data){
    'use strict'
 // console.log(doctor);
 var noDoctorTaxonomies = ['171100000X','101Y00000X','FADC4URG_GP4','FADC2MED_GP2','FADC1DEN_GP1','FADC3BEH_GP3'];

    var deferred = Q.defer();
   // var doctor = this.createDoctorMapforUpload(data);
    

  this.createDoctorMapforUpload(data).then(function(doctor){
     console.log("inside upload part");
   //  console.log(doctor);
      var taxonomiesLevelMapping = getTaxonomyLevels(doctor);

    taxonomiesLevelMapping
    .then(function(succ){
            console.log("success");
            console.log(succ);
        if(!!doctor.taxonomy){
            console.log(doctor.taxonomy);
            if(doctor.taxonomy.length > 0){
                for(let tax of doctor.taxonomy){
                    if(noDoctorTaxonomies.indexOf(tax) === -1){
                        doctor.prefix = "Dr.";
                        break;
                    }
                }
               // updating into db

                Doctor.findOne({npi:data.npi},function(err, oldDoctorInfo) {
                     if (err) {
                        deferred.reject({'error':err});
                    }else {
          
                        if( !oldDoctorInfo || oldDoctorInfo.doctorType === 'black' ){
                            Doctor.findOneAndUpdate({npi:data.npi},{$set:doctor},{upsert: true,new : true}, function(err, doctor) {
                                 if (err) {
                                    deferred.reject({'error':err});
                                }else {
                                    deferred.resolve({newDoc : doctor,oldDoc : oldDoctorInfo});
                                }
                            });
                        }else{
                             console.log("registered Doctor");
                             deferred.resolve("registeredDoctor");
                        }
                         
                    }
                });
            }else{
                deferred.reject({error : "no taxonomies"});
            }
        }else{
             Doctor.findOne({npi:data.npi},function(err, oldDoctorInfo) {
                 if (err) {
                    deferred.reject({'error':err});
                }else {
                    if(!!oldDoctorInfo){
                        doctor.prefix = oldDoctorInfo.prefix;
                        if( !oldDoctorInfo || oldDoctorInfo.doctorType === 'black' ){
                            Doctor.findOneAndUpdate({npi:data.npi},{$set:doctor},{upsert: true,new : true}, function(err, doctor) {
                                 if (err) {
                                    deferred.reject({'error':err});
                                }else {
                                    deferred.resolve({newDoc : doctor,oldDoc : oldDoctorInfo});
                                }
                            });
                        }else{
                            deferred.resolve("registeredDoctor");
                        }    
                    }else{
                        // pushing the doctor info
                        doctor.prefix = "";
                        Doctor.findOneAndUpdate({npi:data.npi},{$set:doctor},{upsert: true,new : true}, function(err, doctor) {
                             if (err) {
                                deferred.reject({'error':err});
                            }else {
                                deferred.resolve({newDoc : doctor,oldDoc : oldDoctorInfo});
                            }
                        });
                    }
                }
            });
        }
    },function(fail){
        deferred.reject(faile);
    });
        // taxonomiesLevelMapping

   
    


     })
  


    return deferred.promise;
};

/*
 * updateDoctor() returns the doctor object
 * This method updates a doctor by id
 * @param  <String> id
 * @param  <Object> data
 * @return <Object> doctor
 */
exports.updateDoctor = function(id,data){
    var deferred = Q.defer();
    this.createDoctorMapForUpdate(data).then(function(doctor){
   //  console.log(data);
 
    //console.log(" ********************* new data doctor updating *******************");
     console.log( JSON.stringify (doctor));
    
    console.log("id : "+id);
    // to delete the old organzations information
     findDoctoryByUserId(id).then(function(succDoc){
       console.log(succDoc.doctorType);  
       if(succDoc.doctorType == 'yellow'){
            doctor.doctorType='grey';
        }         
       console.log("**************** doctor  set *********");
      //    console.log(doctor);  
        Doctor.findOneAndUpdate({"userId":id},{$set:doctor},{new : true})
        .populate('taxonomy','title level parent')
        .populate('pSubSpeciality','title level parent')
        .populate('languagesSpoken','languageName')
        .populate('insuranceIds','name')
        .populate('orgIds.orgId','pracAddress orgName npi')
        .populate('medicalSchoolName.collegeId','name')
        .populate('medicalSchoolName.taxanomyId','taxonomyName')
        .exec(function(err, doctor) {
            if (err) {
                console.log(err);   
                deferred.reject(err);
            }else {
              
                deferred.resolve({
                    oldData : succDoc,
                    newData : doctor
                });
            }
        });
     },function(err){
        deferred.resolve(err);
     })
   
  });
  return deferred.promise;
} ;

exports.updateEmailMobileAndDoctorTypeOnUserId = function(userId,userObj){
    var deferred = Q.defer();
    var emailMobileDoctoryType = emailMobileDoctoryTypeMap(userObj);
    Doctor.findOneAndUpdate({"userId":userId},{$set : emailMobileDoctoryType},{new : true},function(err, doctor) {
        // console.log(err,doctor);
        if (err) {
            deferred.reject(err);
        }else {
            if(doctor){
                deferred.resolve(doctor);
            }else{
                // no user doctor found // need to write code for this
                deferred.reject(err);
            }
            
        }
    });
    return deferred.promise;
}

function emailMobileDoctoryTypeMap(data){
    var user = {};
    user.email = data.email;
    user.mobile = data.mobile;
    user.doctorType = 'yellow';
    return user;
}

function findDoctoryByUserId(id){
    var deferred = Q.defer();
    var ObjectId = require('mongoose').Types.ObjectId; 
    Doctor.findOne({"userId": new ObjectId(id)},function(err, doctor) {
       
         if (err) {
            deferred.reject(err);
        }else {
            if(doctor){
                doctor = doctor.toObject();
            }
            deferred.resolve(doctor);
        }
    });
    return deferred.promise;
}
