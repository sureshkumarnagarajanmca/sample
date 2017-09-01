export class DoctorSignupController{
	public user: any;
	public mobile: any;
	public phoneRegex: any;
	public pwdInputType: string;
	public npiValidation : boolean;
	/* @ngInject */
	constructor(public $scope: angular.IScope,
				public $mdDialog: any, 
				public DoctorProfileFactory: any, 
				public DoctorProfileService: any, 
				public DoctorProfileSummaryService: any, 
				public $uibModal: any,
				public $state: angular.ui.IStateService, public toastr: any,
				public $stateParams, public CacheFactory: any) {
		this.user = {};
		this.phoneRegex = /^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/;
		// this.phoneRegex = /\([1-9]{1}[0-9]{2,}\)\s[0-9]{3,}\-[0-9]{4}/;
		this.mobile = {};
		this.mobile.mobileCtrl = null;
		this.pwdInputType = "password";
		this.pwdInputTypeConfirm = "password";
		this.npiValidation = undefined;
		if(!DoctorProfileFactory.docId){
			$state.go('doctor-signup')
		}
		$scope.$watch("user.confirmPassword", function() {
		});
		$scope.otp = "";
		$(window).resize(function () {
		    var width = $(window).width();
		    var height = $(window).height();
		    //alert("width:"+ width + " and height:"+ height);
		    if(height < 650) {
		    	$('.footer').hide();
		    } else {
		    	$('.footer').show();

		    }
		});
		
		$(function() {
		    $('#npi').on('keypress', function(e) {
		        if (e.which == 32)
		            return false;
		    });
		});
		$(function() {
		    $('#email').on('keypress', function(e) {
		        if (e.which == 32)
		            return false;
		    });
		});
		$(function() {
		    $('#mobile').on('keypress', function(e) {
		        if (e.which == 32)
		            return false;
		    });
		});
		$('#npi').on('change keyup', function() {
		  var sanitized = $(this).val().replace(/[^0-9]/g, '');
		  $(this).val(sanitized);
		});
		$(function() {
		    $('#password').on('keypress', function(e) {
		        if (e.which == 32)
		            return false;
		    });
		});
		$(function() {
		    $('#confirmPassword').on('keypress', function(e) {
		        if (e.which == 32)
		            return false;
		    });
		});

		// function theFocus(obj) {
		//     var tooltip = document.getElementById("#mobile");
		//     tooltip.innerHTML = obj.title;
		//     tooltip.style.display = "block";
		//     tooltip.style.top = obj.offsetTop - tooltip.offsetHeight + "px";
		//     tooltip.style.left = obj.offsetLeft + "px";
		// }
	}

	checkNpi() {
		let that = this;
		this.npiValidation = false;
		this.DoctorProfileService.npi = this.user.npi;
		this.DoctorProfileService.queryNpi().then(function(data) {
			if (data.hasOwnProperty("errorCode")) {
				that.npiValidation = false;
			}
			else {
				that.npiValidation = true;
			}
		}, function(error) {
			// that.otpErrorNotification = error;
			that.npiValidation = false;
		});
	}

	pwdChangeIcon(pwdInputType) {
		if(this.pwdInputType === "password") {
			this.pwdInputType = "text";
		} else if(this.pwdInputType === "text") {
			this.pwdInputType = "password";
		}
	}
	pwdChangeIconConfirm(pwdInputTypeConfirm) {
		if(this.pwdInputTypeConfirm === "password") {
			this.pwdInputTypeConfirm = "text";
		} else if(this.pwdInputTypeConfirm === "text") {
			this.pwdInputTypeConfirm = "password";
		}
	}
	openInfoIconModal() {
		let that = this;
		let modalInstance = this.$uibModal.open({
			animation: this.$scope.animationsEnabled,
			templateUrl: 'info-icon',
			controller: '',
			size: 'md',
			resolve: {
			}
		});
	}
	mobileFormat(mobile) {
		if(mobile.length === 10){
			this.mobileView = "("+mobile.substring(0,3)+") "+mobile.substring(3,6)+"-"+mobile.substring(6,10);
		}
	}
	$scope.registerDoctor = function(doctorRegistration) {
		if(!(!this.errorAlphaNumeric&&doctorRegistration.$valid)){
		}else{
			 // ng-disabled="!(doctorRegistration.doctorRegistrationValue&&!doctorSignup.errorAlphaNumeric&&doctorRegistration.$valid)"
			let that = this;
			this.user.type = "doctor";

			let selectedCountryData = this.mobile.mobileCtrl.getSelectedCountryData();
			this.user.countryCode = '+' + selectedCountryData.dialCode;
			this.user.mobile = this.user.mobile.substring(this.user.countryCode.length, this.user.mobile.length);

			//temp code, this has to be removed for production build			
			// this.user.countryCode = "+91";
			this.DoctorProfileFactory.user = this.user;
			this.DoctorProfileSummaryService.user = this.user;
			//deleting confirmPassword attribute from the user object as it is not required
			delete this.user["confirmPassword"];
			this.user["username"] = this.user["username"].toLowerCase();
			let result = this.DoctorProfileService.signupDoctor(this.user);
			result.then(function(data){
				if (data.hasOwnProperty("errorCode")) {
					that.user.mobile = that.user.countryCode + that.user.mobile;
				}
				else {
					//need to set userId from the data to doctor profile factory's docId
					that.DoctorProfileFactory.docId = data.userId;
					//navigating to sign up confirmation screen
					that.$state.go("doctor-profile-otp", { userId: data.userId });
				}
			},function(error){
				that.user.mobile = that.user.countryCode + that.user.mobile;
				that.checkerrorOnSignup(error);
				// this.emaiIdExisting = 
			});
		}
	}
	$scope.showConfirm = function(doctorRegistration) {
     	let that = this;
     	var regexNum = this.user.mobile;
     	regexNum = regexNum.replace(/.(?=.{4})/g, 'x');
	    // Appending dialog to document.body to cover sidenav in docs app
	    if(!!doctorRegistration.$valid) {
	    	var confirm = $mdDialog.confirm()
	            // .title('Would you like to continue with the same number?')
	            .textContent('A confirmation code will be sent to the entered mobile number ' + regexNum + ', do you want to continue ?')
	            .ariaLabel('Lucky day')
	            .targetEvent(doctorRegistration)
	            .ok('Continue')
	            .cancel('Cancel');
		    $mdDialog.show(confirm).then(function() {
		        that.registerDoctor(doctorRegistration);
		    }, function() {
		    });
	    }
    };
	checkerrorOnSignup(error){
		if(Array.isArray(error)){

			// ['email','npi','mobile'].forEach(function)
			for(let errList of ['email','npi','mobile','newNpi']){
				let flag = false;
				for(let err of error){
					if(err === errList){
						flag = true;
						break;
					}
				}	
				if(flag){
					if(errList === 'email'){
						this.emailIdExisting = true;	
					}else if(errList === 'npi'){
						this.npiExisting = true;
					}else if(errList === 'mobile'){
						this.mobileExisting = true;
					}else if(errList === 'newNpi'){
						this.newNpi = true;
					}
				}else{
					if(errList === 'email'){
						this.emailIdExisting = false;	
					}else if(errList === 'npi'){
						this.npiExisting = false;
					}else if(errList === 'mobile'){
						this.mobileExisting = false;
					}else if(errList === 'newNpi'){
						this.newNpie = false;
					}
				}
			}
			// for (var i = 0; i < error.length; i++) {
			// 	// Things[i]
				// if(error[i] === 'email'){
				// 	this.emailIdExisting = true;	
				// }else if(error[i] === 'npi'){
				// 	this.npiExisting = true;
				// }else if(error[i] === 'mobile'){
				// 	this.mobileExisting = true;
				// }

			// 	if(error.length = 1){
			// 		['email','npi','mobile']
			// 	}else{

			// 	}
			// };
			// if(error.length === 3){
			// 	this.emailIdExisting = true;
			// 	this.npiExisting = true;
			// 	this.mobileIdExisting = true;
			// }else if(error.length === 2){


			// }else if(error.length === 1){

			// }
		}
	}

	checkForNonAlphaNumeric(pass){
		// if(/[^a-zA-Z0-9\-\s]/.test(pass)){
		if(/[^a-zA-Z0-9]/.test(pass)){
			this.errorAlphaNumeric = true;
		}else{
			this.errorAlphaNumeric = false;
		}

	}

	

	verifyOTP(){
		var that = this;
		var params = {};
		params.userId = this.DoctorProfileFactory.docId;
		params.otp = this.otp;
		this.DoctorProfileService.verifyOTP(params).then(function(data) {
			var loginCache = that.CacheFactory.get('loginDetails');
			loginCache.put('authObj', data);
			// that.$state.go("doctor-profile-update");
			that.$state.go("profile",{"id" : that.DoctorProfileFactory.docId});
		}, function(error) {
			that.otpErrorNotification = error;
		});
		
	}

	resendCode(){
		var that = this;
		if(this.userName !== "undefined"){
			let params = {};
			params.username = this.DoctorProfileFactory.user.username;
			this.DoctorProfileService.sendOTP(params).then(function(data){
				that.otpErrorNotification = "code re-sent"
			},function(error){
				that.otpErrorNotification = error;
			})
		}else{
		}
	}
     


  $scope.showAlert = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#abc')))
        .clickOutsideToClose(true)
        .title('NPI-National Provider Identifier')
        .textContent('A unique 10-digit identification number issued to healthcare providers in the United States by the Centers for Medicare and Medicaid Services (CMS). Both individual (doctors, nurses, dentists) and organizational (hospitals, clinics, nursing homes) healthcare providers are required to obtain an NPI.')
        .ariaLabel('Alert Dialog Demo')
        .ok('Ok')
        .targetEvent(ev)
    );
  };

}