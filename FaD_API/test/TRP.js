"use strict";	
var mongoose = require('mongoose');
var dbhost ="10.0.90.12";
var port ="27017";
var dbName ="fadHSPChange";
/**
 * Created by pradeep on 3/6/16.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _connStr = 'mongodb://' + dbhost + ':' + port + '/' + dbName;
var dbConnection= mongoose.createConnection(_connStr, {auto_reconnect: true, socketOptions: {keepAlive: 100}});

var async = require('async');

var q = require('q');


var taxonomySchema = new Schema({
    _id : {type :String, unique : true, required : true}, // Taxonomy Id
    level : {type: String, required: true},
    /*grouping : { type : String },
    speciality: { type : String },
    subSpeciality : {type : String},*/
    orderNo : {type  : Number },
    title : {type : String},
    parent :{type:String, ref:'Taxonomy'},
    date : {type: Date},
    popularity :{type : Number, default : 0},
    order:{type : Number},
    taxonomyName : {type : String}
});
var TaxonomyModel= mongoose.model('Taxonomy',taxonomySchema);
var Taxonomy= dbConnection.model('Taxonomy');


    var nameToCode = { 
        OPHTHALMOLOGY: '207W00000X',
        'OPHTHALMIC PLASTIC AND RECONSTRUCTIVE SURGERY': '207WX0200X',
        OTOLARYNGOLOGY: '207Y00000X',
        'FACIAL PLASTIC SURGERY': '207YS0123X',
        'PLASTIC SURGERY WITHIN THE HEAD & NECK': '207YX0007X',
        'OTOLOGY & NEUROTOLOGY': '207YX0901X',
        'PEDIATRIC OTOLARYNGOLOGY': '207YP0228X',
        ONCOLOGIST: '163WX0200X',
        'PEDIATRIC ONCOLOGY': '163WP0218X',
        'SURGICAL ONCOLOGY': '2086X0206X',
        'RADIATION ONCOLOGY': '2085R0001X',
        'ALLERGY & IMMUNOLOGY': '207K00000X',
        ALLERGY: '207KA0200X',
        'CLINICAL & LABORATORY IMMUNOLOGY': '207KI0005X',
        PODIATRIST: '213E00000X',
        'PRIMARY PODIATRIC MEDICINE': '213EP1101X',
        'PUBLIC HEALTH': '213EP0504X',
        RADIOLOGY: '208500000X',
        'SURGERY, FOOT': '213ES0131X',
        'SURGERY, FOOT & ANKLE': '213ES0103X',
        GASTROENTEROLOGY: '207RG0100X',
        HEPATOLOGY: '207RI0008X',
        NEUROLOGY: '2084N0400X',
        'BEHAVIORAL NEUROLOGY & NEUROPSYCHIATRY': '2084B0040X',
        'DIAGNOSTIC NEUROIMAGING': '2084D0003X',
        'NEUROMUSCULAR MEDICINE': '2084N0008X',
        'NEUROLOGY WITH SPECIAL QUALIFICATION IN CHILD NEUROLOGY': '2084N0402X',
        'OBESITY MEDICINE': '2083B0002X',
        'CLINICAL NEUROPHYSIOLOGY': '2084N0600X',
        'NEURO DEVELOPMENTAL DISABILITIES': '2084P0015X',
        'BRAIN INJURY MEDICINE': '2081P0301X',
        'VASCULAR NEUROLOGY': '2084V0102X',
        UROLOGY: '208800000X',
        'FEMALE PELVIC MEDICINE AND RECONSTRUCTIVE SURGERY': '2088F0040X',
        'PEDIATRIC UROLOGY': '2088P0231X',
        'PRIMARY CARE DOCTOR': '207R00000X',
        'FAMILY MEDICINE': '207Q00000X',
        'GENERAL PRACTICE': '1223G0001X',
        'GERIATRIC MEDICINE': '207RG0300X',
        'COLON & RECTAL SURGERY': '208C00000X',
        ENDOCRIONOLOGIST: '207RE0101X',
        SURGERY: '208600000X',
        'SURGICAL CRITICAL CARE': '2086S0102X',
        'PEDIATRIC SURGERY': '2086S0120X',
        'PLASTIC AND RECONSTRUCTIVE SURGERY': '2086S0122X',
        'TRAUMA SURGERY': '2086S0127X',
        'VASCULAR SURGERY': '2086S0129X',
        RHEUMATOLOGY: '207RR0500X',
        COUNSELOR: '101Y00000X',
        ADDICTION: '103TA0400X',
        'MENTAL HEALTH': '101YM0800X',
        PROFESSIONAL: '101YP2500X',
        PASTORAL: '101YP1600X',
        'BODY IMAGING': '2085B0100X',
        NEURORADIOLOGY: '2085N0700X',
        'NUCLEAR RADIOLOGY': '2085N0904X',
        'PEDIATRIC RADIOLOGY': '2085P0229X',
        'DIAGNOSTIC RADIOLOGY': '2085R0202X',
        'THERAPEUTIC RADIOLOGY': '2085R0203X',
        'VASCULAR & INTERVENTIONAL RADIOLOGY': '2085R0204X',
        'RADIOLOGICAL PHYSICS': '2085R0205X',
        'DIAGNOSTIC ULTRASOUND': '2085U0001X',
        PEDIATRICS: '208000000X',
        'ADOLESCENT MEDICINE': '2080A0000X',
        'CHILD ABUSE PEDIATRICS': '2080C0008X',
        'NEONATAL-PERINATAL MEDICINE': '2080N0001X',
        'PEDIATRIC CARDIOLOGY': '2080P0202X',
        'DEVELOPMENTAL BEHAVIORAL PEDIATRICS': '2080P0006X',
        'NEURODEVELOPMENTAL DISABILITIES': '2080P0008X',
        'PEDIATRIC ALLERGY/IMMUNOLOGY': '2080P0201X',
        'PEDIATRIC CRITICAL CARE MEDICINE': '2080P0203X',
        'PEDIATRIC GASTROENTEROLOGY': '2080P0206X',
        'PEDIATRIC HEMATOLOGY-ONCOLOGY': '2080P0207X',
        'PEDIATRIC ENDOCRINOLOGY': '2080P0205X',
        'PEDIATRIC NEPHROLOGY': '2080P0210X',
        'PEDIATRIC INFECTIOUS DISEASES': '2080P0208X',
        'PEDIATRIC PULMONOLOGY': '2080P0214X',
        'PEDIATRIC RHEUMATOLOGY': '2080P0216X',
        'MEDICAL TOXICOLOGY': '207PT0002X',
        'PEDIATRIC TRANSPLANT HEPATOLOGY': '2080T0004X',
        'DIETITIAN/NEUTRITIONIST': '133N00000X',
        'NUTRITION, RENAL': '133VN1005X',
        'NUTRITION, PEDIATRIC': '133VN1004X',
        'NUTRITION, METABOLIC': '133VN1006X',
        'NUTRITION, EDUCATION': '133NN1002X',
        PSYCHOLOGIST: '103T00000X',
        'ADULT DEVELOPMENT & AGING': '103TA0700X',
        'COGNITIVE & BEHAVIORAL': '103TB0200X',
        CLINICAL: '103TC0700X',
        COUNSELING: '103TC1900X',
        FAMILY: '103TF0000X',
        FORENSIC: '103TF0200X',
        'MENTAL RETARDATION & DEVELOPMENTAL DISABILITIES': '103TM1800X',
        PSYCHOANALYSIS: '103TP0814X',
        'GROUP PSYCHOTHERAPY': '103TP2701X',
        REHABILITATION: '111NR0400X',
        AUDIOLOGIST: '231H00000X',
        'ASSISTIVE TECHNOLOGY PRACTITIONER': '231HA2400X',
        'ASSISTIVE TECHNOLOGY SUPPLIER': '231HA2500X',
        NEPHROLOGY: '207RN0300X',
        'INFECTIOUS DISEASE': '207RI0200X',
        ANESTHESIOLOGY: '207L00000X',
        'ADDICTION MEDICINE': '207LA0401X',
        'PAIN MEDICINE': '207LP2900X',
        'PEDIATRIC  ANESTHESIOLOGY': '207LP3000X',
        CHIROPRACTOR: '111N00000X',
        'INDEPENDENT MEDICAL EXAMINER': '111NI0013X',
        INTERNIST: '111NI0900X',
        'PEDIATRIC CHIROPRACTOR': '111NP0017X',
        'SPORTS PHYSICIAN': '111NS0005X',
        'OCCUPATIONAL HEALTH': '111NX0100X',
        OPTOMETRIST: '152W00000X',
        'CORNEAL AND CONTACT MANAGEMENT': '152WC0802X',
        'LOW VISION REHABILITATION': '152WL0500X',
        'PEDIATRIC  OPTOMETRIST': '152WP0200X',
        'SPORTS VISION': '152WS0006X',
        'VISION THERAPY': '152WV0400X',
        'OCCUPATIONAL VISION': '152WX0102X',
        ACUPUNCTURIST: '171100000X',
        'URGENT CARE DOCTOR': '261QU0200X',
        'EMERGENCY MEDICAL SERVICES': '207PE0004X',
        'PEDIATRIC EMERGENCY MEDICINE': '207PP0204X',
        CARDIOLOGIST: '207RC0000X',
        'INTERVENTIONAL CARDIOLOGY': '207RI0011X',
        DERMATOLOGY: '207N00000X',
        'MOHS-MICROGRAPHIC SURGERY': '207ND0101X',
        'PEDIATRIC DERMATOLOGY': '207NP0225X',
        'PROCEDURAL DERMATOLOGY': '207NS0135X',
        DERMATOPATHOLOGY: '207ND0900X',
        'CLINICAL & LABORATORY DERMATOLOGICAL IMMUNOLOGY': '207NI0002X',
        PSYCHIATRY: '2084P0800X',
        'CHILD & ADOLESCENT PSYCHIATRY': '2084P0804X',
        'GERIATRIC PSYCHIATRY': '2084P0805X',
        'FORENSIC PSYCHIATRY': '2084F0202X',
        'ADDICTION PSYCHIATRY': '2084P0802X',
        'HOSPICE AND PALLIATIVE MEDICINE': '2084H0002X',
        'PSYCHOSOMATIC MEDICINE': '2084P0015X',
        'SLEEP MEDICINE': '2084S0012X',
        'ORTHOPAEDIC SURGERY': '207X00000X',
        'ADULT RECONSTRUCTIVE ORTHOPAEDIC SURGERY': '207XS0114X',
        'FOOT AND ANKLE SURGERY': '207XX0004X',
        'ORTHOPAEDIC SURGERY OF THE SPINE': '207XS0117X',
        'ORTHOPAEDIC TRAUMA': '207XX0801X',
        'HAND SURGERY': '207XS0106X',
        'PEDIATRIC ORTHOPAEDIC SURGERY': '207XP3100X',
        'SPORTS MEDICINE': '207XX0005X',
        'OBSTETRICS & GYNECOLOGY': '363LX0001X',
        'BERIATRIC  MEDICINE': '207VB0002X',
        'CRITICAL CARE MEDICINE': '207VC0200X',
        'GYNECOLOGIC ONCOLOGY': '207VX0201X',
        'MATERNAL & FETAL MEDICINE': '207VM0101X',
        OBSTETRICS: '207VX0000X',
        'REPRODUCTIVE ENDOCRINOLOGY': '207VE0102X',
        DENTIST: '122300000X',
        'ORAL AND MAXILLOFACIAL PATHOLOGY': '1223P0106X',
        'PEDIATRIC DENTISTRY': '1223P0221X',
        PERIODONTICS: '1223P0300X',
        PROSTHODONTIST: '1223P0700X',
        'ORAL AND MAXILLOFACIAL SURGERY': '1223S0112X',
        'ORTHODONTICS AND DENTOFACIAL ORTHOPEDICS': '1223X0400X',
        DENTURIST: '122400000X',
        'PLASTIC SURGERY': '208200000X',
        'PLASTIC SURGERY WITHIN THE HEAD AND NECK': '2082S0099X',
        'SURGERY OF THE HAND': '2082S0105X',
        'THORACIC AND CARDIAC SURGERY': '208G00000X',
        'PULMONARY DISEASE': '207RP1001X',
        'PAIN MANAGEMENT': '163WP0000X',
        HEMATOLOGY: '246QH0000X',
        NEUROSURGEON: '207T00000X' 
    };








var data = {};



var Q = require('q');



exports.getList = function(id){
    var deferred = Q.defer();

    Taxonomy.find({'_id':id},{}, function(err, taxonomy) {
        if (taxonomy) {
            deferred.resolve(taxonomy);
        }else {
            deferred.reject("Error while retrieving the speciality list");
        }
    });
    return deferred.promise;
};

exports.getById = function(id){
    var deferred = Q.defer();


    Taxonomy.findOne({'_id':id}, function(err, taxonomy) {
        if(err) {
            deferred.reject("Error while retrieving the speciality");
        }else {
            if (taxonomy){
                deferred.resolve(taxonomy);
            }else{
                deferred.resolve(null);
            }
        }
    });
    return deferred.promise;
};

exports.getByLevel = function(level){
    var deferred = Q.defer();


    Taxonomy.find({'level':level}).sort({popularity : -1, title : 1}).exec(function(err, taxonomy) {
        if(err) {
            deferred.reject("Error while retrieving the taxonomy list");
        }else {
            if (taxonomy){
                deferred.resolve(taxonomy);
            }else{
                deferred.resolve(null);
            }
        }
        /*if (taxonomy) {
         /* Taxonomy.find({'parentCode':id},function(err, results){

         });*/
        /*  deferred.resolve(taxonomy);
         }else {
         deferred.reject("Error while retrieving the speciality");
         }*/
    });
    return deferred.promise;
};

exports.getByName = function(name){
    var deferred = Q.defer();

    // Taxonomy.aggregate({ $match : {'taxonomyName' : { $regex: name }}}).limit(1)
    // .exec(function(err, taxonomy) {
    //     if (taxonomy) {
    //         deferred.resolve(taxonomy[0]);
    //     }else {
    //         // if(err){
    //             deferred.reject({});
    //         // }else{
    //         //      deferred.resolve({}); 
    //         // }
            
    //     }
    // })
    Taxonomy.findOne({'taxonomyName' : name}, function(err, taxonomy) {
        if (err) {
            console.log(err);
            deferred.reject(err);
        }else {
            if(taxonomy){
                deferred.resolve(taxonomy);
            }else{
                deferred.resolve(null);
            }
        }
    });
    return deferred.promise;
};

exports.getByParentId = function(parentCode){
    var deferred = Q.defer();
    if(parentCode){
        Taxonomy.find({'parent':parentCode}, function(err, subSpecialities) {
            if(err) {
                deferred.reject("Error while retrieving the sub speciality");
            }else {
                if (subSpecialities){
                    deferred.resolve(subSpecialities);
                }else{
                    deferred.resolve(null);
                }
            }
        });
    }else{
        deferred.resolve(null);
    }
    return deferred.promise;
};

exports.getSpecilitiesgetByParentId = function(parentCode){
    var deferred = Q.defer();
    if(parentCode){

        Taxonomy.find({parent :  parentCode}).sort({popularity : -1,title : 1}).exec(function(err,subSpecialities){
            if(err) {
                deferred.reject("Error while retrieving the sub speciality");
            }else {
                if (subSpecialities){
                    deferred.resolve(subSpecialities);
                }else{
                    deferred.resolve([]);
                }
            }
        });
    }else{
        deferred.resolve(null);
    }
    return deferred.promise;
};
// popular specilities
exports.getPopularSpecilitiesgetByParentId = function(parentCode,level){
    var deferred = Q.defer();
    // if(parentCode){
        var query = {};
        if(parentCode){
            query.parent = parentCode
        }
        if(!!level){
            query.level = level.toString();
        }
        query.popularity = { $gt: 0 };

        Taxonomy.find(query).sort({popularity : -1,title : 1}).exec(function(err,subSpecialities){
            if(err) {
                deferred.reject("Error while retrieving the sub speciality");
            }else {
                if (subSpecialities){
                    deferred.resolve(subSpecialities);
                }else{
                    deferred.resolve([]);
                }
            }
        });
    // }else{
    //     deferred.resolve(null);
    // }
    return deferred.promise;
};
// general specilities
exports.getGeneralSpecilitiesgetByParentId = function(parentCode,level){
    var deferred = Q.defer();
    var query = {};
    if(!!parentCode){
        query.parent = parentCode;
    }
    if(!!level){
        query.level = level.toString();
    }

    query.popularity = { $lt: 1 };
    Taxonomy.find(query).sort({popularity : -1,title : 1}).exec(function(err,subSpecialities){
        if(err) {
            deferred.reject("Error while retrieving the sub speciality");
        }else {
            if (subSpecialities){
                deferred.resolve(subSpecialities);
            }else{
                deferred.resolve([]);
            }
        }
    });
    // }else{
    //     deferred.resolve(null);
    // }
    return deferred.promise;
};

exports.getSubSpecilitiesByParentId = function(parentCode){
    var deferred = Q.defer();
    var query = {};

    if(parentCode){
        query.parent = parentCode;
    }

    query.level = '3';
    Taxonomy.find(query, function(err, SubSpecilaitiesForSpeciality) {
        if(err) {
            deferred.reject("Error while retrieving the sub speciality");
        }else {
            if (SubSpecilaitiesForSpeciality){
                deferred.resolve(SubSpecilaitiesForSpeciality);
            }else{
                deferred.resolve([]);
            }
        }

    });
    return deferred.promise;
}

exports.getReasonBasedOnParentId = function(parentCode){
    var deferred = Q.defer();
    if(parentCode){
        Taxonomy.find({'parent':parentCode,'level'  :'4'}, function(err, reasonForSpeciality) {
            if(err) {
                deferred.reject("Error while retrieving the sub speciality");
            }else {
                if (reasonForSpeciality){
                    deferred.resolve(reasonForSpeciality);
                }else{
                    deferred.resolve([]);
                }
            }

        });

    }else{
        deferred.resolve(null);
    }
    return deferred.promise;
}

// exports.getReasonBasedOnParentArray = function(parentCode){
//     var deferred = Q.defer();
//     if(parentCode){

//         Taxonomy.find({parent : {$in : parentCode},'level'  :'4'}).sort({popularity : -1,title : 1}).exec(function(err,reasonForSpeciality){
//             if(err) {
//                 deferred.reject("Error while retrieving the sub speciality");
//             }else {
//                 if (reasonForSpeciality){
//                     deferred.resolve(reasonForSpeciality);
//                 }else{
//                     deferred.resolve([]);
//                 }
//             }
//         });

//     }else{
//         deferred.resolve(null);
//     }
//     return deferred.promise;
// }

exports.getPopularReasonBasedOnParentArray = function(parentCode){
    var deferred = Q.defer();
    var query = {};
    query.level = '4';
    if(query){
        query.parent = {$in : parentCode}
    }
    query.popularity = { $gt: 0 };
    Taxonomy.find(query).sort({title : 1}).exec(function(err,reasonForSpeciality){
        if(err) {
            deferred.reject("Error while retrieving the sub speciality");
        }else {
            if (reasonForSpeciality){
                deferred.resolve(reasonForSpeciality);
            }else{
                deferred.resolve([]);
            }
        }
    });
    return deferred.promise;
}

exports.getRegularReasonBasedOnParentArray = function(parentCode){
    var deferred = Q.defer();
    var query = {};
    query.level = '4';
    if(query){
        query.parent = {$in : parentCode}
    }
    query.popularity = { $lt: 1 };
    Taxonomy.find(query).sort({title : 1}).exec(function(err,reasonForSpeciality){
        if(err) {
            deferred.reject("Error while retrieving the sub speciality");
        }else {
            if (reasonForSpeciality){
                deferred.resolve(reasonForSpeciality);
            }else{
                deferred.resolve([]);
            }
        }
    });
    return deferred.promise;
}


this.taxonomyMap = function(data) {
    /* _id : {type :String, unique : true, required : true}, // Taxonomy Id
     level : {tyep: Number, required: true},
     grouping : { type : String , required : true},
     speciality: { type : String , required : true},
     subSpeciality : {type : String},
     score :{type: Number},
     parentCode*/

    var taxonomy = {};
    /*taxonomy.metadata = {};
    if(data.metadata){
        taxonomy.metadata = data.metadata;
    }
    taxonomy.code = data.code;
    if(!data.parentCode){
        taxonomy.metadata.isParent = true;
    }else{
        taxonomy.parentCode = data.parentCode;
    }
    taxonomy.grouping = data.grouping;
    taxonomy.classification = data.classification;
    taxonomy.specialization = data.specialization;
    taxonomy.definition = data.definition;
    taxonomy.effectiveDate = data.effectiveDate;
    taxonomy.deactivationDate = data.deactivationDate;
    taxonomy.lastmodifiedDate = data.lastmodifiedDate;
    taxonomy.notes = data.notes;*/
    taxonomy._id = data.code;
    taxonomy.level = parseInt(data.level, 10);
    taxonomy.title = data.title;
    taxonomy.definition = data.definition;
    taxonomy.description = data.description;
    taxonomy.taxonomyName = data.taxonomyName;
    taxonomy.popularity = data.popularity || 0;
    if(data.order){
        taxonomy.order = data.order;  
    }
    taxonomy.parent = data.parent;
    taxonomy.date = new Date();

    for (var i in taxonomy) {

        if (taxonomy[i] === "" || taxonomy[i] === null ) {
            delete taxonomy[i];
        }
    }

    // console.log(taxonomy)
    return taxonomy;
};

exports.create = function(data){
    var deferred = Q.defer();

    var taxonomy = this.taxonomyMap(data);
 
    //Model.update({_id: id}, obj, {upsert: true}, function (err) {…});

    /*Taxonomy.update({code: taxonomy.code},taxonomy,{upsert: true}, function(err, result) {
        if (result) {
            deferred.resolve(result);
        }else {
            deferred.reject({'error':err.message});
        }
    });
    return deferred.promise;*/
console.log(taxonomy);


    Taxonomy.create(taxonomy, function(err, result) {
        if (result) {
            deferred.resolve(result);
        }else {
            deferred.reject({'error':err.message});
        }
    });
    return deferred.promise;
};

exports.upload = function(data){
    var deferred = Q.defer();

    var taxonomy = this.taxonomyMap(data);
  console.log(taxonomy)

    Taxonomy.findOneAndUpdate({"_id":taxonomy._id},{$set:taxonomy},{upsert: true}, function(err, result) {
        if (result) {
            deferred.resolve(result);
        }else {
            deferred.reject({'error':err});
        }
    });
    return deferred.promise;
};


exports.update = function(id,data){
    var deferred = Q.defer();
    Taxonomy.findOneAndUpdate({"_id":id},data, function(err, taxonomy) {
        if (taxonomy) {
            deferred.resolve(taxonomy);
        }else {
            console.log(err);
            deferred.reject("Error while updating the speciality");
        }
    });
    return deferred.promise;
};

exports.deleteAll = function(){
    var deferred = Q.defer();
    Taxonomy.remove({}, function(err, taxonomy) {
        if (err) {
            deferred.reject(taxonomy);
        }else {
            deferred.resolve("Deleted Successfully");
        }
    });
    return deferred.promise;
};


exports.getAllLevelsById = function(id){
    'use strict'
    var deferred = Q.defer();
    var result = {};
    findOneForTaxonomy(id).then(function(taxonomy){
        if(taxonomy){
            result["L"+taxonomy['level']] = taxonomy["_id"];
            if(taxonomy.level == 3){
                findOneForTaxonomy(taxonomy.parent).then(function(taxonomyParent){
                    if(taxonomyParent){
                        result["L"+taxonomyParent.level] = taxonomyParent["_id"];
                        result["L1"] = taxonomyParent.parent;
                    }
                    deferred.resolve(result);
                },function(err){
                    deferred.reject(err);
                })
            }else{
                result["L1"] = taxonomy.parent;
                deferred.resolve(result);
            }
        }else{
            deferred.resolve({data :"NOTFOUND"})
        }
    },function(err){
        
        deferred.reject(err);
    })
    return deferred.promise;
};

// exports.getAllLevelsById = function(id){
//     'use strict'
//     var deferred = Q.defer();
//     findOneForTaxonomy(id).then(function(taxonomy){
//         // let result = [];
//         console.log(level);
//         let result = {};
//         result.push(id);
//         if(result.indexOf(taxonomy.parent)=== -1){
//             result.push(taxonomy.parent);
//         }
//         if(taxonomy.level == 3){
//             // result['L3'] = [];
//             findOneForTaxonomy(taxonomy.parent).then(function(taxonomyParent){
//                 if(result.indexOf(taxonomyParent.parent)=== -1){
//                     result.push(taxonomyParent.parent);
//                 }
//                 deferred.resolve(result);
//             },function(err){
//                 deferred.reject(err);
//             })
//         }else{
//             deferred.resolve(result);
//         }
//     },function(err){
//         deferred.reject(err);
//     })
//     return deferred.promise;
// };

function findOneForTaxonomy(id){
    var deferred = Q.defer();

    Taxonomy.findOne({"_id":id}, function(err, taxonomy) {
        if(taxonomy) {
            deferred.resolve(taxonomy);                
        }else {
            if(err){
                deferred.reject(err);
            }else{
                deferred.resolve(null);
            }
        }
    });
    return deferred.promise;
}

var Client = require('node-rest-client').Client;
var client = new Client();
 var hostPath = "http://10.0.90.13:3004/api/taxonomy";
 var deferred = Q.defer();
 var provider ={};
 var async = require('async');
 var notFoundTaxonomyNames = [];
 provider.taxonomy = ["207L00000X","208VP0014X","208VP0000X"];

data.certifications =  [{"certficationName":"American Board of Anesthesiology","taxonomyString":"Anesthesiology","status":"Certified","education":{"educationYear":"2004","educationShortName":"MD","educationLongName":"Doctor of Medicine"},"taxonomyCode":""},{"certficationName":"American Board of Anesthesiology","taxonomyString":"Pain Medicine","status":"Certified","education":{"educationYear":"2004","educationShortName":"MD","educationLongName":"Doctor of Medicine"},"taxonomyCode":""}];
mapCertificationLevels(data);
var  Q = require("q");
function mapCertificationLevels(data){
	if(!!data.certifications){
                if(Array.isArray(data.certifications)){
                     var async = require('async');
                      var deferred = Q.defer();
                      async.mapSeries(data.certifications,  appendLevel , function(err,result){
                        deferred.resolve(result);
                     });   
                    return deferred.promise; 
                }

               
  }
}



                    function appendLevel(val,callback){
                    	/*
  	                    var obj = {};
                        obj.certficationName = val.certficationName;
                        obj.specialities = [];
                        var specalityObj = {};
                        specalityObj.taxonomyString = val.taxonomyString;
                        specalityObj.status = val.status;
                        specalityObj.taxonomyCode = nameToCode[specalityObj.taxonomyString.toUpperCase()] || "";
                        if(!!specalityObj.taxonomyCode){
    	                            if(provider.taxonomy.indexOf(specalityObj.taxonomyCode) === -1){
                                     provider.taxonomy.push(specalityObj.taxonomyCode);
                                }
                          }
                          else{
                            
                            if(notFoundTaxonomyNames.indexOf(specalityObj.taxonomyString.toUpperCase())==-1){
                                
                                notFoundTaxonomyNames.push(specalityObj.taxonomyString.toUpperCase())                    
                            }
                        }
                        var Q = require('q');
                         var deffered = Q.defer();

                        var args = { "taxonomyName" : specalityObj.taxonomyString.toUpperCase()};
                        hostPath = hostPath+"?"+"taxonomyName="+specalityObj.taxonomyString.toUpperCase();
                        client.get(hostPath,function(data,res){
                        	   if(!!data.level ){
                                    specalityObj.level = data.level;

                                     
                             	   }
                             	    obj.specialities.push(specalityObj);
                             	   return callback(null,obj);
                                
                      }) ;*/

                     var specalityObj = {};
                     specalityObj.taxonomyString = val.taxonomyString;
                      if(!!specalityObj.taxonomyCode){
    	                            if(provider.taxonomy.indexOf(specalityObj.taxonomyCode) === -1){
                                     provider.taxonomy.push(specalityObj.taxonomyCode);
                                }
                          }
                          else{
                            
                            if(notFoundTaxonomyNames.indexOf(specalityObj.taxonomyString.toUpperCase())==-1){
                                
                                notFoundTaxonomyNames.push(specalityObj.taxonomyString.toUpperCase())                    
                            }
                        }


                    

  }


