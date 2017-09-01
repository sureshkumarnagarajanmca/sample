export class UserProfileController{
	public readMode = false;
	public apiHost: string;
	public userSignup = {};
	public imgPath: string;
	public isFileUploaded = false;
	public pwdInputType = "password";
	public userId: string;
	/* @ngInject */
	constructor(public $scope: any, public UserProfileService, 
				public Upload, public hosts, public $state: angular.ui.IStateService,
				public userDetails:any,$stateParams:any) {
		var that = this;
		this.userId = $stateParams.userId;
		this.apiHost = hosts.node.url;
		//this is useful when navigating from signup to profile page..yuk..bad code
		//this.userDetails = this.UserProfileService.userDetails;
		//setting user details to default avatar
		this.imgPath = "/assets/images/profile-place-holder.png";
		if (that.userDetails.hasOwnProperty("imageId") && that.userDetails.imageId !== '') {
			that.imgPath = that.apiHost + "/api/getFile?imageId=" + that.userDetails.imageId;
		}
		//date configuration
		$scope.dateConfig = { 'startView': 'year', 
							  'minView': 'day', 
							  'modelType': 'YYYY-MM-DD' 
							}
		$scope.calendarVisible = false;					
		$scope.toggleCalendar = function(){
			if(that.readMode){	
				if($scope.calendarVisible){
					$scope.calendarVisible = false;
				}
				else{
					$scope.calendarVisible = true;
				}
			}
		}
		$scope.toggleSignupCalendar = function() {
				if ($scope.calendarVisible) {
					$scope.calendarVisible = false;
				}
				else {
					$scope.calendarVisible = true;
				}
		}
		
	}
	setEditMode(){
		this.readMode = true; 
	}
	setReadMode(){
		this.readMode = false;
	}
	setImageChange(){
		this.isFileUploaded = true;
	}
	updateUser(){
		let that = this;
		if (this.isFileUploaded) {
			//upload image and on success update the user details
			this.Upload.upload({
				url: this.apiHost + "/api/fileUpload",
				data: { file: this.imgPath }
			}).then(function(resp) {
				that.userDetails.imageId = resp.data.imageId;
				//updating user image id in user object
				that.UserProfileService.updateUser(that.userId,that.userDetails).then(function(){
					that.readMode = false;
				});
			}, function(resp) {
			}, function(evt) {
				var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
			});
			this.readMode = false;
		}
		else{
			this.UserProfileService.updateUser(this.userDetails).then(function(){
				that.readMode = false;
			});
		}
	}
	printDate(){
	}
}