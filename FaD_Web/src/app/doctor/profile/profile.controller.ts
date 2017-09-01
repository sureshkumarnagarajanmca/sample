export class ProfileController{
	public eligibilityInput: any;	
	/* @ngInject */
	constructor(
		public $scope: angular.IScope,
		public InsuranceService: any,
		public $mdDialog: any,
		public DoctorProfileSummaryService: any,
		public LoginService: any,
		public $stateParams:any,		
		CityByStateService: any) {
		
		var that = this;
		
		this.doctorDetails = {};
		
		$scope.stateList = [];
		
		CityByStateService.getStatesForMedical('us').then(function(stateList){
			$scope.stateList = stateList;
		},function(err){

		});
		
		$scope.insuranceList = [];
		this.InsuranceService.getInsurances().then((data: any) => {
			$scope.insuranceList = data;
		});
		
		this.patientsList = [
			{"_id":"XYTQ2WQTY","fName": "jacob", "lName": "smith", "dob":"05/21/1980", "gender":"M", "insurance_company":"local xyz", "member_id":"LOC000001213"},
			{"_id":"XYTQ2WPEWTY","fName": "michael", "lName": "johnson", "dob":"01/05/1956", "gender":"M", "insurance_company":"local xyz", "member_id":"LOC000001214"},
			{"_id":"XYTQ2WQYEWQ","fName": "jose", "lName": "garcia", "dob":"05/03/1952", "gender":"F", "insurance_company":"local xyz", "member_id":"LOC000001216"},
			{"_id":"XYTQ2WQTY0NMGFD","fName": "kimberly", "lName": "lewis", "dob":"04/16/1966", "gender":"F", "insurance_company":"local xyz", "member_id":"LOC000001218"}
		];
		this.eligibilityInput = {};
		this.DoctorProfileSummaryService.getDoctor(this.$stateParams.id).then(function(data){
			that.doctorDetails = data;
		});
	}
	
	logout(){
		this.LoginService.logout(this.$stateParams.id);
	}	
	
	submitEligibility() {
		/* let that = this;
    	this.$mdDialog.show({
      		templateUrl: 'patient-smith.html',
      		//controller: 'MessageModalController',
			//controllerAs : 'Message',
      		parent: angular.element(document.body),
      		clickOutsideToClose:true,
      		// fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    	})
    	.then(function() {
      		// $scope.status = 'You said the information was "' + answer + '".';
    	}, function() {
      		// that.cancel();
    	}); */
		var that = this;
		var flag = false;
		angular.forEach(this.patientsList, function(value, key){
			var gender;
			if (document.getElementById('gender_m').checked) {
				gender = document.getElementById('gender_m').value;
			} else {
				gender = document.getElementById('gender_f').value;
			}
			if (
				document.getElementById('f_name').value.toLowerCase() === value.fName
				&& document.getElementById('l_name').value.toLowerCase() === value.lName
				&& gender === value.gender
				&& document.getElementById('insurance_company').value.toLowerCase() === value.insurance_company
				&& document.getElementById('member_id').value === value.member_id
			) {
				var fName = that.doctorDetails.fName.toLowerCase();
				fName = fName.charAt(0).toUpperCase() + fName.slice(1);
				var lName = that.doctorDetails.lName.toLowerCase();
				lName = lName.charAt(0).toUpperCase() + lName.slice(1);				
				window.open(value._id+".html?fName="+fName+"&lName="+lName, value._id, "width=2000,height=1000");
				flag = true;
			}
		});
		if (flag === false) {
			document.getElementById('error-msg').style.display = "block";
		} else {
			document.getElementById('error-msg').style.display = "none";
		}
	}
}