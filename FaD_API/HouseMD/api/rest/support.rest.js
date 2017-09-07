/**
 * Created by pradeep on 2/26/16.
 */
//var cpService = require('../services/Administration/ConsentPoliciesService'),
var appControlListService = require('../services/AppControlListService.js'),
    errors = require('../errors'),
    errorHandler = require('../serviceHandler').errorHandler,
    paramType = require('../validator/paramTypes.js');
var supportService = require('../services/support.services');

var errorFunctions = require('../errorCodeFunctions');


var Q = require('q');
/**
 * This Class Implements REST API for User creation
 */
function UsersAPI() {
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

    function sendSuppportMail(req,res){
        var name = req.body.name;
        var email = req.body.email;
        var message = req.body.message;
        supportService.sendSupportMail(name,email,message)
        .then(function(succ){
        	res.send({succ : "succ"});
        },function(fail){
            errorFunctions.sendInternalServerError(req,res,fail);
        })
    }
    this.resourcePath = '/support';
    this.description = "support operations";
    this.getMappings = function() {
        return {
            '/support': {
               '/sendMail' : {
                   post : {
                       callbacks: [sendSuppportMail],
                       resource: 'Support',
                       action: 'sendSupportMail',
                       summary: "sends support email",
                       notes: "This method sends email",
                       type: "Object",
                       parameters: [
                           paramType.body("body","Provide json to send support mail","supportObject",true)
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
}

module.exports = {
    getInst : function() {
        return new UsersAPI();
    }
};
