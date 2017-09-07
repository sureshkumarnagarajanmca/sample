
var request = require('request');
var Promise = require('bluebird');
/**
 * this function need to be removed once oAuth is implemented
 */
function SFDCoAuth(){
    var credentials = {
        username : config.sfdc.credentials.username,
        password : config.sfdc.credentials.password,
        client_id : config.sfdc.credentials.client_id,
        grant_type : config.sfdc.credentials.grant_type,
        client_secret :config.sfdc.credentials.client_secret
    };
    return new Promise(function(resolve,reject){
        request({
            uri : config.sfdc.sfdcauth.uri,
            method : 'POST',
            form : credentials,
        },
            function(error,res){
                if(res &&res.statusCode === 200){
                    AppLogger.info('info',res.body);
                    return resolve(res.body);
                }
                AppLogger.error('error',error);
                return reject(error);
        });
    });
}

function NotifySFDC(userObj,event){
    SFDCoAuth()
    .then(JSON.parse)
    .then(function(oAuthDetails){
        if(event==='SIGNUP' || event === 'ADMININVITE'){
            userObj.reqtype = 'c';
        }else{
            delete(userObj.ku.companyname);
            delete(userObj.ku.title)
            if(!userObj.plan_no){
                delete(userObj.plan_no);
            }
            userObj.reqtype = 'u';
            userObj.ku.activated = "True";
        }
        AppLogger.debug ("SFDC request body : ", userObj);
        request({   
                    uri:config.sfdc.sfdcRequest.uri,
                    method:"POST",
                    json:userObj,
                    headers:{
                        authorization : oAuthDetails.token_type+" "+oAuthDetails.access_token,
                    }
                },
                    function(error,response){
                        if(response && response.statusCode ===200){
                            AppLogger.info("info: ", response.body);
                            return;
                        }
                        AppLogger.error(response.body);
                });
    });
}

exports.NotifySFDC = NotifySFDC;

function NotifySFDCTeam(userObj,event,callback){
    SFDCoAuth()
    .then(JSON.parse)
    .then(function(oAuthDetails){
        AppLogger.debug ("SFDC request body : ", userObj);
        request({   
                    uri:config.sfdc.sfdcRequest.uri,
                    method:"POST",
                    json:userObj,
                    headers:{
                        authorization : oAuthDetails.token_type+" "+oAuthDetails.access_token,
                    }
                },
                    function(error,response){
                        console.log(error);
                        if(response && response.statusCode ===200){
                            AppLogger.info("info: ", response.body);
                            return;
                        }
                        AppLogger.error(response.body);
                });
        callback();
    });
}

exports.NotifySFDCTeam = NotifySFDCTeam;