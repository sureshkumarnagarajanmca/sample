


/**
 * Created by pradeep on 3/7/16.
 */
    var Organization = require('../../db/dbModels/Organizations');

    var Q = require('q');

    /**
     * Created by pradeep on 3/6/16.
     */
    var mongoose = require('mongoose');
    var moment = require('moment');
    var Schema = mongoose.Schema;

    this.organizationMap = function(data) {
        'use strict'
        var organization = {};
        // organization._id = data.providerId;
        organization.orgName = data.orgName;
        organization.description = data.description;
        organization.orgOtherName = data.orgOtherName;
        organization.taxonomy = data.taxonomy;
        if(data.hasOwnProperty("licenceNumbers")){
            organization.licenceNumbers = [];
            for(let value of data.licenceNumbers){
                var org = {};
                org.number = value.number;
                org.state  = value.state;
            }
            organization.licenceNumbers = data.licenceNumbers;
        }
        organization.npi = data.npi;
        organization.medicareCCN = data.medicareCCN;
        if(data.hasOwnProperty("address")){
            organization.address = {};
            organization.address.Line1StreetAddress = data.address.Line1StreetAddress;
            organization.address.Line2StreetAddress = data.address.Line2StreetAddress;
            organization.address.city = data.address.city;
            organization.address.state = data.address.state;
            organization.address.country = data.address.country;
            organization.address.countyName = data.address.countyName;
            organization.address.phoneNo = data.address.phoneNo;
            organization.address.zipCode = data.address.zipCode;
            organization.address.locationCode = data.address.locationCode;
            if(data.address.location){
                organization.address['geoLocation'] = {};
                organization.address.geoLocation['location'] = {};
                organization.address.geoLocation.location['lat'] = data.address.location.lat;
                organization.address.geoLocation.location['lon'] = data.address.location.lon;
            }
        }
        

        if(data.hasOwnProperty("pracAddress")){
            organization.pracAddress = {};
            organization.pracAddress.Line1StreetAddress = data.pracAddress.Line1StreetAddress;
            organization.pracAddress.Line2StreetAddress = data.pracAddress.Line2StreetAddress;
            organization.pracAddress.city = data.pracAddress.city;
            organization.pracAddress.state = data.pracAddress.state;
            organization.pracAddress.country = data.pracAddress.country;
            organization.pracAddress.countyName = data.pracAddress.countyName;
            organization.pracAddress.phoneNo = data.pracAddress.phoneNo;
            organization.pracAddress.zipCode = data.pracAddress.zipCode;
            organization.pracAddress.locationCode = data.pracAddress.locationCode;
            if(data.pracAddress.location){
                organization.pracAddress['geoLocation'] = {};
                organization.pracAddress.geoLocation['location'] = {};
                organization.pracAddress.geoLocation.location['lat'] = data.pracAddress.location.lat;
                organization.pracAddress.geoLocation.location['lon'] = data.pracAddress.location.lon;
            }
        }
        organization.rating = data.rating;
        if(!!data.lastUpdateDate){
            moment(data.lastUpdateDate,'YYYY-MM-DD').toISOString();
        }else{
            moment().toISOString();
        }
        // organization.lastUpdateDate =   ||  moment(data.lastUpdateDate,'YYYY-MM-DD').toISOString();;
        organization.authOffLastName = data.authOffLastName;
        organization.authOffFirstName = data.authOffFirstName;
        organization.authOffMiddleName = data.authOffMiddleName;
        organization.authOffTphoneNum = data.authOffTphoneNum;
        organization.authOffTitleorPosition = data.authOffTitleorPosition;
        organization.isOrgSubpart = data.isOrgSubpart;

        for (var i in organization) {
            if (!organization[i]) {
                delete organization[i];
            }
        }

        return organization;
    };

    exports.upload = function(data){
        var deferred = Q.defer();
        var organization = this.organizationMap(data);
        Organization.create(organization,function(err, result) {
            if (err) {
                deferred.reject({'error':err.message});
            }else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    };

    exports.getStatesList = function(){
          var deferred = Q.defer();
          var query = {};
          var countryData = new RegExp("US", "i");
          query['pracAddress.country'] = "US";
           console.log(query);
          Organization.find(query).distinct('pracAddress.state',function(err, result) {
          if (err) {
            deferred.reject({'error':err.message});
           }else {
            deferred.resolve(result);
         }
    });
    return deferred.promise;


    }

    exports.getCitiesList = function(data){
          var deferred = Q.defer();
          var query = {};
          var countryData = new RegExp("US", "i");
          query['pracAddress.country'] = { $regex: countryData };
           var state = data;

           if(!!state){
            var stateData = new RegExp(state,"i");

            query['pracAddress.state'] = { $regex: stateData };
           }
           
          Organization.find(query).distinct('pracAddress.city',function(err, result) {
          if (err) {
            deferred.reject({'error':err.message});
           }else {
            deferred.resolve(result);
         }
    });
    return deferred.promise;


    } 


    exports.getSearchedList = function(data){
        var deferred = Q.defer();
        var data1 = new RegExp(data, "i");  
        Organization.aggregate({ $match : {'orgName' : { $regex: data1 }}}).limit(20)
        .exec(function(err, organizations) {
            if (organizations) {
                deferred.resolve(organizations);
            }else {
                deferred.reject("Error while retrieving hospitals list");
            }
        });
        return deferred.promise;
    };




    exports.getSearchedListOnNameAndZipCode = function(data,zipcode,stateCode,city){
        var deferred = Q.defer();
        if(/^[!@#$%^&*().,`~+-](.*[!@#$%^&*().,`~+-])?$/.test(data)){
             data =null;

         }
        var data1 = new RegExp(data, "i");  
        var query = [{'orgName' : { $regex: data1 }}];
        if(!!zipcode){
            query.push({"pracAddress.zipCode" : zipcode})
        }
       if(!!stateCode){
            query.push({"pracAddress.state" : stateCode})
       }
       if(city) {
           query.push({"pracAddress.city" : city})
       }
          query.push({"pracAddress.country" : "US"})

        Organization.aggregate([
            { 
                $match : 
                    { "$and" : query}
            }
        ])
        .limit(20)
        .exec(function(err, organizations) {
            if (organizations) {
                deferred.resolve(organizations);
            }else {
                deferred.reject("Error while retrieving hospitals list");
            }
        });
        // Organization.find({
        //     $text : {
        //         $search: data
        //     },
        //         "pracAddress.zipCode" : zipcode
        // },function(err,organizations){
        //     console.log(organizations.length);
        //     // res.send(organizations);
        //      deferred.resolve(organizations);
        // })
        return deferred.promise;
    };

    exports.getOrganizationByQuery = function(query){
        var deferred = Q.defer();

        Organization.find(query, function(error, organizations) {
            if (organizations) {
                deferred.resolve(organizations);
            }else {
                deferred.reject("Error while finding the organization");
            }
        });
        return deferred.promise;
    };

    exports.getOrganizationsList = function(){
        var deferred = Q.defer();

        Organization.find({},{}, function(err, organizations) {
            if (organizations) {
                deferred.resolve(organizations);
            }else {
                deferred.reject("Error while retrieving the organizations list");
            }
        });
        return deferred.promise;
    };

    exports.getOrganizationById = function(id){
        var deferred = Q.defer();
        Organization.findOne({'_id':id}, function(err, organization) {
            if (organization) {
                deferred.resolve(organization);
            }else {
                deferred.reject("Error while retrieving the organization by id");
            }
        });
        return deferred.promise;
    };

    exports.getOrganizationByNpi = function(id){
        var deferred = Q.defer();
        Organization.findOne({'npi':id}, function(err, organization) {
            if (err) {
                deferred.reject({errorMessage : "Bad Request"});
            }else{
                if(organization){
                    deferred.resolve(organization);
                }else{
                    deferred.resolve({errorMessage : "Data Not Found"});
                }
            }
        });
        return deferred.promise;
    }

    this.createOrganizationMap = function(data) {

    /*     var organization = {};
        organization.orgName = data.orgName;
        organization.orgOtherName = data.orgOtherName;
        organization.npi = data.npi;
        organization.taxonomy = data.taxonomy;
        organization.licenceNumbers = data.licenceNumbers;
        organization.description = data.description;
        organization.address   = {};
        organization.address.streetName = data.address.streetName;
        organization.address.cityName = data.address.cityName;
        organization.address.state = data.address.state;
        organization.address.country = data.address.country;
        organization.address.zipCode = data.address.zipCode;
        organization.address.locationCode = data.address.locationCode;
        organization.address.phone = data.address.phone;
   */
        var organization = {};
        organization.orgName = data.orgName;
         organization.npi =data.npi||0000000000;    
        organization.address   = {};
        organization.address.Line1StreetAddress = data.address.Line1StreetAddress;
        organization.address.Line2StreetAddress = data.address.Line2StreetAddress;
        organization.address.cityName = data.address.cityName;
        organization.address.state = data.address.state;
        organization.address.country = data.address.country;
        organization.address.zipCode = data.address.zipCode;
        organization.address.phone = data.address.phone;
         if(data.address.location){
                organization.address['geoLocation'] = {};
                organization.address.geoLocation['location'] = {};
                organization.address.geoLocation.location['lat'] = data.address.location.lat;
                organization.address.geoLocation.location['lon'] = data.address.location.lon;
            }
        for (var i in organization) {
            if(!organization[i]){
                delete organization[i];
            }
        };

        return organization;
    };

    exports.createOrganization = function(data){
        var deferred = Q.defer();

        // var organization = this.createOrganizationMap(data);
        var organization = this.organizationMap(data);
        console.log(organization);
        Organization.findOneAndUpdate({npi : organization.npi},{$set : organization},{upsert : true, new : true}, function(err, result) {
            if (result) {
                deferred.resolve(result);
            }else {
                deferred.reject({'error':err.message});
            }
        });
        return deferred.promise;
    };


    exports.updateOrganization = function(id,data){
        var deferred = Q.defer();
        Organization.findOneAndUpdate({"_id":id},data, function(err, organization) {
            if (organization) {
                deferred.resolve(organization);
            }else {
                deferred.reject("Error while updating the organization");
            }
        });
        return deferred.promise;
    };
