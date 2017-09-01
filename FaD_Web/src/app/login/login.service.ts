export class LoginService {
	public apiHost: string;
	public userId: string;
	public password: string;
	/** @ngInject */
	constructor(private $log: angular.ILogService, private $http: angular.IHttpService, private hosts: any, public DoctorProfileFactory
		: any, private CacheFactory: any, public $state: angular.ui.IStateService, public errorHandling: any) {
		
		this.apiHost = hosts.node.url;
		// this.loginError = "";
	}
	getUser(params: any): angular.IPromise<any[]> {
		var that = this;
		return this.$http.get(this.apiHost + '/api/user/verifylogin', {
			"params": params
		}).then((response: any): any => {
				that.userId = response.data.userId;
				return response.data;
			})
			.catch((error: any): any => {
				this.$log.error('Failed to get userid for the username\n', error.data);
			});
	}
	forgotPassword(params: any): angular.IPromise<any[]> {
		var that = this;
		var req = {
		 method: 'POST',
		 url: this.apiHost + '/api/user/forgotPassword',
		 headers: {
		   'accessToken': that.accessToken
		 },
		 data: params
		}
		return this.$http(req).then((response: any): any => {
			that.userId = response.data.userId;
			return response.data;
		})
		.catch((error: any): any => {
			throw this.errorHandling.otpError(error.data.errCode);
		});
	}

	login(params: any): angular.IPromise<any[]> {
		var that = this;
		params.username = params.username.toLowerCase();
		return this.$http.post(this.apiHost + '/api/user/login',
			params).then((response: any): any => {
				that.userId = response.data.userId;
				return response.data;
			})
			.catch((error: any): any => {
	        // return error.data;
	        // if(error.data.hasOwnProperty("errorCode")){
	          that.loginError = error.data.errCode;
	          throw this.errorHandling.signInErrorHandler(error.data.errCode);
	        // }
	        this.$log.error('Failed to signup\n', error.data);
	      }); 
	}

	logout(params: any): angular.IPromise<any[]> {
		var payload = {userId : params};
		var loginCache = this.CacheFactory.get('loginDetails');
		if(loginCache.get('authObj')){
			var that = this;
			return this.$http.post(this.apiHost + '/api/user/logout',
			payload).then((response: any): any => {
				loginCache.remove('authObj');
				this.$state.go('list-practice');
				return response.data;
			})
			.catch((error: any): any => {
				this.$log.error('logout failed Please try again\n', error.data);
			});
		}else{
			this.$state.go('list-practice');
		}
	}

	sendOTP(params: any): angular.IPromise<any[]> {
		var that = this;
		return this.$http.get(this.apiHost + '/api/user/verifylogin', {
			"params": params
		}).then((response: any): any => {
				return response.data;
			})
			.catch((error: any): any => {
				throw this.errorHandling.otpError(error.data.errCode);
			});
	}

	verifyOTP(params: any): angular.IPromise<any[]> {
		var that = this;
		return this.$http.post(this.apiHost + '/api/user/verifyOtp',
			params).then((response: any): any => {
				return response.data;
			})
			.catch((error: any): any => {
				throw this.errorHandling.otpError(error.data.errCode);
				// this.$log.error('OTP verification failed\n', error.data);
			});
	}	

	refreshToken(params: any): angular.IPromise<any[]> {
		var that = this;
		return this.$http.post(this.apiHost + '/api/user/validateToken',
			params).then((response: any): any => {
				return response.data;
			})
			.catch((error: any): any => {
				this.$log.error('Failed to fetch password\n', error.data);
			});
	}
}