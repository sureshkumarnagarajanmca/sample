// var mailer = require('nodemailer');
// mailer.SMTP = 

// console.log(mailer);
// mailer.send_mail({       
//     sender: 'anhsirkias@gmail.com',
//     to: 'abhay555@gmail.com',
//     subject: 'Attachment!',
//     body: 'mail content...'
// }), function(err, success) {
//     if (err) {
//     	console.log(err);
//         // Handle error
//     }else{
//     	console.log(success);	
//     }

// }

var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://anhsirkias@gmail.com:Hello@123@smtp.gmail.com');

  var mailOptions = {   
        sender: "anhsirkias@gmail.com",    
        to:'anhsirkias@gmail.com',   
        subject: 'Hello â', // Subject line
	    text: 'Hello world ð´', // plaintext body
	    html: '<b>Hello world ð´</b>' 
    };

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }else{
    	console.log(info);
    }
    // console.log('Message sent: ' + info.response);
});

// transporter.send_mail(message,   
//       function(err) {   
//         if (!err) { 
//             console.log('Email send ...');
//         } else console.log(err);       
//     });