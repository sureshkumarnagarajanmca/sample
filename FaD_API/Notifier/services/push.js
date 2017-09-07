(function(){
	'use strict'
	var PubNub = require('pubnub')
	
	// pubnub.uuid();
	var pubnub = new PubNub({
		ssl: true,
	    publish_key   : "pub-c-d2df39be-5ba0-4a47-813d-599f46a444a4",
	    subscribe_key : "sub-c-b03879fc-7f11-11e6-9abc-0619f8945a4f",
	    uuid: 'Stephen'
	});


// console.log(pubnub.uuid());
	// pubnub.setUUID("string") ;

var channel = 	pubnub.get_uuid();

	

	// Subscribe with messages

	pubnub.subscribe({
	    channel : channel,
	    message : function( message, env, channel ){
	        // RECEIVED A MESSAGE.
	        console.log(message)
	    },
	    connect : function(){
	        console.log("Connected")
	    },
	    disconnect : function(error){
	    	console.log(error);
	        console.log("Disconnected")
	    },
	    reconnect : function(){
	        console.log("Reconnected")
	    },
	    error : function(){
	        console.log("Network Error")
	    }, 
	})

	pubnub.mobile_gw_provision ({
	    device_id: '65668db67ba54833',
	    op : 'add',
	    gw_type : 'gcm', // or 'gcm'
	    channel : channel,
	    callback : function(succ){
	    	console.log(succ)
	    },
	    error : function(error){
	    	console.log(error);
	    }
	});


	// pubnub.publish({
	//     channel : channel,
	//     message : 'Hello from the PubNub Javascript SDK!'
	// }, function(status, response){
	//         console.log(status,response)
	//     });


	// function publish() {
   
  
       
    function publishSampleMessage() {
        console.log("Since we're publishing on subscribe connectEvent, we're sure we'll receive the following publish.");
        var publishConfig = {
            channel : channel,
            message : "Hello from PubNub Docs!"
        }
        pubnub.publish(publishConfig, function(status, response) {
            console.log(status, response);
        })
    }
       
    // pubnub.addListener({
    //     status: function(statusEvent) {
    //         if (statusEvent.category === "PNConnectedCategory") {
    //             publishSampleMessage();
    //         }
    //     },
    //     message: function(message) {
    //         console.log("New Message!!", message);
    //     },
    //     presence: function(presenceEvent) {
    //         // handle presence
    //     }
    // })      
    // console.log("Subscribing..");
    // pubnub.subscribe({
    //     channels: ['hello_world'] 
    // },function(status,response){
    // 	console.log(status,response);
    // });

    // publishSampleMessage();
// };

	 // function publishSampleMessage() {
  //       console.log("Since we're publishing on subscribe connectEvent, we're sure we'll receive the following publish.");
  //       var publishConfig = {
  //           channel : "hello_world",
  //           message : "Hello from PubNub Docs!"
  //       }
  //       pubnub.publish(publishConfig, function(status, response) {
  //           console.log(status, response);
  //       })
  //   }
       
  //   pubnub.addListener({
  //       status: function(statusEvent) {
  //           if (statusEvent.category === "PNConnectedCategory") {
  //               publishSampleMessage();
  //           }
  //       },
  //       message: function(message) {
  //           console.log("New Message!!", message);
  //       },
  //       presence: function(presenceEvent) {
  //           // handle presence
  //       }
  //   })      
  //   console.log("Subscribing..");
  //   pubnub.subscribe({
  //       channels: ['hello_world'] 
  //   });
	// pubnub.publish({
	//     channel: 'my_channel',
	//     message: 'Hello from the PubNub Javascript SDK',
	//     callback : function(m){
	//         console.log(m)
	//     }
	// });

})();


