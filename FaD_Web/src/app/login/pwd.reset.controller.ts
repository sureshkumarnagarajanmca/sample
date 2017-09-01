export class PasswordResetController{
	public userName: any;
	public pwdInputType = "password";
	public password: string;
	/* @ngInject */
	constructor(public $scope: any,public $mdDialog: any, public $state: angular.ui.IStateService, 
		public LoginService: any,public DoctorProfileSummaryService: any, public toastr: any, public $stateParams) {
		// $state.go("pwd-reset-request");
		// if(!!LoginService.userName){
		// 	$state.go("pwd-reset-otp");
		// }else{
		// 	$state.go("pwd-reset-request");
		// }
		this.pwdInputType = "password";
		this.pwdInputTypeConfirm = "password";
		$scope.otp = "";

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
	checkForNonAlphaNumeric(pass){
		// if(/[^a-zA-Z0-9\-\s]/.test(pass)){
		if(/[^a-zA-Z0-9]/.test(pass)){
			this.errorAlphaNumeric = true;
		}else{
			this.errorAlphaNumeric = false;
		}

	}
	generateOTP(){
		var that = this;
		//this code should go in to validateOTP
		if(this.userName !== "undefined"){
			let params = {};
			params.username = this.userName;
			that.DoctorProfileSummaryService.userName = this.userName;
			this.LoginService.sendOTP(params).then(function(data){
				that.LoginService.userName = data.username;
				that.$state.go("pwd-reset-otp");
			},	function(response){
			var showAlert = function(ev) {
		    // Appending dialog to document.body to cover sidenav in docs app
		    // Modal dialogs should fully cover application
		    // to prevent interaction outside of dialog
		    that.$mdDialog.show(
		      that.$mdDialog.alert()
		        .parent(angular.element(document.querySelector('#reset')))
		        .clickOutsideToClose(true)
		        .title('User Not Found')
		        .textContent('Seems you have not registered yet')
		        .ariaLabel('Alert Dialog Demo')
		        .ok('Ok')
		        .targetEvent(ev)
		    );
  			}
  			showAlert();
		});
		}
	}
	validateOTP(){
		var that = this;
		var params = {};
		params.username = this.LoginService.userName;
		params.otp = this.otp;
		this.LoginService.verifyOTP(params).then(function(data){
			that.LoginService.userId = data.userId;
			that.LoginService.accessToken = data.accessToken;
			that.$state.go("pwd-reset-details");
		},function(error){
			that.otpErrorNotification = error;
		});
	}
	
	resendCode(){
		var that = this;
		if(this.userName !== "undefined"){
			let params = {};
			params.username = this.LoginService.userName;
			this.LoginService.sendOTP(params).then(function(data){
				that.LoginService.userName = data.username;
				that.otpErrorNotification = "code re-sent"
			},function(error){
				that.otpErrorNotification = error
			})
		}else{
			that.$state.go("pwd-reset-details");
		}
	}
	resetPassword(){
		let that = this;
		let params = {};
		params.userId = this.LoginService.userId;
		// params.accessToken = this.LoginService.accessToken;
		params.password = this.password;
		this.LoginService.forgotPassword(params).then(function(){
			that.$state.go("login");
		},function(){
		});
	}
}