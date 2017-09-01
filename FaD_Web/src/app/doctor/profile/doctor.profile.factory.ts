/** @ngInject */
export function doctorProfileFactory(CacheFactory:any, $rootScope : any, base64: any){



	let data = {};

	let loginCache = CacheFactory.get('loginDetails');
	if(loginCache.get('authObj')){
	    let authObj = loginCache.get('authObj');
	    let userData = authObj.accessToken.split(".");
	    data.docId = JSON.parse(base64.urldecode(userData[1])).id;
    }
    
	data.specialities = [];
	data.subSpecialities = [];
	data.mergedSpecialities = [];//This has all the level 2 and level 3 taxonomies
	data.practiceLocationAddress = [{
			organizationLegalName: "orgLegalName1",
	        telNo:"1234567",
	        npi:"678912346",
	        practiceAddress :"sample address"
	},{
			organizationLegalName: "orgLegalName2",
			telNo: "1234567",
			npi: "678912346",
			practiceAddress: "sample address"
	},{
			organizationLegalName: "orgLegalName3",
			telNo: "1234567",
			npi: "678912346",
			practiceAddress: "sample address"
	}];
	/*data.stateList = [	"Alabama", 
						"Alaska", 
						"Arizona", 
						"Arkansas", 
						"California", 
						"Colorado", 
						"Connecticut", 
						"Delaware", 
						"Florida", 
						"Georgia", 
						"Hawaii", 
						"Idaho", 
						"Illinois Indiana", 
						"Iowa", 
						"Kansas", 
						"Kentucky", 
						"Louisiana", 
						"Maine", 
						"Maryland", 
						"Massachusetts", 
						"Michigan", 
						"Minnesota", 
						"Mississippi", 
						"Missouri", 
						"Montana Nebraska", 
						"Nevada", 
						"New Hampshire", 
						"New Jersey", 
						"New Mexico", 
						"New York", 
						"North Carolina", 
						"North Dakota", 
						"Ohio", 
						"Oklahoma", 
						"Oregon", 
						"Pennsylvania Rhode Island", 
						"South Carolina", 
						"South Dakota", 
						"Tennessee", 
						"Texas", 
						"Utah", 
						"Vermont", 
						"Virginia", 
						"Washington", 
						"West Virginia", 
						"Wisconsin", 
						"Wyoming",
					];*/
	data.stateList = ["California"];				
	data.cityList = [ 
						"Los Angeles",
						"East Los Angeles",
						"City Of Commerce",
						"Cole",
						"Vernon",
						"Hazard",
						"West Hollywood",
						"Bell Gardens",
						"East Rancho Domi",
						"Rosewood",
						"Culver City",
						"Downey",
						"El Segundo",
						"Gardena",
						"Holly Park",
						"Hermosa Beach",
						"Huntington Park",
						"Lawndale",
						"Lynwood",
						"Malibu",
						"Manhattan Beach",
						"Maywood",
						"Pacific Palisade",
						"Palos Verdes Est",
						"Redondo Beach",
						"South Gate",
						"Topanga",
						"Venice",
						"Marina Del Rey",
						"Playa Del Rey",
						"Inglewood",
						"Hawaiian Gardens",
						"Rancho Palos Ver",
						"Rossmoor",
						"Paramount",
						"San Pedro",
						"Seal Beach",
						"Wilmington",
						"Signal Hill",
						"Long Beach",
						"Carson",
						"Altadena",
						"Arcadia",
						"Bradbury",
						"Flintridge",
						"Monrovia",
						"Montrose",
						"Sierra Madre",
						"South Pasadena",
						"Shadow Hills",
						"Tujunga",
						"Pasadena",
						"San Marino",
						"Glendale",
						"La Crescenta",
						"Oak Park",
						"Calabasas",
						"Canoga Park",
						"Winnetka",
						"West Hills",
						"Chatsworth",
						"Encino",
						"Newbury Park",
						"Newhall",
						"Northridge",
						"Porter Ranch",
						"California State",
						"Arleta",
						"Reseda",
						"San Fernando",
						"Claremont",
						"Corona",
						"Rancho Cucamonga",
						"El Monte",
						"South El Monte",
						"Alta Loma",
						"Etiwanda",
						"Glendora",
						"Hacienda Heights",
						"Bassett",
						"Rowland Heights",
						"La Verne",
						"Mira Loma",
						"Monterey Park",
						"Mt Baldy",
						"Norco",
						"Montclair",
						"Diamond Bar",
						"Phillips Ranch",
						"Pomona",
						"Rosemead",
						"Warner Springs",
						"San Diego"
					];				
	//data.docId = "5763d52b83536be618e8a693";//doctorId will be set from sigup controller and login controller
	data.originalDocObj = {}; //this one is used for rendering purposes
	data.stagedDocObj = {}; //this one is used while saving the object in the backend
	//capturing user details..temp code to be removed
	data.user = {};
	return data;
}