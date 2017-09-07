
var fs = require('fs');
var filename ='/root/serverCode/deleteDoctorAddress.json';
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
var records  =[{"addressDoctorId":"58d0ca2d3ccdb51209514b9b602 CHASE AVENUE99574","action":"delete","documentType":"doctor"}];
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

})

