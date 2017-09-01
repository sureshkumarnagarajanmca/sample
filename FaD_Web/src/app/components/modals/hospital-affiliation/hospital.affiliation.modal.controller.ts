export class HospitalAffiliationModalCmpController {
	// private stateList: any;

	/* @ngInject */
constructor($scope: any, $uibModalInstance: any, docObj:any, DoctorProfileFactory: any, DoctorProfileService: any,$rootScope  : any,CityByStateService: any) {

		$scope.getMatches = function(searchText:string,stateCode:string,city:string){
			if(!stateCode) {
				return DoctorProfileService.queryHospitalAffliations(searchText);
			} else {
				return DoctorProfileService.queryHospitalAffliations(searchText,stateCode,city);
			}
		}
		$scope.onSelected = function (selectedItem) {
			$scope.getCities(selectedItem.code);
			$scope.selectedItem = "";
		  //do selectedItem.PropertyName like selectedItem.Name or selectedItem.Key 
		  //whatever property your list has.
		}
		$scope.selectedList = [];
		angular.copy(docObj.hospitalAffillation, $scope.selectedList);
		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};	
		$scope.cityList = [];
		$scope.addedList = [];
		$scope.selectedItem = null;
		$scope.selectedObj = {
			"name": "",
			"_id": ""
		};
		$scope.stateList = [
			{"code":"AL","name":"Alabama"},{"code":"AK","name":"Alaska"},{"code":"AZ","name":"Arizona"},{"code":"AR","name":"Arkansas"},{"code":"CA","name":"California"},{"code":"CO","name":"Colorado"},{"code":"CT","name":"Connecticut"},{"code":"DE","name":"Delaware"},{"code":"FL","name":"Florida"},{"code":"GA","name":"Georgia"},{"code":"HI","name":"Hawaii"},{"code":"ID","name":"Idaho"},{"code":"IL","name":"Illinois"},{"code":"IN","name":"Indiana"},{"code":"IA","name":"Iowa"},{"code":"KS","name":"Kansas"},{"code":"KY","name":"Kentucky"},{"code":"LA","name":"Louisiana"},{"code":"ME","name":"Maine"},{"code":"MD","name":"Maryland"},{"code":"MA","name":"Massachusetts"},{"code":"MI","name":"Michigan"},{"code":"MN","name":"Minnesota"},{"code":"MS","name":"Mississippi"},{"code":"MO","name":"Missouri"},{"code":"MT","name":"Montana"},{"code":"NE","name":"Nebraska"},{"code":"NV","name":"Nevada"},{"code":"NH","name":"New Hampshire"},{"code":"NJ","name":"New Jersey"},{"code":"NM","name":"New Mexico"},{"code":"NY","name":"New York"},{"code":"NC","name":"North Carolina"},{"code":"ND","name":"North Dakota"},{"code":"OH","name":"Ohio"},{"code":"OK","name":"Oklahoma"},{"code":"OR","name":"Oregon"},{"code":"PA","name":"Pennsylvania"},{"code":"RI","name":"Rhode Island"},{"code":"SC","name":"South Carolina"},{"code":"SD","name":"South Dakota"},{"code":"TN","name":"Tennessee"},{"code":"TX","name":"Texas"},{"code":"UT","name":"Utah"},{"code":"VT","name":"Vermont"},{"code":"VA","name":"Virginia"},{"code":"WA","name":"Washington"},{"code":"WV","name":"West Virginia"},{"code":"WI","name":"Wisconsin"},{"code":"WY","name":"Wyoming"}
		]
		$rootScope.$on('clearCity',function(event,data){
			$scope.cityList.selected = undefined;
		})
		$scope.getCities = function(stateCode:string){
			CityByStateService.getCities(stateCode).then(function(cityList){
				$scope.cityList = cityList;
			},function(err){

			});
		}
		$scope.addHospital = function(){
			var that = this;
			this.selectedObj = {
				"name": "";
				"_id": "";

			};
			DoctorProfileService.addNewHospital(this.hospitalLocation).then(function(data) {
				let flag = true;
				that.selectedList.forEach(function(hos){
					if(hos._id=== data._id){
						flag = false;
					}
				});
				if(flag) {
					that.selectedObj.name = data.name;
					that.selectedObj._id = data._id;
					that.selectedList.push(that.selectedObj);
					that.addedList.push(that.selectedObj);
					that.hospitalLocation = {};
				} 
				else {
					that.hospitalLocation = {};
				}
			}, function(error) {
				that.otpErrorNotification = error;
			});
		}
		$scope.addFromList = function(){
			this.selectedObj = {
				"name": "";
				"_id": "";

			};
			if(!!this.selectedItem){
				var flag = true;
				let that = this;
				this.selectedList.forEach(function(hos){
					if(hos._id=== that.selectedItem._id){
						flag = false;
					}
				});
				if(flag){
					this.selectedObj.name = this.selectedItem.name;
					this.selectedObj._id = this.selectedItem._id;
					this.selectedList.push(this.selectedObj);
					this.addedList.push(this.selectedObj);
				}
				this.selectedItem = undefined;	
			}
		}
		$scope.removeHospital = function($index){
			var that = this;
			this.selectedList.splice($index,1);
			this.addedList.splice($index - (this.selectedList.length - 1),1);
		}
		$scope.save = function(){
			let that = this;
			docObj.hospitalAffillation = this.selectedList;
			// this.addedList.forEach(function(hos){
			// 	docObj.hospitalAffillation.push(hos);
			// });
			$uibModalInstance.close();
		}
		$scope.clear = function() {
			$scope.stateList.selected = undefined;
			$scope.cityList.selected = undefined;
			// $scope.country.selected = undefined;
		};
	}
	
}
