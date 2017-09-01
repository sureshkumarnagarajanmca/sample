export class UserSignupController{
	public readMode = false;
	public apiHost: string;
	public userDetails = {};
	public pwdInputType = "password";
	public imgPath: string;
	/* @ngInject */
	constructor(public $scope: any, public UserProfileService, 
		public Upload, public hosts, public $state: angular.ui.IStateService,public CacheFactory:any) {
		var that = this;
		this.apiHost = hosts.node.url;
	}
	registerUser() {
		var that = this;
		this.UserProfileService.createUser(this.userDetails).then(function(data) {
			//Getting user details
			var userId = data.userId;
			var loginCache = that.CacheFactory.get('loginDetails');
			loginCache.put('authObj', data);
			that.$state.go("user-profile",{"userId":data.userId});
		});
	}
}