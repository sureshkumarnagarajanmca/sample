/*global AuditEvent*/
var _ = require('lodash');
var auditconfig= require('./auditresolve.json');
var auditEvents={} ;
//var _dbConf = config.shareddb;
//var eventAction={};
var Promise = require('bluebird');

/*
  "eventname":{
    "category":"User Groups",
    "template":"Group created by <%= username %> with <%= timeStamp %>",
    "resolve":[
      {
        "type":"user", //<<required>> if resolve =false>> resolve  as the user/group/team
        "key":"username", // <<required>> Key which is mapped in template
      }
    ]
    
    },*/
/*function prepareContext(){ // need to remove----changed on 27th Dec 2014
    var _connStr, hostEntries, portEntries;
    var context= {
        "clientId": "1",
        "datasource": [
            
        ],
        "userId": "",
        "orgId": "",
    };

    if (_dbConf.replEnabled === 'true' || _dbConf.replEnabled === true) {
        hostEntries = _dbConf.hosts;
        portEntries = _dbConf.ports;

        _connStr = 'mongodb://' + hostEntries[0] + ':' + portEntries[0] + '/' + _dbConf.database + ',mongodb://' + hostEntries[1] + ':' + portEntries[1] + '/' + _dbConf.database + ',mongodb://' + hostEntries[2] + ':' + portEntries[2] + '/' + _dbConf.database;
    } else {
        _connStr = 'mongodb://' + _dbConf.host + ':' + _dbConf.port + '/' + _dbConf.database;
    }
    context.datasource.push(_connStr);
    return context;
}*/

function AuditEvent(category, template, data) {
    //console.log("audit resolve called :: ",category, template,data);
    var self=this;
    this.data=data;
    this.cartegory=category;
      
    this.toResolve = function(){

      return generateData(self.data)
      .then(function(data){
          self.data = _.assign(self.data,data);
          self.data.timestamp = self.data["@timestamp"];
          self.data.description= template(self.data);
          delete self.data.timestamp;
          return Promise.resolve(self.data);
      });
    };

    this.setUserContexts = function(context){
      self.data = _.assign(context,self.data);
      return Promise.resolve(self.data);
    };    
}


function generateData(data){
  var serviceInst,userContext;
  var UserContextModule = require(config.app.root + "/api/services/UserContextService.js");
  var AuditEventResolve = require(config.app.root + '/api/services/AuditResolveServices.js');
  var userContextInst=UserContextModule.getInst();
  var parseField,index=0,eventData={},type,resolveData;

  return new Promise(function(resolve, reject){
    if(data.userId){
      userContextInst.getUserContextMinimalBy({clientId:data.userId},function(error,context){
        userContext = context[0];
        serviceInst = AuditEventResolve.getInst();
        //userContext =prepareContext();
        serviceInst.setUserContext(userContext);
        if (auditconfig[data.event]){
          parseField = auditconfig[data.event]["resolve"];
          if(parseField && parseField.length){
                function resolveObj(){
                    if(index<parseField.length){
                      type = parseField[index].type;
                      resolveData =  data[parseField[index].key];
                      return serviceInst[type](resolveData)
                      .then(function(rec){
                          eventData[parseField[index].key] = rec;
                          index++;
                          return resolveObj();
                      });
                    }else{
                          return resolve(eventData);
                    }
                } // end of the function
              if(index<parseField.length){
                  resolveObj();
              }else
                 return resolve(eventData);
          }
        }
      });
    }
  });
}

function constructevent(event1 , category ,template){
    var compiled = _.template(template);
    return function(data){
        AuditEvent.call(this,category , compiled , data);
    };
}

var events =Object.keys(auditconfig);
events.forEach(function(event){
    var val = auditconfig[event];
    auditEvents[event] = constructevent(event , val.category  , val.template);
});



module.exports = auditEvents;