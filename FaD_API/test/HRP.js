var mongoose = require('mongoose');
var dbhost ="10.18.10.166";
var port ="27017";
var dbName ="fadMigration";
/**
 * Created by pradeep on 3/6/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var q = require('q');


var hospitalSchema = new Schema({
    _id : {type : Schema.Types.ObjectId},
    medicareCCN : {type :String}, // Provider ID
    name : {type: String, required: true, index: true},
    address : {
        Line1StreetAddress : String,
        Line2StreetAddress : String,
        city : String,
        state : {type: String},
        countyName : {type: String},
        country : {type: String, default:"US"},
        zipCode : Number,
        phoneNo : String
    },
    rating : {type: String, default:"0"},
    date : {type: Date,  default: Date.now}
});
 

var _connStr = 'mongodb://' + dbhost + ':' + port + '/' + dbName;
var dbConnection= mongoose.createConnection(_connStr, {auto_reconnect: true, socketOptions: {keepAlive: 100}});
var Hospital = mongoose.model('Hospital', hospitalSchema);
var HospitalModel= dbConnection.model('Hospital');
var async = require('async');

var HospitalArr = ["354TH Medical GROUP","673D MEDICAL GROUP","SIT TEST HSP"];
//var HospitalArr = [];




hospitalMap = function(data) {

    var hospital = {};

    // hospital.medicareCCN = data.medicareCCN;
     //hospital._id = MO  //NOTHING CREATED HERE . NEED TO CALRIFY WITH TEAM
      hospital._id  = require('mongoose').Types.ObjectId();
     hospital.name = data.name.toUpperCase().trim();
    hospital.address = {};
    data.address = data.address||{};
    hospital.address.Line1StreetAddress = data.address.Line1StreetAddress|| " ";
    hospital.address.Line2StreetAddress = data.address.Line2StreetAddress || " ";
    hospital.address.state = data.address.state || " ";
    hospital.address.country = data.address.country || " ";
    hospital.address.countyName = data.address.countyName || " ";
    hospital.address.city = data.address.city || " ";
    hospital.address.phoneNo = data.address.phoneNo || " ";
    hospital.address.zipCode = data.address.zipCode || 0;
    // hospital.rating = data.rating;



    console.log(hospital.name)

    for (var i in hospital.address) {

        if (!hospital.address[i]) {
            delete hospital.address[i];
        }
    }
    
    return hospital;
};

  
function getHospitalMapping(HospitalArr){

  function getHospitalIds(name,callback){
    name = name.toUpperCase();
    HospitalModel.findOne({name:name} ,function(err,result){
       if(!err && !!result ){
          console.log(result);
          return callback(null,{"hospitalName" : result.name,"hospitalId" : result._id  });
         }
       else {

          var data = {name:name};
          var hospital = hospitalMap(data);
          HospitalModel.findOneAndUpdate({name:hospital.name},{$set:hospital},{upsert: true, new : true},function(err, result) {
          if (err) {
              return callback(null,null);

        }
        else {
              return callback(null,{"hospitalName" : result.name,"hospitalId" : result._id  });
        }
    });
       }

    });
  
}

var defer = q.defer();
async.mapSeries(HospitalArr,  getHospitalIds , function(err,result){
     if(!err){
         defer.resolve(result);
       }
     else
      defer.resolve(err);
      });
   return defer.promise
}



getHospitalMapping(HospitalArr).then(function(result){
  console.log(result);
})




	






