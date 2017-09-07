var TaxonomyService = require('../api/services/TaxonomyService');
var Q = require('q');

var p =0;
exports.getParentsForTaxonomies = function(taxonomies){
	'use strict'
	var result = [];
	var resultLevels = {}
	var deferred = Q.defer();
	if(taxonomies.length > 0){
	    var promiseArray = [];
		for (let val of taxonomies) {
			promiseArray.push(TaxonomyService.getAllLevelsById(val));
		};
	    Q.all(promiseArray).then(function(succ){
	       for(let list of succ){
	       		for(let key in list){
	       			if(resultLevels.hasOwnProperty(key)){
	       				if(resultLevels[key].indexOf(list[key]) === -1){
	       					resultLevels[key].push(list[key]);
	       				}
	       			}else{
	       				resultLevels[key] = [];
	       				resultLevels[key].push(list[key]);
	       			}
	       			if(result.indexOf(list[key]) === -1){

	       				result.push(list[key]);
	       			}
	       		}
	       }
               result = result.filter(Boolean);
                  if (!!resultLevels ){
                    if(!!resultLevels.L1){
                      resultLevels.L1 =  resultLevels.L1.filter(Boolean);
                    }
                   if(!!resultLevels.L2){
                        resultLevels.L2 =  resultLevels.L2.filter(Boolean);
                    }
                  if(!!resultLevels.L3){
                        resultLevels.L3 =  resultLevels.L3.filter(Boolean);
                    }


                 } 
            
	       var solution = {
	       		taxonomyArray : result,
	       		taxonomyByLevel : resultLevels
	       }
	       deferred.resolve(solution);
	    },function(error){
	        deferred.reject(error);
	    });
	}else{
		deferred.resolve([]);
	}
	return deferred.promise;
}

exports.getParentsForBoardCertifications = function(certifications,cb){
	'use strict'
	var deferred = Q.defer();
	var boardcertificationTaxonomies = [];
	var result = [];
	certifications = certifications || [];
	if(certifications.length>0){
		for(let certification of certifications){
			for(let speciality of certification.specialities){
				if(!!speciality.taxonomyCode){
					if(boardcertificationTaxonomies.indexOf(speciality.taxonomyCode)){
						boardcertificationTaxonomies.push(speciality.taxonomyCode);
					}
				}
			}
		}
	
		var taxonomies = boardcertificationTaxonomies;
		if(taxonomies.length > 0){
		    var promiseArray = [];
			for (let val of taxonomies) {
				promiseArray.push(TaxonomyService.getAllLevelsById(val));
			};
		    // Q.all(promiseArray).then(function(succ){
		    //    for(let list of succ){
		    //    		for(let taxonomyCode of list){
		    //    			if(result.indexOf(taxonomyCode) === -1){
		    //    				result.push(taxonomyCode);
		    //    			}
		    //    		}
		    //    }
		    //     console.log(result);
		    //    deferred.resolve(result);
		    // },function(error){
		    //     deferred.reject(error);
		    // });

		    Q.all(promiseArray).then(function(succ){

			       for(let list of succ){
			       		for(let key in list){
			       			// console.log(list)
			       			if(result.indexOf(list[key]) === -1){
			       				result.push(list[key]);
			       			}
			       			
			       		}
			       }
			       deferred.resolve(result);
			    },function(error){
			        deferred.reject(error);
			    });
			
			return deferred.promise;
		}else{
			deferred.resolve([]);
		}
	}else{
		deferred.resolve([]);
	}
	return deferred.promise;
}
