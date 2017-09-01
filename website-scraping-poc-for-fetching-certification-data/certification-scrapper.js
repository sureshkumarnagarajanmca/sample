var $ = require('jquerygo');
var async = require('async');
var mongoose = require('mongoose');
var cheerio = require('cheerio');
$.config.addJQuery = true;
$.config.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.86 Safari/537.36";

//var NPI = ["1972618387","1730176868"];
var npiObjArray = new Array();
var npiIndex = 0;

//DB Code
mongoose.connect('mongodb://10.0.90.17/californiaDoctors');
var db = mongoose.connection;
var collection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("db connected");
    collection = db.collection("doctorstest"); 
    //console.log(db.doctors.find({"certifications.0":{$exists:true}}).count());
    var arr = collection.find({"certificationsLastModified":{$exists:false}},{NPI:1,_id:0}).limit(5000).toArray(); 
    // var arr = collection.find({"NPI":"1972618387"},{NPI:1,_id:0}).limit(1).toArray(); 
    arr.then(function(data){
    	console.log("inside arr promise")
    	npiObjArray = data;
    	//triggering the scraping script
    	//triggerScraping();
    });
	
});

//End the script and triggering the script
/*var timer = setTimeout(function(){
 		console.log("Timer started");	
 },60000);

 function resetTimer(){
 	if(timer){
 		clearTimeout(timer);
 		timer=null;
 	}
 	timer = setTimeout(function(){
 		console.log("Killing phantom to and triggering scraping again");
 		$.close(function(){
 			triggerScraping();
 		});	
 	},60000);
 }*/



//Without async

function scrapeWithoutAsync(uid,pwd){
	$.visit('https://certifacts.abms.org/Login.aspx', function() {
	  // Get the title.
	   $.waitForPage(function() {
	  $('input[name="userName"]').val(uid,function() {
	    $('input[name="password"]').val(pwd,function(){
	      $("#btnLogin").click(function(){
	          $.waitForPage(function() {
	            //search(npiObjArray[npiIndex].NPI);
	            search("1972618387");
	        });
	      });
	    });
	  });
	   });
	});
}
//Start point of scraping
function triggerScraping(){
    	/*console.log("inside scraping trigger");	
		async.series([
		$.go('login', 'atlanticipa@findadoctor.com', 'Danmar#2016')
		], function() {
		    search(npiObjArray[npiIndex].NPI);
		    // search("1972618387");
		});*/ 
		console.log("inside the new scraper");
		scrapeWithoutAsync("atlanticipa@findadoctor.com","Danmar#2016")
}

//Async web navigation script
$.login = function(user, pass, done) {
  async.series([
    $.go('visit', 'https://certifacts.abms.org/Login.aspx'),
    $.go('waitForPage'),
    $('input[name="userName"]').go('val', user),
    $('input[name="password"]').go('val', pass),
    $('#btnLogin').go('click'),
    $.go('waitForPage'),
  ], done);
};

//This method recursively navigates between search results and search query page to get results for each NPI
var search = function(npicode){
	//resetTimer();
    $.visit('https://certifacts.abms.org/DCAdvancedSearch.aspx', function() {
    	  console.log("Inside search page");
          $.waitForPage(function(){
              $('input[name="NPI"]').val(npicode,function(){
                  $('input[name="btnSearch1"]').click(function(){
                      $.waitForPage(function(){
                      		console.log("After search is clicked");
                      		//reset timer
                      		//resetTimer();
                      		$('body').html(function(html){
							var jqWrapper = cheerio.load(html);
							var educationRawData = jqWrapper("div:contains('Education')").next();
							var educationTemp = educationRawData.text().trim().split(/\(/);
							var educationObj = {};
							if(educationTemp.length>1){

								var temp = educationTemp[0].split(/\s+/);
									if(temp.length>1){
										educationObj.educationYear = temp[0].trim();
										educationObj.educationShortName = temp[1].trim();
									}
								educationObj.educationLongName = educationTemp[1].slice(0,-1);	

							}
							
							//Get the board certificate list
							var certList = jqWrapper('td[class="reportboard"]');
                      		if(certList.length !== 0){	
								//scrape the individual certificates by splicing data between individual certifications
								var certificateStartPoint,
								certificateEndPoint,
								certificates,
								certificationObj;
								var certArray = new Array();
								for (var i =0 ; i <certList.length; ++i){
									certficationStartPoint = jqWrapper(certList.get(i)).parent();//traversing to parent tr as our data is in individual trs
									certificationEndPoint =  jqWrapper(certList.get(i+1)).parent();
									taxonomies = certficationStartPoint.nextUntil(certificationEndPoint);
									taxonomies.each(function(index){
										certificationObj = {};
										var details = jqWrapper(this).children(".reportcert");
										if(details.length === 2){
											certificationObj.certficationName = jqWrapper(certList[i]).text().trim();
											certificationObj.taxonomyString = jqWrapper(details[0]).text().trim().split("-")[0].trim();
											certificationObj.status = jqWrapper(details[1]).text().split(":")[1].trim();
											certificationObj.education = educationObj;
											certArray.push(certificationObj);
										}
									});
								}
								console.log(certArray);
								
								//Updating the document
								var update = collection.update({"NPI":npiObjArray[npiIndex].NPI},
									{'$set':{"certifications":certArray},
									$currentDate: {
	        							certificationsLastModified: true,
	     							}
								});
								
								//Continuing with the search
								update.then(function(){
									++npiIndex;
			                        if(npiIndex>=npiObjArray.length){ 
				                        $.close();
			                      	}
			                      	else{
			                        	//search(npiObjArray[npiIndex].NPI); 
			                      	}
			                      },
		                      	function(){
		                      		console.log("something wrong with update, update failed");
		                      	});
							}
							else{
								console.log("No certifications found for the NPI:"+npiObjArray[npiIndex].NPI);

								//Updating the document
								var update = collection.update({"NPI":npiObjArray[npiIndex].NPI},
									{
									$currentDate: {
	        							certificationsLastModified: true,
	     							}
								});
								
								//Continuing with the search
								update.then(function(){
									++npiIndex;
			                        if(npiIndex>=npiObjArray.length){ 
				                        $.close();
			                      	}
			                      	else{
			                        	//search(npiObjArray[npiIndex].NPI); 
			                      	}
			                      },
		                      	function(){
		                      		console.log("something wrong with update, update failed");
		                      	});	
							}
						});
                      });
                  });
              });
          })
       });
    
}

triggerScraping();