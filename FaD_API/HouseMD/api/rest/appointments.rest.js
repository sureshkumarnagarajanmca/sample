
var appControlListService = require('../services/AppControlListService.js'),
    errors = require('../errors'),
    errorHandler = require('../serviceHandler').errorHandler,
    paramType = require('../validator/paramTypes.js');
var logstash = require('../../logger/logstashCode');
var AppointmentService = require('../services/AppointmentService');

var Q = require('q');
function AppointmentsApi(){
	function createAppointment(req,res){
		var data = req.body;
		AppointmentService.createAppointment(data).then(function(succ){
			res.send(succ);
		},function(err){

		});
	}

	function cancelAppointment(req,res){
		var appointmentId = req.params.appointmentId;
		AppointmentService.cancelAppointment(appointmentId).then(function(succ){
			res.send(succ);
		},function(err){

		});
	}

	function getAppointment(req,res){
		var appointmentId = req.params.appointmentId;
		AppointmentService.getAppointment(appointmentId).then(function(succ){
			console.log(succ);
			res.send(succ);
		},function(err){

		});
	}

    this.resourcePath = '/appointment';
    this.description = "Operations about appointments";
    this.getMappings = function() {
        // return {	
        // 	'/appointment' :{
        //         'post' : {
        //             callbacks: [createAppointment],
        //             resource: 'Appointment',
        //             action: 'createAppointment',
        //             summary: "create aa appointment",
        //             notes: "This method creates new Appointment",
        //             type: "Object",
        //             parameters: [
        //                 paramType.body("body","Provide json object to Create","appointmentObject",true)
        //             ],
        //             responseMessages: [{
        //                 "code": 400,
        //                 "message": "Invalid parameters"
        //             }]
        //     	},
        //     	'/:appointmentId':{
        //     		'/cancel':{
        //     			'put' :{
	       //      			callbacks: [cancelAppointment],
		      //               resource: 'Appointment',
		      //               action: 'cancelAppointment',
		      //               summary: "cancel appointment",
		      //               notes: "This cancels Appointment",
		      //               type: "Object",
		      //               parameters: [
	       //                      paramType.path("appointmentId", "appointmentId of the appointment", "string", true)
        //                     ],
		      //               responseMessages: [{
		      //                   "code": 400,
		      //                   "message": "Invalid parameters"
		      //               }]	
	       //      		}
        //     		},
        //     		'get' : {
        //     			callbacks: [getAppointment],
	       //              resource: 'Appointment',
	       //              action: 'getAppointment',
	       //              summary: "to get an appointment",
	       //              notes: "to get an Appointment",
	       //              type: "Object",
	       //              parameters: [
        //                     paramType.path("appointmentId", "appointmentId of the appointment", "string", true)
        //                 ],
	       //              responseMessages: [{
	       //                  "code": 400,
	       //                  "message": "Invalid parameters"
	       //              }]	
        //     		}
        //     	}
        // 	}
        // }
    }
}

module.exports = {
    getInst : function() {
        return new AppointmentsApi();
    }
};