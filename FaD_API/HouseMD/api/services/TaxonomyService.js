/**
 * Created by pradeep on 3/18/16.
 */
var Taxonomy = require('../../db/dbModels/Taxonomy');

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
              console.log(err);
            deferred.reject("Error while retrieving the taxonomy list");
        }else {
              console.log(taxonomy);
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
