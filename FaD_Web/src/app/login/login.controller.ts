export class LoginController{
	private userObj:any;

	/**@ngInject**/
	constructor(private $scope:any, 
				public $mdDialog: any,
				private LoginService:any,
				private $state: angular.ui.IStateService, 
				public $stateParams: any, 
				private CacheFactory: any,
				public toastr:any) {
		//Event listener for token expiry
		$scope.$on('tokenExpiry',function(){
			$state.go("login");		
		})
		this.pwdInputType = "password";
	}

	pwdChangeIcon(pwdInputType) {
		if(this.pwdInputType === "password") {
			this.pwdInputType = "text";
		} else if(this.pwdInputType === "text") {
			this.pwdInputType = "password";
		}
	}

	
	login(){
		var that = this;
		let result = this.LoginService.login(this.userObj);
		result.then(function(data){
			let userId = data.userId;
			var loginCache = that.CacheFactory.get('loginDetails');
			var loginType = that.$stateParams.loginType;
			//injecting username and user type in to the data object, it will be used accross the app
			//to determine the user unique name and user type
			data.loginType = loginType;
			data.userName = that.userObj.username;
			loginCache.put('authObj',data );
			if(loginType === "emp"){
				// that.$state.go("doctor-profile-main.basic-info",{"id":userId});
				that.$state.go("user-profile", { "userId": userId });
			}
			else{
				console.log('1111');
				// that.$state.go("doctor-profile-summary", { "id": userId });
				that.$state.go("profile",{"id" : userId});
			}
		}, function(error){
			if(that.LoginService.loginError == "USRNTFND") {
				var showAlert = function(ev) {
			    // Appending dialog to document.body to cover sidenav in docs app
			    // Modal dialogs should fully cover application
			    // to prevent interaction outside of dialog
			    that.$mdDialog.show(
			      that.$mdDialog.alert()
			        .parent(angular.element(document.querySelector('#login')))
			        .clickOutsideToClose(true)
			        .title('User Not Found')
			        .textContent('Seems you have not registered yet')
			        .ariaLabel('Alert Dialog Demo')
			        .ok('Ok')
			        .targetEvent(ev)
			    );
	  			}
	  			showAlert();
			} else {
				var showAlert = function(ev) {
			    // Appending dialog to document.body to cover sidenav in docs app
			    // Modal dialogs should fully cover application
			    // to prevent interaction outside of dialog
			    that.$mdDialog.show(
			      that.$mdDialog.alert()
			        .parent(angular.element(document.querySelector('#login')))
			        .clickOutsideToClose(true)
			        .title('Wrong Password')
			        .textContent('Seems you have entered wrong password')
			        .ariaLabel('Alert Dialog Demo')
			        .ok('Ok')
			        .targetEvent(ev)
			    );
	  			}
	  			showAlert();
			}
			

		});
	}

	navigateToSignup(event){
		if ((event && event.keyCode === 13) || typeof event === 'undefined') {
			var loginType = this.$stateParams.loginType;
			if (loginType === "emp") {
				this.$state.go("user-signup");
			}
			else if (loginType === "doctor") {
				this.$state.go("doctor-signup");
			}
		}		
	}
	checkLogin(data){
	}

}