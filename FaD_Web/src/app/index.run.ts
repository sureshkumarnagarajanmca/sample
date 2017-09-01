/** @ngInject */
export function runBlock( $log: angular.ILogService, CacheFactory:any, public DoctorProfileSummaryService: any, $rootScope : any, base64: any, $state: any) {

	//creating login cahce to be used in the interceptor
	if (!CacheFactory.get('loginDetails')) {
		CacheFactory.createCache('loginDetails', {
			deleteOnExpire: 'aggressive',
			maxAge: 60 * 60 * 1000, // 1hr
			storageMode: 'localStorage',
			capacity: 1
		});
	}
	CacheFactory.createCache('searchDetails', {
      deleteOnExpire: 'aggressive',
      maxAge: 60 * 60 * 250, // 1hr
      storageMode: 'localStorage',
      capacity: 1
    });
    CacheFactory.createCache('locationDetails', {
      deleteOnExpire: 'aggressive',
      maxAge: 60 * 60 * 250, // 1hr
      storageMode: 'localStorage',
      capacity: 1
    });
    CacheFactory.createCache('specialtyDetails', {
      deleteOnExpire: 'aggressive',
      maxAge: 60 * 60 * 250, // 1hr
      storageMode: 'localStorage',
      capacity: 1
    });
    CacheFactory.createCache('illnessDetails', {
      deleteOnExpire: 'aggressive',
      maxAge: 60 * 60 * 250, // 1hr
      storageMode: 'localStorage',
      capacity: 1
    });
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
	});

	/* $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, error) {
		  if(!!fromState.name){
		  	if(toState.name === "doctor-profile-update" && fromState.name === "doctor-profile-update"){
			  		event.preventDefault();
			}
			if(fromState.name === "doctor-profile-update"){
				if(toState.name !== "doctor-profile-summary"){
				  		event.preventDefault();
				}
			}
			if(fromState.name === "doctor-profile-summary"){
				if(toState.name == "login"){
				  		event.preventDefault();
				}
			}
			if(fromState.name === "login"){
				if(toState.name !== "doctor-profile-summary" && toState.name !== "doctor-signup" && toState.name !== "list-practice" && toState.name !== "pwd-reset-request" && toState.name !== "search"){
				  		event.preventDefault();
				}
			}
			if(fromState.name !== "search" && fromState.name !== "search-results") {
				if(fromState.name === "doctor-profile-otp"){
					if(toState.name == "doctor-signup"){
				  		DoctorProfileSummaryService.user = {};
					}
				}
				if(fromState.name === "pwd-reset-otp"){
					if(toState.name == "pwd-reset-request"){
				  		DoctorProfileSummaryService.userName = "";
					}
				}
				if(fromState.name === "doctor-signup"){
					if(!DoctorProfileSummaryService.user.username) {
						if(toState.name == "doctor-profile-otp"){
						  		event.preventDefault();
						}
					}
				}
				if(toState.name === "pwd-reset-otp"){
					if(!DoctorProfileSummaryService.userName) {
						if(fromState.name == "pwd-reset-request"){
							event.preventDefault();
						}
					}
				}
			}
			
			
			if(fromState.name === "doctor-profile-otp"){
				if(toState.name !== "doctor-profile-update" && toState.name !== "search" && toState.name !== "doctor-signup"){
					event.preventDefault();
				}
			}
			if(toState.name === "doctor-profile-otp"){
				if(fromState.name !== "doctor-signup"){
					event.preventDefault();
				}
			}
			if(toState.name === "pwd-reset-otp"){
				if(fromState.name !== "pwd-reset-request"){
					event.preventDefault();
				}
			}
			if(toState.name === "pwd-reset-details" && fromState.name === "pwd-reset-details"){
			  		event.preventDefault();
			}
			if(toState.name === "pwd-reset-otp" && fromState.name === "pwd-reset-details"){
			  		event.preventDefault();
			}
			if(toState.name === "pwd-reset-details" && fromState.name === "login"){
			  		event.preventDefault();
			}
			if(toState.name === "pwd-reset-otp"){
				if(toState.name === "pwd-reset-otp" && fromState.name === "pwd-reset-request"){
			  			
				}else{
					event.preventDefault();
				}	
			}
		  }else{
		  	   if(toState.name=== 'doctor-signup' || toState.name=== 'login' || toState.name=== 'doctor-profile-otp'){
		  	   		let loginCache = CacheFactory.get('loginDetails');
				    if(loginCache.get('authObj')){
				      let accessToken = loginCache.get('authObj').accessToken;
				      if(!!accessToken){
				      	if(!!fromState.name){
				      		event.preventDefault();
				      	}else{
      						let docId = JSON.parse(base64.urldecode(accessToken.split(".")[1])).id;
               				setTimeout(function(){
	               				$state.go("doctor-profile-summary",{id : docId});     					
               				})
				      	}
				      }
				    }
		  	   }
		  }
	});*/

}
