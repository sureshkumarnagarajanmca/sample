/** @ngInject */
export function routerConfig($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/main/main.html',
      controller: 'MainController',
      controllerAs: 'main'
    }).
    state('search', {
      url: '/search',
      controller: "SearchController",
      controllerAs: "search",
      templateUrl: 'app/user/search/search.html'
    }).
    state('profile', {
      url: '/profile/:id',
      controller: "ProfileController",
      controllerAs: "profile",
      templateUrl: 'app/doctor/profile/profile.html'
    }).	
    state('list-practice', {
      url: '/list-practice',
      controller: "listPracticeController",
      controllerAs: "practice"
      templateUrl: 'app/user/search/list-practice.html',
      resolve : {
          loginStatus: function(DoctorProfileFactory: any, $state: any,$q:any,CacheFactory:any){

            var deffered = $q.defer();
            var loginCache = CacheFactory.get('loginDetails');
            setTimeout(function(){
              if(loginCache.get('authObj')){
                // $state.go("doctor-profile-summary",{id : DoctorProfileFactory.docId});
				$state.go("profile",{"id" : DoctorProfileFactory.docId});
              }else{
                deffered.resolve();
              }  
            })
            return deffered.promise;
          }
        }
    }).
    state('search-results', {
      url: '/search-results',
      controller: "SearchResultsController",
      controllerAs: "searchResults",
      templateUrl: 'app/user/search/search-results.html'
    }).
    state('quick-search',{
      controller:"QuickSearchController",
      params:{speciality:null,insurance:null,location:null}
    }).
    state('user-profile', {
      url: '/user-profile',
      templateUrl: 'app/user/profile/user-profile.html',
      controller:'UserProfileController',
      controllerAs:'userProfile',
      params:{userId:null},
      resolve:{
        userDetails: function($stateParams: any, UserProfileService:any){
          return UserProfileService.getUser($stateParams.userId);
        }
      }
    }).
    state('user-signup', {
      url: '/user-signup',
      templateUrl: 'app/user/profile/user-signup.html',
      controller: 'UserSignupController',
      controllerAs: 'userSignup'
    }).
    state('calendar', {
      url: '/calendar',
      controller: "CalendarController",
      controllerAs: "vm",
      templateUrl: 'app/doctor/calendar/calendar.html'
    }).
    state('doctor-details', {
      url: '/doctor-details',
      controller: 'DoctorProfileController',
      controllerAs: 'doctorDetails',
      templateUrl: 'app/user/search/doctor-profile.html',
      params:{cardObj:null,userLocation:null}
    }).

    //doctor signup routes
    state('doctor-signup',{
      url:'/doctor-signup',
      controller:"DoctorSignupController",
      controllerAs:"doctorSignup",
      templateUrl:"app/doctor/profile/doctor-signup.html"
    }).
    state('doctor-profile-update', {
      url: '/doctor-profile-update',
      controller: "DoctorProfileUpdateController",
      controllerAs: "doctorProfileUpdate",
      templateUrl: "app/doctor/profile/doctor-profile-update.html",
      resolve : {
          loginStatus: function($stateParams: any, UserProfileService:any, $state: any,$q:any,CacheFactory:any){
            var deffered = $q.defer();
            var loginCache = CacheFactory.get('loginDetails');
            setTimeout(function(){
              if(loginCache.get('authObj')){
                deffered.resolve("data");
              }else{
                $state.go("login");
              }  
            })
            return deffered.promise;
          }
        }
    }).
    state('doctor-signup-confirmation', {
    url: '/doctor-signup-confirmation',
    controller: "DoctorSignupController",
    controllerAs: "doctorSignup",
    templateUrl: "app/doctor/profile/doctor-signup-confirmation.html"
    }).
    state('doctor-profile-otp', {
    url: '/doctor-profile-otp',
    controller: "DoctorSignupController",
    controllerAs: "doctorSignup",
    templateUrl: "app/doctor/profile/doctor-profile-otp.html"
    }).

    //login routes
    state('login', {
      url: '/login',
      controller: "LoginController",
      controllerAs: "loginController",
      templateUrl: "app/login/login.html",
      params:{loginType:"doctor"},
      resolve :{
        test : function(){
        }
      }
    }).

    //Password reset routes
    state('pwd-reset-request', {
      url: '/pwd-reset-request',
      controller: "PasswordResetController",
      controllerAs: "pwdResetController",
      templateUrl: "app/login/pwd-reset-request.html"
    }).
    state('pwd-reset-otp', {
      url: '/pwd-reset-otp',
      controller: "PasswordResetController",
      controllerAs: "pwdResetController",
      templateUrl: "app/login/pwd-reset-otp.html",
      resolve : {
          loginStatus: function(LoginService: any,$state: any,$q:any){
              var deffered = $q.defer();
              setTimeout(function(){
                if(!LoginService.userName){
                  $state.go("pwd-reset-request");
                }else{
                 deffered.resolve("succ");
                } 
              })
              return deffered.promise;
            }
          }
    }).
    state('pwd-reset-details', {
      url: '/pwd-reset-details',
      controller: "PasswordResetController",
      controllerAs: "pwdResetController",
      templateUrl: "app/login/pwd-reset-details.html"
    }).

    //doctor advanced profile routes
    state('doctor-profile-main', {
      url: '/doctor-profile-main/:id',
      controller: "DoctorAdvancedProfileController",
      controllerAs: "advancedDoctorProfile",
      templateUrl: "app/doctor/profile-advanced/views/profile-main.html",
      resolve : {
          loginStatus: function($stateParams: any, UserProfileService:any, $state: any,$q:any,CacheFactory:any){
            var deffered = $q.defer();
            var loginCache = CacheFactory.get('loginDetails');
            setTimeout(function(){
              if(loginCache.get('authObj')){
                deffered.resolve("data");
              }else{
                $state.go("login");
              }  
            })
            return deffered.promise;
          }
        }
    }).
    state('doctor-profile-main.basic-info', {
       url:'/basic-info',
       templateUrl: "app/doctor/profile-advanced/views/basic-info.html"
    }).
    state('doctor-profile-main.practice-info', {
      url: '/practice-info',
      templateUrl: "app/doctor/profile-advanced/views/practice-info.html"
    }).
    state('doctor-profile-main.insurances', {
      url: '/insurances',
      templateUrl: "app/doctor/profile-advanced/views/insurances.html"
    }).
    state('doctor-profile-main.education', {
      url: '/education',
      templateUrl: "app/doctor/profile-advanced/views/education-details.html"
    }).

    //doctor advanced profile summary routes
    state('doctor-profile-summary',{
      url:'/doctor-profile-summary/:id',
      controller:'DoctorProfileSummaryController',
      controllerAs:'docProfileSummary',
      templateUrl:'app/doctor/profile-summary/profile-summary.html',
      resolve : {
          loginStatus: function($stateParams: any, UserProfileService:any, $state: any,$q:any,CacheFactory:any,SearchService: any){
            var deffered = $q.defer();
            var loginCache = CacheFactory.get('loginDetails');
            setTimeout(function(){
              if(loginCache.get('authObj')){
                SearchService.getDoctor($stateParams.id).then((data: any) => {
                  // this.doctor = data;
                  if(!data.updateDate){
                    // $state.go('doctor-profile-update');
					deffered.resolve({"redirectTo":"doctor-profile-update"});
                  }else{
                    deffered.resolve("data");
                  }
                  // cacheObj.doctor = data;
                  // doctorCache.put(this.userId, cacheObj); 
                  // this.$filter("parentTaxonomyMerge")(data.taxonomy);
                });


                
              }else{
                $state.go("login");
              }  
            })
            return deffered.promise;
          }
        }
    }).

    //doctor dashboard page
    state('dashboard-main', {
      url: '/dashboard-main',
      templateUrl: 'app/doctor/dashboard/dashboard-main.html',
      resolve : {
          loginStatus: function($stateParams: any, UserProfileService:any, $state: any,$q:any,CacheFactory:any){
            var deffered = $q.defer();
            var loginCache = CacheFactory.get('loginDetails');
            setTimeout(function(){
              if(loginCache.get('authObj')){
                deffered.resolve("data");
              }else{
                $state.go("login");
              }  
            })
            return deffered.promise;
          }
        }
    }).
    state('dashboard-main.manage-schedule',{
      url:'/manage-schedule',
      templateUrl: 'app/doctor/dashboard/manage-schedule.html',
    }).
    state('dashboard-main.account-billing',{
      url:'/account-billing',
      templateUrl: 'app/doctor/dashboard/account-billing.html'
    }).
    state('dashboard-main.settings', {
      url: '/settings',
      templateUrl: 'app/doctor/dashboard/settings.html'
    }).
    state('dashboard-main.about-fad', {
      url: '/about-fad',
      templateUrl: 'app/doctor/dashboard/about-fad.html',
    }).
    state('dashboard-main.calendar', {
      url: '/calendar',
      templateUrl: 'app/doctor/dashboard/calendar.html'
    }).
    state('dashboard-main.notifications', {
      url: '/notifications',
      templateUrl: 'app/doctor/dashboard/notifications.html'
    }).

    //content routes
    state('faq', {
      url: '/faq',
      templateUrl: 'app/content/faq.html',
      controller:'ContentController',
      controllerAs:'content'
    }).
    state('doc-faq', {
      url: '/doc-faq',
      templateUrl: 'app/content/doc-faq.html',
      controller:'ContentController',
      controllerAs:'content'
    }).
    state('contact-us', {
      url: '/contact-us',
      templateUrl: 'app/content/contact-us.html',
      controller: 'ContentController',
      controllerAs: 'content'
    }).
    state('about-us', {
      url: '/about-us',
      templateUrl: 'app/content/about-us.html',
      controller:'ContentController',
      controllerAs:'content'
    }).
    state('privacy', {
      url: '/privacy',
      templateUrl: 'app/content/privacy.html',
      controller:'ContentController',
      controllerAs:'content'
    }).
    state('local', {
      url: '/local',
      templateUrl: 'app/content/local-804/local.html'
    }).
    state('doc-terms-of-use', {
      url: '/doc-terms-of-use',
      templateUrl: 'app/content/doc-terms-of-use.html',
      controller:'ContentController',
      controllerAs:'content'
    }).
    state('terms-of-use', {
      url: '/terms-of-use',
      templateUrl: 'app/content/terms-of-use.html',
      controller:'ContentController',
      controllerAs:'content'
    });
  $urlRouterProvider.otherwise('search');
}
