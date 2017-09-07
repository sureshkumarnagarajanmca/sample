/**
 * Created by pradeep on 4/27/16.
 */

/**
 * Created by pradeep on 3/18/16.
 */

var appControlListService = require('../services/AppControlListService.js'),
    errors = require('../errors'),
    errorHandler = require('../serviceHandler').errorHandler,
    paramType = require('../validator/paramTypes.js');
var CertificationsServices = require('../services/certificationsServices');
var Q = require('q');



/**
 * This Class Implements REST API for HospitalAPI creation
 */
function LanguageAPI() {
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

    function uploadCertifications(req, res) {
        var data = req.body;
        console.log(data);
        CertificationsServices.uploadCertifications(data).then(function(result){
            res.send(result);
        },function(err){
            res.send(err);
        });
    }

    function getAllCertificationsList(req,res){
        CertificationsServices.getAllCertificationsList().then(function(result){
            res.send(result);
        },function(err){
            res.send(err);
        });
    }

    function searchCertifications(req,res){
    	var data = req.query.searchText;
         CertificationsServices.searchCertifications(data).then(function(result){
            res.send(result);
        },function(err){
            res.send(err);
        });
    }

    // function uploadCertifications(req, res){
    //     LanguageService.getLanguagesList().then(function(result){
    //         res.send(result);
    //     },function(err){
    //         res.send(err);
    //     });
    // }

    this.resourcePath = '/certification';
    this.description = "certification Data";
    this.getMappings = function() {
        return {
            '/certifications': {
            	   get : {
                    callbacks: [getAllCertificationsList],
                    resource: 'Certifications',
                    action: 'getAllCertificationsList',
                    summary: "Get the list of Certifications",
                    notes: "This fetches all Certifications.",
                    responseMessages: [{
                        "code": 400,
                        "message": "Invalid parameters"
                    }]
                },
                '/upload' :{
                    post : {
                        callbacks: [uploadCertifications],
                        resource: 'Certifications',
                        action: 'uploadCertifications',
                        summary: "Add new Certification",
                        notes: "This method helps to upload data uploadCertifications. For batch operations purpose",
                        type: "Certifications",
                        parameters: [
                            paramType.body("body","Provide json object to Create","certification",true)
                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    },
                },
                '/search' :{
	                    get : {
	                    callbacks: [searchCertifications],
	                    resource: 'Certifications',
	                    action: 'searchCertifications',
	                    summary: "Search Certifications",
	                    notes: "Search for Certifications.",
	                    parameters: [
                            paramType.query("searchText","search Text for hospital","string",true)
                        ],
	                    responseMessages: [{
	                        "code": 400,
	                        "message": "Invalid parameters"
	                    }]
	                }
                },
            }
        };
    };
}

module.exports = {
    getInst : function() {
        return new LanguageAPI();
    }
};

