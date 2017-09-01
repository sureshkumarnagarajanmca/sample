export class MedicalSchoolModalCmpController {
	// private stateList: any;
	public medSpecialities: Array<String>;
	public degreeList: Array<String>;
	public specialitySelected: string;
	public degreeSelected: string;


	/* @ngInject */
constructor($scope: any, $uibModalInstance: any, docObj:any, DoctorProfileFactory: any, DoctorProfileService: any,CityByStateService: any,public SearchService: SearchService,public $rootScope: any) {

		$scope.getMatches = function(searchText:string,country:string,stateCode:string){
			return DoctorProfileService.queryMedicalSchools(searchText,country,stateCode);
		}
		$scope.onSelected = function (selectedItem) {
			$scope.getStates(selectedItem);
			$scope.selectedItem = "";
			$scope.MedSchoolModCon.specialitySelected = "";
			$scope.MedSchoolModCon.degreeSelected = [];
				$("#label").css("display", "none");
		}
		let that = this;
		$rootScope.$on('removeSpecialtyHolder',function(event,data){
			if(!!that.specialitySelected){
				$("#label").css("display", "block");	
			}else{
				$("#label").css("display", "none");
			}
			if(data){
				$("#label").css("display", "none");
			}
		});
		$rootScope.$on('removeDegreeHolder',function(event,data){
			if(!!that.degreeSelected){
				$("#label1").css("display", "block");	
			}else{
				$("#label1").css("display", "none");
			}
			if(data){
				$("#label1").css("display", "none");
			}
		});
		$scope.selectedList = [];
		angular.copy(docObj.medicalSchoolName, $scope.selectedList);
		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};
		$scope.degreeList = ["MD","MBBS /DO","BMBS", "MBChB", "MBBCh", "MCM", "MMSc","MMedSc","MMed","MSurg","MChir","MCh","MM","MPhil","ChM","CM","DMedSc","DPhil","MS","MSc","DCM","DClinSurg","DMSc","PhD","DS","DSurg","B.D.S","B.A.M.S","B.H.M.S","B.U.M.S","B.P.T","B.O.T"];
		$scope.stateList = [];
		this.SearchService.querySpecialities().then(function(data) {
			$scope.medSpecialities = data;
		});
		$scope.selectedItem = null;
		$scope.selectedObj = {
			"collegeId": "";
			"degreeName": [];
			"taxanomyId": "";
		};
		$scope.country = [
			"USA",
			"Canada",
			"Albania",
			"Montenegro",
			"Portugal",
			"Czech Republic",
			"Greece",
			"Ireland",
			"Poland",
			"Russia",
			"Slovakia",
			"China",
			"India",
			"Spain",
			"France",
			"Armenia",
			"Belarus",
			"Estonia",
			"Kosovo",
			"Latvia",
			"Netherlands",
			"Austria",
			"Belgium",
			"Bosnia and Herzegovina",
			"Bulgaria",
			"Croatia",
			"Cyprus",
			"Denmark",
			"Finland",
			"Georgia",
			"Hungary",
			"Iceland",
			"Lithuania",
			"Macedonia",
			"Malta",
			"Norway",
			"Romania",
			"Serbia",
			"Slovenia",
			"Turkey"
		]
		$scope.getStates = function(stateCode:string){
			CityByStateService.getStatesForMedical(stateCode).then(function(stateList){
				$scope.stateList = stateList;
			},function(err){

			});
		}
		$scope.onSpecialtySelected = function (selectedItem) {
		  //do selectedItem.PropertyName like selectedItem.Name or selectedItem.Key 
		  //whatever property your list has.
		  $("#label").css("display", "block");
		  $("#label").css("z-index", "100");
		  $("#label").css("margin", "0");
		  $("#label").css("background-color", "transparent");
		  $("#label").css("color", "#fa5f5f");
		  $("#label").css("left", "20px");
		  $("#label").css("font-size", "14px");
		}
		$scope.onDegreeSelected = function (selectedItem) {
		  //do selectedItem.PropertyName like selectedItem.Name or selectedItem.Key 
		  //whatever property your list has.
		  $("#label1").css("display", "block");
		  $("#label1").css("z-index", "100");
		  $("#label1").css("margin", "0");
		  $("#label1").css("background-color", "transparent");
		  $("#label1").css("color", "#fa5f5f");
		  $("#label1").css("left", "20px");
		  $("#label1").css("font-size", "14px");
		  
		}
		$scope.removeMedicalSchool = function($index){
			var that = this;
			this.selectedList.splice($index,1);
		}
		$scope.ok = function(){
			this.selectedObj = {
				"collegeId": {
					"_id":"";
					"name":"";
				};
				"degreeName": [];
				"taxanomyId": {
					"_id":"";
					"taxonomyName":"";
					"title":"";
				};
			};
			if(!!this.selectedItem){
				var flag = true;
				let that = this;
				docObj.medicalSchoolName.forEach(function(hos){
					if(hos.collegeId._id === that.selectedItem._id){
						flag = false;
					}
				});
				if(flag){
					this.selectedObj.collegeId._id = that.selectedItem._id;
					this.selectedObj.collegeId.name = that.selectedItem.name;
					this.selectedObj.taxanomyId._id = that.MedSchoolModCon.specialitySelected._id;
					this.selectedObj.taxanomyId.taxonomyName = that.MedSchoolModCon.specialitySelected.taxonomyName;
					this.selectedObj.taxanomyId.title = that.MedSchoolModCon.specialitySelected.title;
					this.selectedObj.degreeName = that.MedSchoolModCon.degreeSelected;
					this.selectedList.push(this.selectedObj);
				}
				this.selectedItem = undefined;
				this.MedSchoolModCon.specialitySelected = undefined;
				this.MedSchoolModCon.degreeSelected = undefined;
		  		$("#label").css("display", "none");
				// $uibModalInstance.close();
			}
		}
		$scope.saves = function() {
			docObj.medicalSchoolName = $scope.selectedList;
			$uibModalInstance.close();
		};
		// $scope.clear = function($event) {
		// 	$scope.stateList.selected = undefined;
		// 	$scope.cityList.selected = undefined;
		// 	// $scope.country.selected = undefined;
		// };
	}
	
}
