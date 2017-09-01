var $ = require('jquerygo');
var cheerio = require('cheerio');
var async = require('async');
$.config.addJQuery = true;
$.config.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.86 Safari/537.36";

var npiObjArray = ["1972618387","1730176868"];
var npiIndex = 0;

triggerScraping();

function triggerScraping() {
	scrapeWithoutAsync("atlanticipa@findadoctor.com","Danmar#2016");	
}

function scrapeWithoutAsync(username, password) {
	try {
		console.log(username, password);
		$.visit('https://certifacts.abms.org/Login.aspx', function() {
			console.log('inside login');
			$.waitForPage(function() {
				$('input[name="userName"]').val(username,function() {
					$('input[name="password"]').val(password,function(){
						$("#btnLogin").click(function(){
							$.waitForPage(function() {
								search("1972618387");
							});
						});
					});
				});
			});
		});		
	} catch(err) {
		console.log(err.message);
	}
}

function search(npi) {
	$.visit('https://certifacts.abms.org/DCAdvancedSearch.aspx', function() {
		console.log("Inside search page");
	});
}

