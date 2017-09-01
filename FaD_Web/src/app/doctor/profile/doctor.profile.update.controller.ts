export class DoctorProfileUpdateController{
	public doctor: any;
	public profileInfoClone: any;
	private isFileUploaded = false;
	public apiHost: string;

	 
	/* @ngInject */
	constructor(public $scope: angular.IScope, 
				public $uibModal: any, 
				public $log: any, 
				public DoctorProfileService:any, 
				public DoctorProfileFactory:any,
				public toastr: any,
				public CacheFactory:any, 
				public base64: any, 
				public $mdDialog: any,
				public $state: angular.ui.IStateService,
				public hosts, public Upload) {
		this.profileInfoClone = {};
		this.apiHost = hosts.node.url;
		this.DoctorProfileService.querySpecialities();
		this.DoctorProfileService.querySubSpecialities();
		
		let loginCache = CacheFactory.get('loginDetails');
		if(loginCache.get('authObj')){
			let authObj = loginCache.get('authObj');
			let userData = authObj.accessToken.split(".");
			let userId = JSON.parse(base64.urldecode(userData[1])).id;
			this.DoctorProfileService.queryDoctor(userId);
		}		
		
		this.genderMap = {M : "Male",F : "Female"}
		this.activate();
		this.selectedImagePath = {}

		$scope.limit = 10;

	$(function() {
	    $('#names').on('keypress', function(e) {
	        if (e.which == 32)
	            return false;
	    });
	});

		angular.copy(DoctorProfileFactory.originalDocObj,DoctorProfileFactory.stagedDocObj)
		$scope.gender = ['M','F','D'];
		$scope.selectedGender = "Gender";
		$scope.dropdowngenderselected = function (item) {
			$scope.selectedGender = item;
		};
	}
	showAdvanced() {
		let that = this;
    	this.$mdDialog.show({
      		templateUrl: 'message-modal.html',
      		controller: 'MessageModalController',
			controllerAs : 'Message',
      		parent: angular.element(document.body),
      		clickOutsideToClose:true,
      		// fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    	})
    	.then(function() {
      		// $scope.status = 'You said the information was "' + answer + '".';
    	}, function() {
      		// that.cancel();
    	});
  	};
  	// cancel() {
  	// 	this.$mdDialog.hide();
  	// }
	showMore() {
		if(this.$scope.limit == (this.DoctorProfileFactory.originalDocObj.insuranceIds).length) {
			this.$scope.limit = 10;
			document.getElementById("showLess").innerHTML = "more";
		} 
		else {
			this.$scope.limit = (this.DoctorProfileFactory.originalDocObj.insuranceIds).length;
			document.getElementById("showLess").innerHTML = "less";
		}
	}
	activate(){
		// getImage
		let that = this;
		if(!this.DoctorProfileFactory.originalDocObj.imgPath){
			this.imgPath = "/assets/images/profile-place-holder.png";
			that.selectedImagePath	= this.imgPath;	
		}else{
			this.imgPath = this.apiHost + "/api/getFile?imageId=" + this.DoctorProfileFactory.originalDocObj.imageId;
		}
	}

	//detect if image is uploaded
	setImageChange() {
		let that = this;
		if(this.imgPath == null){
			 this.imgPath = that.selectedImagePath ;
		} else {
			that.selectedImagePath = this.imgPath;
		}
		this.isFileUploaded = true;
	}

	checValidation(){
		if(this.checkTaxonomy() && this.checkInsurance() && this.checkPL() && this.checkGender() && this.checkName()){
			return false;
		}else{
			return true;
		}
	};

	checkTaxonomy(){
		let flag = false;
		this.DoctorProfileFactory.originalDocObj.taxonomy.forEach(function(element){
			if(element.level === '2'){
				flag = true;
			}
		})
		return flag;
	}

	checkPL(){
		if(this.DoctorProfileFactory.originalDocObj.otherAddress.length > 0){
			return true;
		}else{
			return false;
		}
	}

	checkInsurance(){
		if(this.DoctorProfileFactory.originalDocObj.insuranceIds.length > 0){
			return true;
		}else{
			return false;
		}
	}

	checkGender(){
		if(!!this.DoctorProfileFactory.stagedDocObj.gender || !!this.DoctorProfileFactory.originalDocObj.gender){
			return true;
		}else{
			return false;
		}
	}
	checkName(){
		if((!!this.DoctorProfileFactory.stagedDocObj.lName && !!this.DoctorProfileFactory.stagedDocObj.fName) || (!!this.DoctorProfileFactory.originalDocObj.lName && !!this.DoctorProfileFactory.originalDocObj.fName)){
			return true;
		}else{
			return false;
		}
	}

	genderSelectTrigger(gender){
		if (!!gender) {
			this.gender = gender;
			this.DoctorProfileFactory.stagedDocObj.gender = gender;
		}
	}

	removeSpeciality(speciality){
			let originalObj = this.DoctorProfileFactory.originalDocObj;
			if(speciality.level === '2'){
				originalObj.pSubSpeciality = originalObj.pSubSpeciality.filter(function(tax){
					if(tax.parent !== speciality._id){
						return tax;
					}
				});
			}
			//removing speciality from the orginal object, this resulsts in proper rendering of the speciality
			let index = originalObj.taxonomy.indexOf(speciality);
			originalObj.taxonomy.splice(index, 1);
			//removing speciality from the staged object, this results in object to be save properly for the purpose of  update
			let stageIndex = stageObj.taxonomy.indexOf(speciality);
			stageObj.taxonomy.splice(stageIndex, 1);
	};
	removeSubSpeciality(code){
		var that = this;
		let originalObj = this.DoctorProfileFactory.originalDocObj;
		let stageObj = this.DoctorProfileFactory.stagedDocObj;
		let index = this.DoctorProfileFactory.originalDocObj.pSubSpeciality.indexOf(code);
		if(index !== -1){
			this.DoctorProfileFactory.originalDocObj.pSubSpeciality.splice(index,1);
		}
		that.profileProgress = that.percentage(that.docObj);
	}
	removePracticeLocation(location){
		var that = this;
		this.DoctorProfileFactory.originalDocObj.otherAddress.forEach(function(element,index){
			if(angular.equals(location,element)){
				that.DoctorProfileFactory.originalDocObj.otherAddress.splice(index,1);
				that.DoctorProfileFactory.stagedDocObj.otherAddress.splice(index,1);
			}
		});
	}

	openSpecialityModal() {
		let that = this;
		let modalInstance = this.$uibModal.open({
			animation: this.$scope.animationsEnabled,
			templateUrl: 'speciality-modal.html',
			controller: 'SpecialityModalController',
			controllerAs : "SpecialityModal"
			size:'lg',
			resolve: {
				items: function() {
					return that.DoctorProfileFactory.specialities;
				}
			}
		});
		modalInstance.result.then(function(selectedItems) {
			// that.$scope.selected = selectedItem;
			
		}, function() {
			that.$log.info('Modal dismissed at: ' + new Date());
		});
	}

	openSubSpecialityModal() {
		let that = this;
		let modalInstance = this.$uibModal.open({
			animation: this.$scope.animationsEnabled,
			templateUrl: 'sub-speciality-modal.html',
			controller: 'SpecialityModalController',
			controllerAs : "SpecialityModal"
			size: 'lg',
			resolve: {
				items: function() {
					return that.DoctorProfileFactory.subSpecialities;
				}
			}
		});
		modalInstance.result.then(function(selectedItem) {
			that.$scope.selected = selectedItem;
		}, function() {
			that.$log.info('Modal dismissed at: ' + new Date());
		});
	}

	openPracticeLocationModal(){
		let that = this;
		let modalInstance = this.$uibModal.open({
			animation: this.$scope.animationsEnabled,
			// templateUrl: '/app/components/modals/practice-location/practice-location-modal.html',
			templateUrl: 'practice-location-modal.html',
			controller: 'PracticeLocationModalController',
			size: 'lg'
			/*resolve: {
				items: function() {
					return that.DoctorProfileService.specialities;
				}
			}*/
		});
		modalInstance.result.then(function(selectedItem) {
			that.$scope.selected = selectedItem;
		}, function() {
			that.$log.info('Modal dismissed at: ' + new Date());
		});
	}

	openHospitalAffiliationModal(){
		let that = this;
		let modalInstance = this.$uibModal.open({
			animation: this.$scope.animationsEnabled,
			templateUrl: 'hospital-affiliation-modal.html',
			controller: 'HospitalAffiliationModController',
			controllerAs : 'hospitalAff',
			size: 'lg',
			resolve: {
				// docObj: this.docObj
			}
		});
		modalInstance.result.then(function(selectedItem) {
			that.$scope.selected = selectedItem;
		}, function() {
			that.$log.info('Modal dismissed at: ' + new Date());
		});
	}

	removeHospitalAffiliation(hospital){
		var that = this;
		this.DoctorProfileFactory.originalDocObj.hospitalAffillation.forEach(function(element,index){
			if(hospital.hospitalId === element.hospitalId){
				that.DoctorProfileFactory.originalDocObj.hospitalAffillation.splice(index,1);
				that.DoctorProfileFactory.stagedDocObj.hospitalAffillation.splice(index,1);
			}
		});
	}


	openInsurancesModal(){
		let that = this;
		let modalInstance = this.$uibModal.open({
			animation: this.$scope.animationsEnabled,
			templateUrl: 'insurances-modal.html',
			controller: 'InsurancesModalController',
			controllerAs : 'Insurance',
			size: 'lg',
			resolve: {
				// docObj: this.docObj
			}
		});
	}

	removeInsurance(insurance){
		var that = this;
		this.DoctorProfileFactory.originalDocObj.insuranceIds.forEach(function(element,index){
			if(insurance._id === element._id){
				that.DoctorProfileFactory.originalDocObj.insuranceIds.splice(index,1);
				that.DoctorProfileFactory.stagedDocObj.insuranceIds.splice(index,1);
			}
		});
	}

	  openMessageControl(){
		let that = this;
		let modalInstance = this.$uibModal.open({
			animation: this.$scope.animationsEnabled,
			templateUrl: 'message-modal.html',
			controller: 'MessageModalController',
			controllerAs : 'Message',
			size: 'lg',
			resolve: {
				// docObj: this.docObj
			}
		});
	}

}