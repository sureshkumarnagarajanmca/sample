export class DoctorAdvancedProfileController{
	private docObj: any;
	private docUserId: string;
	public apiHost: string;
	private reasonForVisit: string;
	private medSchool: string;
	private award: string;
	private navBarCss: any;
	private profileProgress: number;
	private boardCertification: any;
	private imgPath: any;
	private isFileUploaded = false;
	
	//Initializing the object
	/* @ngInject */
	constructor(public $rootScope, public $scope: any, 
				public $state: angular.ui.IStateService, 
				public DoctorService:any,
				public $uibModal: any,
				public $mdDialog: any,
				public $stateParams: any,
				SpecialityService: any,
				private LoginService:any,
				public Upload, public hosts) {
		var that = this;
		this.reasonForVisit = "";
        this.apiHost = hosts.node.url;
        let userId = this.$stateParams.id;
        this.primLocation = false;
        this.otherLocation = true;
        this.selectedImagePath = {};
        
		DoctorService.getDoctor(userId).then(function(data){
			let targetObj = {};
			angular.copy(data, targetObj);
			that.docObj = targetObj;
			that.docUserId = data.userId;
			that.profileProgress =  that.percentage(targetObj);	
			for (var i = 0; i < targetObj.certifications.length ; i++) {
				if(targetObj.certifications[i].dateInMonths % 12 === 0) {
					targetObj.certifications[i].yearOfCert = parseInt((targetObj.certifications[i].dateInMonths / 12)-1);
					targetObj.certifications[i].monthOfCert = 12;
				} else {
					targetObj.certifications[i].yearOfCert = parseInt(targetObj.certifications[i].dateInMonths / 12);
					targetObj.certifications[i].monthOfCert = targetObj.certifications[i].dateInMonths % 12;
				}
				
				switch (!!targetObj.certifications[i].monthOfCert) {
					case targetObj.certifications[i].monthOfCert === 12:
						targetObj.certifications[i].monthOfCert = "December"
						break;
					case targetObj.certifications[i].monthOfCert === 1:
						targetObj.certifications[i].monthOfCert = "January"
						break;
					case targetObj.certifications[i].monthOfCert === 2:
						targetObj.certifications[i].monthOfCert = "February"
						break;
					case targetObj.certifications[i].monthOfCert === 3:
						targetObj.certifications[i].monthOfCert = "March"
						break;
					case targetObj.certifications[i].monthOfCert === 4:
						targetObj.certifications[i].monthOfCert = "April"
						break;
					case targetObj.certifications[i].monthOfCert === 5:
						targetObj.certifications[i].monthOfCert = "May"
						break;
					case targetObj.certifications[i].monthOfCert === 6:
						targetObj.certifications[i].monthOfCert = "June"
						break;
					case targetObj.certifications[i].monthOfCert === 7:
						targetObj.certifications[i].monthOfCert = "July"
						break;
					case targetObj.certifications[i].monthOfCert === 8:
						targetObj.certifications[i].monthOfCert = "August"
						break;
					case targetObj.certifications[i].monthOfCert === 9:
						targetObj.certifications[i].monthOfCert = "September"
						break;
					case targetObj.certifications[i].monthOfCert === 10:
						targetObj.certifications[i].monthOfCert = "October"
						break;
					case targetObj.certifications[i].monthOfCert === 11:
						targetObj.certifications[i].monthOfCert = "November"
						break;

				}
			}
			that.checkLocation();
			if(that.docObj.hasOwnProperty("imageId") && that.docObj.imageId !== '')
			{
				that.imgPath = that.apiHost + "/api/getFile?imageId=" + that.docObj.imageId;
			}
		});
		$scope.$watch('searchResults.sliderValue', function(distance) {
			that.SearchService.sliderValue = distance;
			
			that.triggerSearch("radius", distance + "mi");
		});
		

		//initializing navbar css
		this.navBarCss = {};
		this.navBarHighlighter();
		//initializint progress bar
		// this.profileProgress = 25;

		//initializing board certification
		this.boardCertification = {
			certficationName:"",
			specialities:[]
		}


		//image path
		this.imgPath = "/assets/images/profile-place-holder.png";

		// if($state.current.name === 'doctor-profile-main.basic-info'){
		// 	that.navBarCss.basicInfo = "doc-advance-profile-nav-highlight";
		// 	that.profileProgress = 25;			
		// }else if($state.current.name === 'doctor-profile-main.practice-info'){
		// 	that.navBarCss.practiceInfo = "doc-advance-profile-nav-highlight";
		// 	that.profileProgress = 50;			
		// }else if($state.current.name === 'doctor-profile-main.insurances'){
		// 	that.navBarCss.insurances = "doc-advance-profile-nav-highlight";			
		// 	that.profileProgress = 75;
		// }else if($state.current.name === 'doctor-profile-main.education'){
		// 	that.navBarCss.education = "doc-advance-profile-nav-highlight";			
		// 	that.profileProgress = 100;
		// }

		// this.apiHost = hosts.node.url;
		//intializing the progress bar and side navigation considering the default page as basic info

		if(this.$state.current.name == "doctor-profile-main.basic-info"){
		that.navBarCss.basicInfo = "doc-advance-profile-nav-highlight";
		}else if(this.$state.current.name == "doctor-profile-main.practice-info") {
		that.navBarCss.practiceInfo = "doc-advance-profile-nav-highlight";
		}else if(this.$state.current.name == "doctor-profile-main.insurances") {
		that.navBarCss.insurances = "doc-advance-profile-nav-highlight";
		}else {
		that.navBarCss.education = "doc-advance-profile-nav-highlight";
		}

		// that.navBarCss.basicInfo = "doc-advance-profile-nav-highlight";
		that.profileProgress = 0;
		// $state.go('doctor-profile-main.basic-info')
	}

	//method helps in movement between profile pages
	navigateToPrac(state){
		let that = this;
		if(this.docObj.taxonomy.length > 0) {
			this.$state.go(state);
			this.navBarCss.basicInfo = null;
			this.navBarCss.practiceInfo = "doc-advance-profile-nav-highlight";
			// that.saveDoctorOnNext();
		} else {
			var showAlert = function(ev) {
		    // Appending dialog to document.body to cover sidenav in docs app
		    // Modal dialogs should fully cover application
		    // to prevent interaction outside of dialog
		    that.$mdDialog.show(
		      that.$mdDialog.alert()
		        .parent(angular.element(document.querySelector('#main')))
		        .clickOutsideToClose(true)
		        .title('No specialty added')
		        .textContent('At least one specialty should be added')
		        .ariaLabel('Alert Dialog Demo')
		        .ok('Ok')
		        .targetEvent(ev)
		    );
  			}
  			showAlert();
		}
	}
	checkLocation(){
		let that = this;
		this.primLocation = false;
		this.otherLocation = false;
    	this.docObj.otherAddress.forEach(function(element,index){
        	switch (!!element) {
			case element.isPrimary == true:
				that.primLocation = true
				break;
			case element.isPrimary == false:
				that.otherLocation = true
				break;
			}
        });
        if(this.primLocation == false) {
    		$("#prim-location").css("display", "none");
        } else {
    		$("#prim-location").css("display", "block");
        }
        if(this.otherLocation == false) {
    		$("#other-location").css("display", "none");
        } else {
    		$("#other-location").css("display", "block");
        }
    };
	navigateToIns(state){
		let that = this;
		if(this.docObj.otherAddress.length > 0) {
			this.$state.go(state);
			this.navBarCss.basicInfo = null;
			this.navBarCss.practiceInfo = "doc-advance-profile-nav-highlight";
			// that.saveDoctorOnNext();
		} else {
			var showAlert = function(ev) {
		    // Appending dialog to document.body to cover sidenav in docs app
		    // Modal dialogs should fully cover application
		    // to prevent interaction outside of dialog
		    that.$mdDialog.show(
		      that.$mdDialog.alert()
		        .parent(angular.element(document.querySelector('#main')))
		        .clickOutsideToClose(true)
		        .title('No practice location added')
		        .textContent('At least one practice location should be added')
		        .ariaLabel('Alert Dialog Demo')
		        .ok('Ok')
		        .targetEvent(ev)
		    );
  			}
  			showAlert();
		}
	}

	navigateToEdu(state){
		let that = this;
		if(this.docObj.insuranceIds.length > 0) {
			this.$state.go(state);
			this.navBarCss.basicInfo = null;
			this.navBarCss.practiceInfo = "doc-advance-profile-nav-highlight";
			// that.saveDoctorOnNext();
		} else {
			var showAlert = function(ev) {
		    // Appending dialog to document.body to cover sidenav in docs app
		    // Modal dialogs should fully cover application
		    // to prevent interaction outside of dialog
		    that.$mdDialog.show(
		      that.$mdDialog.alert()
		        .parent(angular.element(document.querySelector('#main')))
		        .clickOutsideToClose(true)
		        .title('No Insurances added')
		        .textContent('At least one insurance should be added')
		        .ariaLabel('Alert Dialog Demo')
		        .ok('Ok')
		        .targetEvent(ev)
		    );
  			}
  			showAlert();
		}
	}

	navigateTo(state){
		let that = this;
		if(this.$state.current.name === 'doctor-profile-main.basic-info') {
			if(this.docObj.taxonomy.length > 0) {
			this.$state.go(state);
			this.navBarCss.basicInfo = null;
			this.navBarCss.basicInfo = "doc-advance-profile-nav-highlight";
			} else {
				var showAlert = function(ev) {
			    // Appending dialog to document.body to cover sidenav in docs app
			    // Modal dialogs should fully cover application
			    // to prevent interaction outside of dialog
			    that.$mdDialog.show(
			      that.$mdDialog.alert()
			        .parent(angular.element(document.querySelector('#main')))
			        .clickOutsideToClose(true)
			        .title('No specialty added')
			        .textContent('At least one specialty should be added')
			        .ariaLabel('Alert Dialog Demo')
			        .ok('Ok')
			        .targetEvent(ev)
			    );
	  			}
	  			showAlert();
			}
		}
		if(this.$state.current.name === 'doctor-profile-main.insurances') {
			if(this.docObj.insuranceIds.length > 0) {
			this.$state.go(state);
			this.navBarCss.basicInfo = null;
			this.navBarCss.insurances = "doc-advance-profile-nav-highlight";
			} else {
				var showAlert = function(ev) {
			    // Appending dialog to document.body to cover sidenav in docs app
			    // Modal dialogs should fully cover application
			    // to prevent interaction outside of dialog
			    that.$mdDialog.show(
			      that.$mdDialog.alert()
			        .parent(angular.element(document.querySelector('#main')))
			        .clickOutsideToClose(true)
			        .title('No Insurances added')
			        .textContent('At least one insurance should be added')
			        .ariaLabel('Alert Dialog Demo')
			        .ok('Ok')
			        .targetEvent(ev)
			    );
	  			}
	  			showAlert();
			}
		}
		if(this.$state.current.name === 'doctor-profile-main.practice-info') {
			if(this.docObj.otherAddress.length > 0) {
			this.$state.go(state);
			this.navBarCss.basicInfo = null;
			this.navBarCss.practiceInfo = "doc-advance-profile-nav-highlight";
			} else {
				var showAlert = function(ev) {
			    // Appending dialog to document.body to cover sidenav in docs app
			    // Modal dialogs should fully cover application
			    // to prevent interaction outside of dialog
			    that.$mdDialog.show(
			      that.$mdDialog.alert()
			        .parent(angular.element(document.querySelector('#main')))
			        .clickOutsideToClose(true)
			        .title('No practice location added')
			        .textContent('At least one practice location should be added')
			        .ariaLabel('Alert Dialog Demo')
			        .ok('Ok')
			        .targetEvent(ev)
			    );
	  			}
	  			showAlert();
			}
		}
		if(this.$state.current.name === 'doctor-profile-main.education') {
			if(this.docObj.otherAddress.length > 0) {
			this.$state.go(state);
			this.navBarCss.basicInfo = null;
			this.navBarCss.education = "doc-advance-profile-nav-highlight";
			}
		}
	}

	//opening speciality modal to add new speciality

	openSpecialityModal() {
		let that = this;
		
		let modalInstance = this.$uibModal.open({
			animation: this.$scope.animationsEnabled,
			templateUrl: 'specialty-modal.html',
			controller: 'SpecialityModalCmpController',
			controllerAs: 'SpecialtyModCmCont'
			size: 'lg',
			resolve: {
				docObj: this.docObj
			}
		});
		modalInstance.result.then(function(selectedItem) {
			that.profileProgress = that.percentage(that.docObj);

		}, function() {
			that.$log.info('Modal dismissed at: ' + new Date());
		});

	}

	//opening sub-speciality-model
	// openSubSpecialityModal() {
	// 	let that = this;
		
	// 	let modalInstance = this.$uibModal.open({
	// 		animation: this.$scope.animationsEnabled,
	// 		templateUrl: '/app/components/modals/specialities/sub-speciality-modal.html',
	// 		controller: 'SpecialityModalCmpController',
	// 		size: 'lg',
	// 		resolve: {
	// 			docObj: this.docObj
	// 		}
	// 	});
	// 	modalInstance.result.then(function(selectedItem) {
	// 		// that.$scope.selected = selectedItem;
	// 	}, function() {
	// 		that.$log.info('Modal dismissed at: ' + new Date());
	// 	});
	// }

	//opening language modal controller to add new languages
	openLanguageModal(){
		let that = this;

		let modalInstance = this.$uibModal.open({
			animation: this.$scope.animationsEnabled,
			templateUrl: 'languages-modal.html',
			controller: 'LanguageModalCmpController',
			size: 'lg',
			resolve: {
				docObj: this.docObj
			}
		});
		modalInstance.result.then(function(selectedItem) {
			that.profileProgress = that.percentage(that.docObj);

		}, function() {
			that.$log.info('Modal dismissed at: ' + new Date());
		});

	}
	removeLanguageSpoken($index){
		var that = this;
		this.docObj.languagesSpoken.splice($index,1);
		that.profileProgress = that.percentage(that.docObj);
	}

	openCertificationModal(){
		let that = this;
		let modalInstance = this.$uibModal.open({
			animation: this.$scope.animationsEnabled,
			templateUrl: 'certification-modal.html',
			controller: 'CertificationsModalCmpController',
			size: 'lg',
			resolve: {
				docObj: this.docObj
			}
		});
		modalInstance.result.then(function(selectedItem) {
			that.profileProgress = that.percentage(that.docObj);

		}, function() {
			that.$log.info('Modal dismissed at: ' + new Date());
		});

	}

	removeCertification($index){
		var that = this;
		this.docObj.certifications.splice($index,1);
		that.profileProgress = that.percentage(that.docObj);
	}

	//opening practice locaiton modal
	openPracticeLocationModal(){
		let that = this;
		let modalInstance = this.$uibModal.open({
			animation: this.$scope.animationsEnabled,
			templateUrl: 'practice-location-modal.html',
			controller: 'PracticeLocationModalCmpController',
			size: 'lg',
			resolve: {
				docObj: this.docObj
			}
		});
		modalInstance.result.then(function(selectedItem) {
			that.profileProgress = that.percentage(that.docObj);

		}, function() {
			that.$log.info('Modal dismissed at: ' + new Date());
		});

	}
	openMedicalSchoolModal(){
		let that = this;
		let modalInstance = this.$uibModal.open({
			animation: this.$scope.animationsEnabled,
			templateUrl: 'medical-school-modal.html',
			controller: 'MedicalSchoolModalCmpController',
			controllerAs: 'MedSchoolModCon',
			size: 'lg',
			resolve: {
				docObj: this.docObj
			}
		});
		modalInstance.result.then(function(selectedItem) {
			that.profileProgress = that.percentage(that.docObj);

		}, function() {
			that.$log.info('Modal dismissed at: ' + new Date());
		});

	}
	removeMedicalSchool($index){
		var that = this;
		this.docObj.medicalSchoolName.splice($index,1);
		that.profileProgress = that.percentage(that.docObj);
	}
	openHospitalAffiliationModal(){
		let that = this;
		let modalInstance = this.$uibModal.open({
			animation: this.$scope.animationsEnabled,
			templateUrl: 'hospital-affiliation-modal.html',
			controller: 'HospitalAffiliationModalCmpController',
			size: 'lg',
			resolve: {
				docObj: this.docObj
			}
		});
		modalInstance.result.then(function(selectedItem) {
			that.profileProgress = that.percentage(that.docObj);

		}, function() {
			that.$log.info('Modal dismissed at: ' + new Date());
		});

	}


	removeHospitalAffiliation($index){
		var that = this;
		this.docObj.hospitalAffillation.splice($index,1);
		that.profileProgress = that.percentage(that.docObj);
	}

	// insurances modal
	openInsurancesModal(){
		let that = this;
		let modalInstance = this.$uibModal.open({
			animation: this.$scope.animationsEnabled,
			templateUrl: 'insurances-modal.html',
			controller: 'InsurancesModalCmpController',
			controllerAs: 'Insurance',
			size: 'lg',
			resolve: {
				docObj: this.docObj
			}
		});
		modalInstance.result.then(function(selectedItem) {
			that.profileProgress = that.percentage(that.docObj);

		}, function() {
			that.$log.info('Modal dismissed at: ' + new Date());
		});

	}


	removeInsurances($index){
		var that = this;
		this.docObj.insuranceIds.splice($index,1);
		that.profileProgress = that.percentage(that.docObj);
	}


	//Removing speciality
	removeSpeciality(code){
		var that = this;
		let index = this.docObj.taxonomy.indexOf(code);
		if(code.level === '2'){
			this.docObj.pSubSpeciality = this.docObj.pSubSpeciality.filter(function(tax){
				if(tax.parent !== code._id){
					return tax;
				}
			});
		}
		if(index !== -1){
			this.docObj.taxonomy.splice(index,1);
		}
		that.profileProgress = that.percentage(that.docObj);
	}
	removeSubSpeciality(code){
		var that = this;
		let index = this.docObj.pSubSpeciality.indexOf(code);
		if(index !== -1){
			this.docObj.pSubSpeciality.splice(index,1);
		}
		that.profileProgress = that.percentage(that.docObj);
	}
	//Remove practice location
	removePracticeLocation($index){
		var that = this;
		this.docObj.otherAddress.splice($index,1);
		// this.docObj.practiceLocationAddress.some(function(element,index){
		// 	if(element['_id'] === id){
		// 		that.docObj.practiceLocationAddress.splice(index,1);
		// 		return true;
		// 	}
		// });
		that.profileProgress = that.percentage(that.docObj);
		this.checkLocation();
	}

	percentage(docObj) {
		// ÷eturn ;
		var percentageScore = 0;

		if (!!docObj.updateDate){
				percentageScore = percentageScore + 25;
		}
		
		if (!!docObj.insuranceIds){
			if(Array.isArray(docObj.insuranceIds)){
				if(docObj.insuranceIds.length > 0){
					percentageScore = percentageScore + 10;
				}
			}
		}
		if (!!docObj.certifications){
			if(Array.isArray(docObj.certifications)){
				if(docObj.certifications.length > 0){
					percentageScore = percentageScore + 10;
				}
			}
		}
		if (!!docObj.hospitalAffillation){
			if(Array.isArray(docObj.hospitalAffillation)){
				if(docObj.hospitalAffillation.length > 0){
					percentageScore = percentageScore + 10;
				}
			}
		}
		if (!!docObj.taxonomy){
			if(Array.isArray(docObj.taxonomy)){
				let flag = false;
				docObj.taxonomy.filter(function(elem){
					if(elem.level === '2' || elem.level === '3'){
						flag = true;
					}
				});
				if(flag){
					percentageScore = percentageScore + 10;					
				}
				// if(docObj.taxonomy.length > 0){
					// percentageScore = percentageScore + 10;
				// }
			}
		}
		if (!!docObj.languagesSpoken){
			if(Array.isArray(docObj.languagesSpoken)){
				if(docObj.languagesSpoken.length > 0){
					percentageScore = percentageScore + 10;
				}
			}
		}
		if (!!docObj.medicalSchoolName){
			if(Array.isArray(docObj.medicalSchoolName)){
				if(docObj.medicalSchoolName.length > 0){
					percentageScore = percentageScore + 10;
				}
			}
		}
		if (!!docObj.otherAddress){
			if(Array.isArray(docObj.otherAddress)){
				if(docObj.otherAddress.length > 0){
					percentageScore = percentageScore + 10;
				}
			}
		}
		if (!!docObj.briefIntro){
				percentageScore = percentageScore + 5;
		}
		

		return percentageScore;
	}

	//add reason for visit
	addReasonForVist(reason){
		if (!reason) {
			return;
		}
		if (this.docObj.reasons.indexOf(reason) === -1) {
			this.docObj.reasons.push(reason);
		}
		this.reasonForVisit = "";
		that.profileProgress = that.percentage(that.docObj);

	}

	//remove reason for visit
	removeReason(reason){
		let index = this.docObj.reasons.indexOf(reason);
		if (index !== -1) {
			this.docObj.reasons.splice(index, 1);
		}
		that.profileProgress = that.percentage(that.docObj);

	}

	//add med school
	addMedSchool(school){
		var that = this;
		if(!school){
			return;
			if(!school.courseName){
				return
			}
		}
		let matchFound = false;
		this.docObj.medicalSchoolName.some(function(element, index) {
			if(element.collegeName === school.collegeName && element.courseName === school.courseName){
				matchFound = true;
				return false;
			}
		});
		if(!matchFound){
			this.docObj.medicalSchoolName.push(school);
		}
		this.medSchool = {};
		that.profileProgress = that.percentage(that.docObj);

		modalInstance.result.then(function(selectedItem) {
			that.profileProgress = that.percentage(that.docObj);

		}, function() {
			that.$log.info('Modal dismissed at: ' + new Date());
		});
		that.profileProgress = that.percentage(that.docObj);

	}

	//remove med school
	removeMedSchool(index) {
		var that = this;
		that.docObj.medicalSchoolName.splice(index,1);
		// this.docObj.medicalSchoolName.some(function(element, $index) {
		// 	if (element.collegeName === index) {
		// 		that.docObj.medicalSchoolName.splice(index,1);
		// 		return false;
		// 	}
		// });
		that.profileProgress = that.percentage(that.docObj);
	}

	//add awards and accolades
	addAwards(award) {
		var that = this;
		if (!award) {
			return;
		}
		if (this.docObj.awardsAndAccolades.indexOf(award) === -1) {
			this.docObj.awardsAndAccolades.push(award);
		}
		this.award = "";
		that.profileProgress = that.percentage(that.docObj);

	}
	checkBreifIntro() {
		this.profileProgress = this.percentage(this.docObj);
	}
	//remove Awards
	removeAwards(award){
		let index = this.docObj.awardsAndAccolades.indexOf(award);
		if (index !== -1) {
			this.docObj.awardsAndAccolades.splice(index, 1);
		}
		that.profileProgress = that.percentage(that.docObj);

	}

	//add board certification
	addBoardCertification(certificate){
		var that = this;
		if (certificate.certficationName == '') {
			return;
		}
		
		let matchFound = false;
		this.docObj.certifications.some(function(element, index) {
			if (element.certificationName === certificate.certficationName) {
				matchFound = true;
				return false;
			}
		});
		if (!matchFound) {
			let targetObj = {}; 
			angular.copy(certificate, targetObj);
			targetObj.specialities = [];//temp code
			this.docObj.certifications.push(targetObj);
		}
		this.boardCertification = null;
		that.profileProgress = that.percentage(that.docObj);

	}

	//remove board certification
	removeBoardCertification(certificateName){
		var that = this;
		this.docObj.certifications.some(function(element, index) {
			if (element.certficationName === certificateName) {
				that.docObj.certifications.splice(index, 1);
				return false;
			}
		});
		that.profileProgress = that.percentage(that.docObj);

	}

	//save doctor details
	saveDoctor(){
		var that = this;
		if(this.$state.current.name === 'doctor-profile-main.basic-info') {
			if(this.docObj.taxonomy.length > 0) {
				//deleting _id as it is not accepted in backend
				delete this.docObj["_id"];
				let that = this;
				if (this.isFileUploaded) {
					//upload image and on success update the user details
					this.Upload.upload({
						url: this.apiHost + "/api/fileUpload",
						data: { file: this.imgPath }
					}).then(function(resp) {
						that.docObj.imageId = resp.data.imageId;
						//updating user image id in user object
						that.DoctorService.updateDoctor(that.docUserId, that.docObj).then(function(data) {
							that.$state.go("doctor-profile-summary", { "id": that.docUserId });
						});
					}, function(resp) {
					}, function(evt) {
						var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					});
				}
				else {
					this.DoctorService.updateDoctor(this.docUserId, this.docObj).then(function(data) {
						that.$state.go("doctor-profile-summary", { "id": that.docUserId });
					});
				}
			} else {
				var showAlert = function(ev) {
			    // Appending dialog to document.body to cover sidenav in docs app
			    // Modal dialogs should fully cover application
			    // to prevent interaction outside of dialog
			    that.$mdDialog.show(
			      that.$mdDialog.alert()
			        .parent(angular.element(document.querySelector('#main')))
			        .clickOutsideToClose(true)
			        .title('No specialty added')
			        .textContent('At least one specialty should be added')
			        .ariaLabel('Alert Dialog Demo')
			        .ok('Ok')
			        .targetEvent(ev)
			    );
	  			}
	  			showAlert();
			}
		}
		if(this.$state.current.name === 'doctor-profile-main.insurances') {
			if(this.docObj.insuranceIds.length > 0) {
				//deleting _id as it is not accepted in backend
				delete this.docObj["_id"];
				let that = this;
				if (this.isFileUploaded) {
					//upload image and on success update the user details
					this.Upload.upload({
						url: this.apiHost + "/api/fileUpload",
						data: { file: this.imgPath }
					}).then(function(resp) {
						that.docObj.imageId = resp.data.imageId;
						//updating user image id in user object
						that.DoctorService.updateDoctor(that.docUserId, that.docObj).then(function(data) {
							that.$state.go("doctor-profile-summary", { "id": that.docUserId });
						});
					}, function(resp) {
					}, function(evt) {
						var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					});
				}
				else {
					this.DoctorService.updateDoctor(this.docUserId, this.docObj).then(function(data) {
						that.$state.go("doctor-profile-summary", { "id": that.docUserId });
					});
				}
			} else {
				var showAlert = function(ev) {
			    // Appending dialog to document.body to cover sidenav in docs app
			    // Modal dialogs should fully cover application
			    // to prevent interaction outside of dialog
			    that.$mdDialog.show(
			      that.$mdDialog.alert()
			        .parent(angular.element(document.querySelector('#main')))
			        .clickOutsideToClose(true)
			        .title('No Insurances added')
			        .textContent('At least one insurance should be added')
			        .ariaLabel('Alert Dialog Demo')
			        .ok('Ok')
			        .targetEvent(ev)
			    );
	  			}
	  			showAlert();
			}
		}
		if(this.$state.current.name === 'doctor-profile-main.practice-info') {
			if(this.docObj.otherAddress.length > 0) {
			//deleting _id as it is not accepted in backend
				delete this.docObj["_id"];
				let that = this;
				if (this.isFileUploaded) {
					//upload image and on success update the user details
					this.Upload.upload({
						url: this.apiHost + "/api/fileUpload",
						data: { file: this.imgPath }
					}).then(function(resp) {
						that.docObj.imageId = resp.data.imageId;
						//updating user image id in user object
						that.DoctorService.updateDoctor(that.docUserId, that.docObj).then(function(data) {
							that.$state.go("doctor-profile-summary", { "id": that.docUserId });
						});
					}, function(resp) {
					}, function(evt) {
						var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					});
				}
				else {
					this.DoctorService.updateDoctor(this.docUserId, this.docObj).then(function(data) {
						that.$state.go("doctor-profile-summary", { "id": that.docUserId });
					});
				}
			} else {
				var showAlert = function(ev) {
			    // Appending dialog to document.body to cover sidenav in docs app
			    // Modal dialogs should fully cover application
			    // to prevent interaction outside of dialog
			    that.$mdDialog.show(
			      that.$mdDialog.alert()
			        .parent(angular.element(document.querySelector('#main')))
			        .clickOutsideToClose(true)
			        .title('No practice location added')
			        .textContent('At least one practice location should be added')
			        .ariaLabel('Alert Dialog Demo')
			        .ok('Ok')
			        .targetEvent(ev)
			    );
	  			}
	  			showAlert();
			}
		}
		if(this.$state.current.name === 'doctor-profile-main.education') {
			//deleting _id as it is not accepted in backend
			delete this.docObj["_id"];
			let that = this;
			if (this.isFileUploaded) {
				//upload image and on success update the user details
				this.Upload.upload({
					url: this.apiHost + "/api/fileUpload",
					data: { file: this.imgPath }
				}).then(function(resp) {
					that.docObj.imageId = resp.data.imageId;
					//updating user image id in user object
					that.DoctorService.updateDoctor(that.docUserId, that.docObj).then(function(data) {
						that.$state.go("doctor-profile-summary", { "id": that.docUserId });
					});
				}, function(resp) {
				}, function(evt) {
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
				});
			}
			else {
				this.DoctorService.updateDoctor(this.docUserId, this.docObj).then(function(data) {
					that.$state.go("doctor-profile-summary", { "id": that.docUserId });
				});
			}
		}
	}
	// saveDoctorOnNext(){
	// 	var that = this;
	// 		//deleting _id as it is not accepted in backend
	// 	if (this.isFileUploaded) {
	// 		//upload image and on success update the user details
	// 		this.Upload.upload({
	// 			url: this.apiHost + "/api/fileUpload",
	// 			data: { file: this.imgPath }
	// 		}).then(function(resp) {
	// 			that.docObj.imageId = resp.data.imageId;
	// 			//updating user image id in user object
	// 			that.DoctorService.updateDoctorOnNext(that.docUserId, that.docObj).then(function(data) {
	// 			});
	// 		}, function(resp) {
	// 		}, function(evt) {
	// 			var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
	// 		});
	// 	}
	// 	else {
	// 		this.DoctorService.updateDoctorOnNext(that.docUserId, that.docObj).then(function(data) {
	// 			that.$state.go("doctor-profile-main.practice-info", { "id": that.docUserId});
	// 		});
	// 	}
	// }
	logout(){
		this.LoginService.logout(this.docObj.userId)
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

	//side navbar highlighter
	navBarHighlighter(){
		var that = this;
		this.$rootScope.$on('$stateChangeSuccess',
			function(event, toState, toParams, fromState, fromParams) {
				switch (toState.name) {
					case "doctor-profile-main.basic-info": {
						that.navBarCss = {};
						that.navBarCss.basicInfo = "doc-advance-profile-nav-highlight";

						//progress bar setting
						// var a = that.percentage(that.docObj);	

						that.profileProgress = that.percentage(that.docObj);
					}
					break;
					case "doctor-profile-main.practice-info": {
						that.navBarCss = {};
						that.navBarCss.practiceInfo = "doc-advance-profile-nav-highlight";
						that.profileProgress = that.percentage(that.docObj);
						//progress bar setting
						// that.profileProgress = 50;
					}
					break;	
					case "doctor-profile-main.insurances":{
						that.navBarCss = {};
						that.navBarCss.insurances = "doc-advance-profile-nav-highlight";
						that.profileProgress = that.percentage(that.docObj);
						//progress bar setting
						// that.profileProgress = 75;
					}
					break;
					case "doctor-profile-main.education": {
						that.navBarCss = {};
						that.navBarCss.education = "doc-advance-profile-nav-highlight";
						that.profileProgress = that.percentage(that.docObj);
						//progress bar setting
						// that.profileProgress = 100;
					}
					default:
						break;
				}
			});
	}

}