export class DoctorProfileSummaryController{
	private docObj: any;
	private imgPath: string;
	private tabs: any;
	public apiHost: string;
	private profileProgress: number;
	private isFileUploaded = false;
	private currentTab: string;

	/* @ngInject */
	constructor(public $rootScope, public $scope: any,
		public $state: angular.ui.IStateService,
		public DoctorProfileSummaryService: any,
		public $uibModal: any,
		public $mdDialog: any, 
		public $stateParams:any,
		private $log: angular.ILogService,
		private LoginService:any,
		public hosts,
		public loginStatus
	) {
	
		if (typeof(loginStatus.redirectTo) !== "undefined") {
			// $state.go(loginStatus.redirectTo);
		} else {
			var that = this;

			this.apiHost = hosts.node.url;
			//Initializing user image path
			this.imgPath = "/assets/images/profile-place-holder.png";
			
			//Getting the docobject
			if(this.$stateParams.id === ""){
				this.$log.error("Missing userId of the doctor in the route");
			}
			else{
				this.DoctorProfileSummaryService.getDoctor(this.$stateParams.id).then(function(data){
					that.docObj = data;
					for (var i = 0; i < that.docObj.certifications.length ; i++) {
					if(that.docObj.certifications[i].dateInMonths % 12 === 0) {
						that.docObj.certifications[i].yearOfCert = parseInt((that.docObj.certifications[i].dateInMonths / 12)-1);
						that.docObj.certifications[i].monthOfCert = 12;
					} else {
						that.docObj.certifications[i].yearOfCert = parseInt(that.docObj.certifications[i].dateInMonths / 12);
						that.docObj.certifications[i].monthOfCert = that.docObj.certifications[i].dateInMonths % 12;
					}
					
					switch (!!that.docObj.certifications[i].monthOfCert) {
						case that.docObj.certifications[i].monthOfCert === 12:
							that.docObj.certifications[i].monthOfCert = "December"
							break;
						case that.docObj.certifications[i].monthOfCert === 1:
							that.docObj.certifications[i].monthOfCert = "January"
							break;
						case that.docObj.certifications[i].monthOfCert === 2:
							that.docObj.certifications[i].monthOfCert = "February"
							break;
						case that.docObj.certifications[i].monthOfCert === 3:
							that.docObj.certifications[i].monthOfCert = "March"
							break;
						case that.docObj.certifications[i].monthOfCert === 4:
							that.docObj.certifications[i].monthOfCert = "April"
							break;
						case that.docObj.certifications[i].monthOfCert === 5:
							that.docObj.certifications[i].monthOfCert = "May"
							break;
						case that.docObj.certifications[i].monthOfCert === 6:
							that.docObj.certifications[i].monthOfCert = "June"
							break;
						case that.docObj.certifications[i].monthOfCert === 7:
							that.docObj.certifications[i].monthOfCert = "July"
							break;
						case that.docObj.certifications[i].monthOfCert === 8:
							that.docObj.certifications[i].monthOfCert = "August"
							break;
						case that.docObj.certifications[i].monthOfCert === 9:
							that.docObj.certifications[i].monthOfCert = "September"
							break;
						case that.docObj.certifications[i].monthOfCert === 10:
							that.docObj.certifications[i].monthOfCert = "October"
							break;
						case that.docObj.certifications[i].monthOfCert === 11:
							that.docObj.certifications[i].monthOfCert = "November"
							break;

					}
				}
					if (that.docObj.hasOwnProperty("imageId") && that.docObj.imageId !== '') {
						that.imgPath = that.apiHost + "/api/getFile?imageId=" + that.docObj.imageId;
					}
					that.profileProgress =  that.percentage(data);

					var circle = new ProgressBar.Circle('#bar', {
						strokeWidth: 3,
						easing: 'easeInOut',
						duration: 1400,
						color: '#4caf50',
						trailColor: '#fff',
						trailWidth: 3,
						svgStyle: null

					});
					setTimeout(function(){
						circle.animate(that.profileProgress/100);					
					})

				});
			}

			//intializing tabs
			this.initalizeTabs();

			//handling state params
		}
	}
	//this flag is useful to decide whether to call image upload service or not
	setImageChange() {
		this.isFileUploaded = true;
	}
	editProfile(){
		this.$state.go("doctor-profile-main.basic-info", { "id": this.docObj.userId});
	}
	editBoard() {
		this.$state.go("doctor-profile-main.education", { "id": this.docObj.userId});
	}
	editHospital() {
		this.$state.go("doctor-profile-main.practice-info", { "id": this.docObj.userId});
	}
	logout(){
		this.LoginService.logout(this.docObj.userId)
	}
	aboutUs() {
		var url = $state.href('about-us', {parameter: "parameter"});
		window.open(url,'_blank');
	}
	//Initialize tabs
	initalizeTabs(){
		this.tabs = [{
            title: 'Specialties',
            url: 'specialities.tpl.html',
            docObjKey: 'taxonomy'
        }, 
        {
			title: 'Board Certifications',
			url: 'board.certification.tpl.html',
            docObjKey: 'certifications'
		}, 
		// {
		// 	title: 'Area of Expertise',
		// 	url: 'area.expertise.tpl.html',
  //           docObjKey: 'certifications'
		// }, 
        {
			title: 'Practice Locations',
			url: 'practice.location.tpl.html',
            docObjKey: 'otherAddress'
		}, 
		 {
			title: 'Hospital Affiliations',
			url: 'affillation.tpl.html',
            docObjKey: 'hospitalAffillation'
		}, 
		{
			title: 'Insurances Accepted',
			url: 'insurances.tpl.html',
            docObjKey: 'insuranceIds'
		},
		{
            title: 'Educational Credentials',
            url: 'education.tpl.html',
            docObjKey: 'medicalSchoolName'
        },
        {
			title: 'Languages Spoken',
			url: 'languages.tpl.html',
            docObjKey: 'languagesSpoken'
		},
		{
			title: 'Brief Introduction',
			url: 'brief.intro.tpl.html',
            docObjKey: 'briefIntro'
		}];
		this.currentTab = 'specialities.tpl.html';
	}
	onClickTab = function(tab) {
		this.currentTab = tab.url;
	}
	isActiveTab = function(tabUrl) {
		return tabUrl == this.currentTab;
	}
	checkForData = function(tab){
		if(tab.docObjKey === "briefIntro" ){
			if(!!this.docObj[tab.docObjKey]){
				return true;
			}else{
				return false;
			}
		}else{
			if(this.docObj[tab.docObjKey].length > 0){
				return true;
			}else{
				return false;
			}
		}
	}
	percentage(docObj) {
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

	$scope.showAlert = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#abc')))
        .clickOutsideToClose(true)
        .textContent('Team FINDaDOCTOR will be coming up with additional features to enable doctors show their available date and time slots. Patients can see and book online appointments with you once these features are enabled.')
        .ariaLabel('Alert Dialog Demo')
        .ok('Ok')
        .targetEvent(ev)
    );
  };




	// var bar = new ProgressBar.Circle('#container', {
	//   strokeWidth: 6,
	//   easing: 'easeInOut',
	//   duration: 1400,
	//   color: '#FFEA82',
	//   trailColor: '#eee',
	//   trailWidth: 1,
	//   svgStyle: null
	// });

	// bar.animate(1.0);  // Number from 0.0 to 1.0

}