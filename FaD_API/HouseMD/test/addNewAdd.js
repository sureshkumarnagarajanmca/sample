
    var fs = require('fs');
 
   //var filename ='/root/serverCode/updatedDoctorAddress.json';
   var filename = '/root/serverCode/doctorAddress.json';
    /*
    var records  =[{"addressDoctorId":"58d0ca2d3ccdb51209514b9b602 CHASE AVENUE99574","action":"delete","documentType":"doctor"},
    {"addressDoctorId": "58cfdc813ccdb512094cc944103 Elliott St36435","action":"delete","documentType":"doctor"},
    {"addressDoctorId": "58cfdc813ccdb512094cc944103 Elliott St36435","action":"delete","documentType":"doctor"},
    {"addressDoctorId": "58cfdc813ccdb512094cc944103 Elliott St36435","action":"delete","documentType":"doctor"},
    {"addressDoctorId": "58cfdc813ccdb512094cc944103 Elliott St36435","action":"delete","documentType":"doctor"},
    {"addressDoctorId": "58cfdc813ccdb512094cc944103 Elliott St36435","action":"delete","documentType":"doctor"},
    {"addressDoctorId": "58cfdc813ccdb512094cc944103 Elliott St36435","action":"delete","documentType":"doctor"},
    {"addressDoctorId": "58cfdc813ccdb512094cc944103 Elliott St36435","action":"delete","documentType":"doctor"},
    {"addressDoctorId": "58cfdc813ccdb512094cc944103 Elliott St36435","action":"delete","documentType":"doctor"},
    {"addressDoctorId": "58cfdc813ccdb512094cc944103 Elliott St36435","action":"delete","documentType":"doctor"}];*/
    //var records  =[{"addressDoctorId":"58d0ca2d3ccdb51209514b9b602 CHASE AVENUE99574","action":"delete","documentType":"doctor"}];
    var records = [{ "isSubscribed":false,  "npi":"1972756211","credentialText":["DMD"],"certifications":[{"dateInMonths":"24193","certficationName":"AMERICAN BOARD OF ORTHOPAEDIC SURGERY","_id":"58f8bb22ae5491115b909607","specialities":[{"taxonomyCode":"207X00000X","taxonomyString":"ORTHOPEDIC SURGERY","_id":"58f8bb22ae5491115b909608"}]}],"gender":"M","userId":"58d0ca2d3ccdb51209514b9b","languagesSpoken":[37],"likes":0,"lName":"GIRALDO","fName":"JHON","mName":"ONEILL","action":"insert","documentType":"doctor","insuranceIds":[],"prefix":"Dr.","taxonomy":["122300000X","FADC1DEN_GP1"],"taxonomyByLevel":{"L2":["122300000X"],"L1":["FADC1DEN_GP1"]},"boardCertificationsCode":[],"address":{"phoneNo":"5087990002","zipCode":"01604","state":"MA","city":"Worcester","Line2StreetAddress":"Ste H","Line1StreetAddress":"225 Shrewsbury St","geoLocation":{"location":{"lon":"-71.783576","lat":"42.266753"}},"country":"US"},"orgName" : "PACIFIC NORTHWEST RADIOLOGY LLC","orgId" : "58cb84d9d339106535a5d4c0","addressDoctorId":"58d0ca2d3ccdb51209514b9b602 CHASE AVENUE99575"}]
    records.forEach(function (val,index){
   var jsonObj = JSON.stringify(val);    
   fs.appendFile(filename,jsonObj+"\n",function(err,result){
            if(!err){
                    fs.stat(filename,function(err,val){
                            if(!err){
                                    console.log(val);
                            }
                            else {
                                console.log(err);
                            }
                    });

            }
            else{
                console.log(err);
            }
        })

     });    

