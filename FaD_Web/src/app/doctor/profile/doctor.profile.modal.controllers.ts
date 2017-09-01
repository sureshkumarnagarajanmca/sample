export class PracticeLocationModalController{
	/* @ngInject */
	constructor($scope: any, public $mdDialog: any, $uibModalInstance: any, DoctorProfileFactory: any, DoctorProfileService:any, $rootScope : any,CityByStateService: any) {
		if(!DoctorProfileFactory.stagedDocObj.hasOwnProperty('otherAddress')){
			DoctorProfileFactory.stagedDocObj.otherAddress = [];
			angular.copy(DoctorProfileFactory.originalDocObj.otherAddress, DoctorProfileFactory.stagedDocObj.otherAddress);
		}
		$(function() {
		    $('#phone').on('keypress', function(e) {
		        if (e.which == 32)
		            return false;
		    });
		});
		$scope.onSelected = function (selectedItem) {
			$scope.getCities(selectedItem.code);
		}
		$rootScope.$on('clearState',function(event,data){
			$scope.cityList.selected = undefined;
		});
		$scope.practiceLocation = {};
		$scope.cityList = [];
		$scope.stateList = [
			{"code":"AL","name":"Alabama"},{"code":"AK","name":"Alaska"},{"code":"AZ","name":"Arizona"},{"code":"AR","name":"Arkansas"},{"code":"CA","name":"California"},{"code":"CO","name":"Colorado"},{"code":"CT","name":"Connecticut"},{"code":"DE","name":"Delaware"},{"code":"FL","name":"Florida"},{"code":"GA","name":"Georgia"},{"code":"HI","name":"Hawaii"},{"code":"ID","name":"Idaho"},{"code":"IL","name":"Illinois"},{"code":"IN","name":"Indiana"},{"code":"IA","name":"Iowa"},{"code":"KS","name":"Kansas"},{"code":"KY","name":"Kentucky"},{"code":"LA","name":"Louisiana"},{"code":"ME","name":"Maine"},{"code":"MD","name":"Maryland"},{"code":"MA","name":"Massachusetts"},{"code":"MI","name":"Michigan"},{"code":"MN","name":"Minnesota"},{"code":"MS","name":"Mississippi"},{"code":"MO","name":"Missouri"},{"code":"MT","name":"Montana"},{"code":"NE","name":"Nebraska"},{"code":"NV","name":"Nevada"},{"code":"NH","name":"New Hampshire"},{"code":"NJ","name":"New Jersey"},{"code":"NM","name":"New Mexico"},{"code":"NY","name":"New York"},{"code":"NC","name":"North Carolina"},{"code":"ND","name":"North Dakota"},{"code":"OH","name":"Ohio"},{"code":"OK","name":"Oklahoma"},{"code":"OR","name":"Oregon"},{"code":"PA","name":"Pennsylvania"},{"code":"RI","name":"Rhode Island"},{"code":"SC","name":"South Carolina"},{"code":"SD","name":"South Dakota"},{"code":"TN","name":"Tennessee"},{"code":"TX","name":"Texas"},{"code":"UT","name":"Utah"},{"code":"VT","name":"Vermont"},{"code":"VA","name":"Virginia"},{"code":"WA","name":"Washington"},{"code":"WV","name":"West Virginia"},{"code":"WI","name":"Wisconsin"},{"code":"WY","name":"Wyoming"}
		]
		$scope.getCities = function(stateCode:string){
			CityByStateService.getCitiesForPractice(stateCode).then(function(cityList){
				$scope.cityList = cityList;
			},function(err){

			});
		}

  		
		$scope.showConfirmButton = function(selected) {
			if(!$scope.isPrimary) {
				let that = this;
			    // Appending dialog to document.body to cover sidenav in docs app
		    	var confirm = $mdDialog.confirm()
	            // .title('Would you like to continue with the same number?')
	            .textContent('Do you want to make this location as your primary location ?')
	            .ariaLabel('Lucky day')
	            .targetEvent(selected)
	            .ok('Continue')
	            .cancel('Cancel');
			    $mdDialog.show(confirm).then(function() {
			        that.toggless(selected);
			    }, function() {
			    	$scope.isPrimary = false;
			    });
			}
    	};
		$scope.toggless = function (selected) {
			if($scope.isPrimary == true) {
				DoctorProfileFactory.originalDocObj.otherAddress.forEach(function(element, index) {
		        	if(element.isPrimary == true) {
		        		element.isPrimary = false;
		        	}
		    	};
			}
      	};
      	$scope.showConfirm = function(selected) {
      		if(!selected.isPrimary) {
      			let that = this;
			    // Appending dialog to document.body to cover sidenav in docs app
		    	var confirm = $mdDialog.confirm()
	            // .title('Would you like to continue with the same number?')
	            .textContent('Do you want to make this location as your primary location ?')
	            .ariaLabel('Lucky day')
	            .targetEvent(selected)
	            .ok('Continue')
	            .cancel('Cancel');
			    $mdDialog.show(confirm).then(function() {
			        that.toggles(selected);
			    }, function() {
			    	selected.isPrimary = false;
			    });
      		}
    	};
		$scope.toggles = function (selected) {
			if(selected.isPrimary == true) {
				DoctorProfileFactory.originalDocObj.otherAddress.forEach(function(element, index) {
		        	if(element.isPrimary == true) {
		        		element.isPrimary = false;
		        	}
		    	};
			}
      	};
      	$scope.addPracLocation = function(){
			var that = this;

			var addressString = "";


			if(!!$scope.practiceLocationManually.locationCode){
				let data = $scope.practiceLocationManually;
				if(!data.pracAddress.Line2StreetAddress){
					addressString = data.Line1StreetAddress.toString().trim()+", "+data.city.trim()+", "+data.state.trim()+", "+data.zipCode.trim()+", "+data.locationCode.trim();
				}else{
					addressString = data.Line1StreetAddress.toString().trim()+", "+data.Line2StreetAddress.toString().trim()+", "+data.city.trim()+", "+data.state.trim()+", "+data.zipCode.trim()+", "+data.locationCode.trim();
				}
			}else{
				let data = $scope.practiceLocationManually;
				if(!data.pracAddress.Line2StreetAddress){
					addressString = data.pracAddress.zipCode;
				}else{
					addressString = data.pracAddress.zipCode;
				}
			}
			// addressString = address.join(",");

			var geocoder = new google.maps.Geocoder();


			geocoder.geocode({ 'address': addressString }, function(results, status) {
				let that = this;
				if (status === google.maps.GeocoderStatus.OK) {
					$scope.practiceLocationManually.pracAddress.location = {};
					//creating the locaiton object
					let location = {
						"lat": results[0].geometry.location.lat().toString(),
						"lon": results[0].geometry.location.lng().toString()
					}
					$scope.practiceLocationManually.pracAddress.location = location;
					DoctorProfileService.addNewOrganization($scope.practiceLocationManually).then(function(data) {
						let flag = true;
						var addressManually = {};
						addressManually.organizationLegalName = data.orgName;
						addressManually.Line1StreetAddress = data.pracAddress.Line1StreetAddress;
						if(!data.pracAddress.Line2StreetAddress) {
							addressManually.Line2StreetAddress = "";
						} else {
							addressManually.Line2StreetAddress = data.pracAddress.Line2StreetAddress;
						}
						addressManually.city = data.pracAddress.city;
						addressManually.state = data.pracAddress.state;
						addressManually.phoneNo = data.pracAddress.phoneNo;
						addressManually.zipCode = data.pracAddress.zipCode;
						addressManually.geoLocation = data.pracAddress.geoLocation;
						addressManually.country = "US";
						if($scope.isPrimary == undefined) {
							addressManually.isPrimary = false;
						} else {
							addressManually.isPrimary = $scope.isPrimary;
						}

						let flag = true;
						for(let loc of DoctorProfileFactory.originalDocObj.otherAddress){
							if(loc.organizationLegalName === addressManually.organizationLegalName){
								flag = false;
								break;
							}
						}
						if(flag){
							DoctorProfileFactory.originalDocObj.otherAddress.push(addressManually);
						}
						
						$uibModalInstance.close();
					}, function(error) {
						that.otpErrorNotification = error;
					});
				} else {
					$uibModalInstance.close();
					alert('Geocode was not successful for the following reason: ' + status);
				}
			});
		}
		$scope.ok = function() {
			var address = [];
			$scope.practiceLocation.country = "US";
			var addressString = "";
			for (key in $scope.practiceLocation) {
				address.push($scope.practiceLocation[key]);
			}


			if(!!$scope.practiceLocation.locationCode){
				let data = $scope.practiceLocation;
				if(!data.Line2StreetAddress){
					addressString = data.Line1StreetAddress.toString().trim()+", "+data.city.trim()+", "+data.state.trim()+", "+data.zipCode.trim()+", "+data.locationCode.trim();
					data.Line2StreetAddress.toString();
				}else{
					addressString = data.Line1StreetAddress.toString().trim()+", "+data.Line2StreetAddress.toString().trim()+", "+data.city.trim()+", "+data.state.trim()+", "+data.zipCode.trim()+", "+data.locationCode.trim();
				}
			}else{
				let data = $scope.practiceLocation;
				if(!data.Line2StreetAddress){
					addressString = data.zipCode;
				}else{
					addressString = data.zipCode;
				}
			}

			var geocoder = new google.maps.Geocoder();
			// var address = "2147 MOWRY AVE STE A1,FREMONT,US";
			if(!$scope.practiceLocation.geoLocation){
					geocoder.geocode({ 'address': addressString }, function(results, status) {
						if(status === google.maps.GeocoderStatus.OK) {
							$scope.practiceLocation.geoLocation = {};
							//creating the locaiton object
							let location = {
								"lat": results[0].geometry.location.lat(),
								"lon": results[0].geometry.location.lng()
							}
							$scope.practiceLocation.geoLocation.location = location;
							//pushing to the orginal doc object to render the updated details in UI

							DoctorProfileFactory.originalDocObj.otherAddress.push($scope.practiceLocation);

							//pushing the data to staged object which is later used to send to server for doctor update
							// DoctorProfileFactory.stagedDocObj.otherAddress.push($scope.practiceLocation);
							$uibModalInstance.close();
						} else {
							alert('Geocode was not successful for the following reason: ' + status);
							$uibModalInstance.close();
						}

				});
			}
			else{

				DoctorProfileFactory.originalDocObj.otherAddress.push($scope.practiceLocation);

				//pushing the data to staged object which is later used to send to server for doctor update
				$uibModalInstance.close();
			}
			
		};

		$rootScope.$on("clearAuto",function(data,value){
		 	$scope.practiceLocation = "";
		 })

		//action method when cancel is clicked on the modal
		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.getMatches = function(searchText:string,stateCode:string,city:string){
			if(!stateCode) {
				return DoctorProfileService.queryOrganizations(searchText);
			} else {
				return DoctorProfileService.queryOrganizations(searchText,stateCode,city);
			}
		}
		$scope.$watch('selectedItem', function(selectedOrg) {
			$scope.practiceLocation = selectedOrg.pracAddress;
			$scope.practiceLocation._id = selectedOrg._id;
			$scope.practiceLocation.organizationLegalName = selectedOrg.orgName;

		});
		//get geolocation for the address entered
		function geocodeAddress(address) {
			var geocoder = new google.maps.Geocoder();
			// var address = "2147 MOWRY AVE STE A1,FREMONT,US";
			geocoder.geocode({ 'address': address}, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
				} else {
					alert('Geocode was not successful for the following reason: ' + status);
				}
			});
		}
	}	
}

// export class hospitalAffliationsControllerModal {
// 	/* @ngInject */
// 	constructor($scope: any, $uibModalInstance: any,DoctorProfileFactory: any, DoctorProfileService: any) {


// 		// $scope.getMatches = function(searchText:string){
// 		// 	return DoctorProfileService.queryHospitalAffliations(searchText);
// 		// }	

// 		// $scope.ok = function(){
// 		// 	if(!!$scope.selectedItem){
// 		// 		var flag = true;
// 		// 		docObj.hospitalAffillation.forEach(function(hos){
// 		// 			if(hos.toLowerCase() === $scope.selectedItem.name.toLowerCase()){
// 		// 				flag = false;
// 		// 			}
// 		// 		});
// 		// 		if(flag){
// 		// 			docObj.hospitalAffillation.push($scope.selectedItem.name);
// 		// 		}
// 		// 		$uibModalInstance.close();
// 		// 	}
// 		// }
// 	})
// }

export class SpecialityModalController{
	/* @ngInject */
	constructor($scope: any, $uibModalInstance:any, items:any, DoctorProfileFactory:any) {
		// $scope.items = DoctorProfileFactory.specialities.concat(DoctorProfileFactory.subSpecialities);
		$scope.items = items;
		$scope.selectedSpecialities = [];
		$scope.subSpecialtiesAdded = [];
		$scope.specialtiesAdded = [];
		$scope.emptySub = [];
		angular.copy(DoctorProfileFactory.originalDocObj.pSubSpeciality, $scope.subSpecialtiesAdded);
		angular.copy(DoctorProfileFactory.originalDocObj.taxonomy, $scope.specialtiesAdded);
		$scope.placeHolderValue = "Search for specialties";
		if(!DoctorProfileFactory.stagedDocObj) {
			angular.copy(DoctorProfileFactory.originalDocObj, DoctorProfileFactory.stagedDocObj);
		}
		$scope.arrayOfIds = DoctorProfileFactory.originalDocObj.pSubSpeciality.map(function(e){
	        return e._id;
	    })
		//Adding specialities to existing list of doctor specialities
		$scope.ok = function() {
			let originalObj = DoctorProfileFactory.originalDocObj;
			let stageObj = DoctorProfileFactory.stagedDocObj;
			originalObj.taxonomy = $scope.specialtiesAdded;
			originalObj.pSubSpeciality = $scope.subSpecialtiesAdded;
			// if (!stageObj.hasOwnProperty("taxonomy")) {
			// 	stageObj.taxonomy = [];
			// 	angular.copy(originalObj.taxonomy, stageObj.taxonomy);
			// 	// stageObj.taxomony = JSON.parse(JSON.stringify(originalObj.taxonomy));
			// 	// angular.copy(stageObj.taxomony, originalObj.taxonomy);
			// }
			// $scope.selectedSpecialities.forEach(function(element,index){
			// 	var flafToPush = true;
			// 	originalObj.taxonomy.forEach(function(elem){
			// 		if(elem._id === element._id){
			// 			flafToPush = false;
			// 		}
			// 	});
			// 	if(flafToPush){
			// 		if(element.level == 2) {
			// 			originalObj.taxonomy.push(element);
			// 		} else if(element.level == 3) {
			// 			originalObj.pSubSpeciality.push(element);
			// 		}

			// 	}
			// 	// let existingIndex = originalObj.taxonomy.indexOf(element);
			// 	// if(existingIndex === -1){
			// 	// 	originalObj.taxonomy.push(element);
			// 	// 	stageObj.taxonomy.push(element);
			// 	// }
			// });
			$uibModalInstance.close();
		};

		//Cancelling speciality update modal
		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};

		//Pushing speciality when a check box is clicked on the modal
		$scope.addSpeciality = function(item,selected){
			var matchingSubSpecs = [];
			if(selected){
				$scope.selectedSpecialities.push(item);
				if(item.level == 3) {
					$scope.subSpecialtiesAdded.push(item);
					$scope.arrayOfIds.push(item._id);
				}
				if(item.level == 2) {
					let flagg = true;
					$scope.specialtiesAdded.forEach(function(elem, index) {
						if(elem._id == item._id) {
							flagg = false;
						}
					})
					if(flagg == true) {
						$scope.specialtiesAdded.push(item);
					}
				}
				DoctorProfileFactory.subSpecialities.forEach(function(element, index) {
					if (element.parent === item["_id"]) {
						matchingSubSpecs.push(element);
					}
				}
				$scope.placeHolderValue = "Search for sub specialties";
				if(matchingSubSpecs.length!==0){
					$scope.specialityFilter = "";		
					$scope.items = matchingSubSpecs;
					$scope.emptySub = matchingSubSpecs.map(function(e){
				        return e.parent;
				    }) 
				}
			}else{
				$scope.specialtiesAdded = $scope.specialtiesAdded.filter(function(elem){
					if(item._id !== elem._id){
						return elem;
					}
				})
				$scope.subSpecialtiesAdded = $scope.subSpecialtiesAdded.filter(function(elem){
					if(item._id !== elem._id){
						return elem;
					}
				})
			}
		};
		// $scope.addSubSpeciality = function(item, selected) {
		// 	$scope.items=DoctorProfileFactory.subSpecialities;
		// 	if (selected) {
		// 		$scope.selectedSpecialities.push(item);	
		// 	}
		// 	else {
		// 		$scope.selectedSpecialities = $scope.selectedSpecialities.filter(function(elem){
		// 			if(item._id !== elem._id){
		// 				return elem;
		// 			}
		// 		})
		// 	}
		// };
	}
}

export class InsurancesModalController {
	/* @ngInject */
	constructor($scope: any, $uibModalInstance: any,  DoctorProfileFactory: any, DoctorProfileService:any, InsuranceService : any) {

		var that = this;
		$scope.insurances = [];
		$scope.selectedInsurances = [];
		angular.copy(DoctorProfileFactory.originalDocObj.insuranceIds, $scope.selectedInsurances);
		DoctorProfileFactory.stagedDocObj = DoctorProfileFactory.originalDocObj;
		// $scope.arrayOfIds = docObj.insuranceIds;
		//$scope.languageFilter;
		$scope.arrayOfIds = DoctorProfileFactory.originalDocObj.insuranceIds.map(function(e){
	        return e._id;
	    }) 
		
		if(!!InsuranceService.insurances.length > 0){
			this.insuranceProviders = InsuranceService.insurances;
		}else{
			InsuranceService.getInsurances().then((data: any) => {
				this.insuranceProviders = data;				
			});
		}
		if(!!DoctorProfileFactory.originalDocObj.insuranceIds.length > 0){
			this.selectedInsurances = DoctorProfileFactory.originalDocObj.insuranceIds;
		}else{
			
		}
		//Adding specialities to existing list of doctor specialities
		$scope.ok = function() {
			DoctorProfileFactory.originalDocObj.insuranceIds = $scope.selectedInsurances;
			// $scope.selectedInsurances.forEach(function(element, index) {
			// 	// if (docObj.insuranceIds.indexOf(element) === -1) {
			// 	// 	docObj.insuranceIds.push(element);
			// 	// }
			// 	let flag = true;
			// 	for(let insurance of DoctorProfileFactory.originalDocObj.insuranceIds){
			// 		if(insurance._id === element._id){
			// 			flag = false;
			// 			break;
			// 		}
			// 	}
			// 	if(flag){
			// 		DoctorProfileFactory.originalDocObj.insuranceIds.push(element);
			// 	}
			// });
			$uibModalInstance.close();
		};
		$scope.clearAll = function() {
			for(var i = 0, len = ($scope.selectedInsurances).length; i < len; i++) {
		        $scope.selected = false;
		        $scope.arrayOfIds = [];
		        $scope.selectedInsurances.pop();
			}
		};
		//Cancelling speciality update modal
		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};

		//Pushing speciality when a check box is clicked on the modal
		$scope.addInsurance = function(item, selected) {
			if (selected) {
				flag = true;
				for(var i = 0, len = ($scope.selectedInsurances).length; i < len; i++) {
				    if ($scope.selectedInsurances[i]._id === item._id) {
				        flag= false;
				    }
				}
				if(flag) {
					$scope.selectedInsurances.push(item);
					$scope.arrayOfIds = $scope.selectedInsurances.map(function(e){
				        return e._id;
				    }) 
				}
			}else{
				cond = false;
				for(var i = 0, len = ($scope.selectedInsurances).length; i < len; i++) {
				    if ($scope.selectedInsurances[i]._id === item._id) {
				    	inde = i
				        cond= true;
				    }
				}
				if(cond) {
					$scope.selectedInsurances.splice(inde,1);
					$scope.arrayOfIds = $scope.selectedInsurances.map(function(e){
				        return e._id;
				    }) 
				}
				
			}
		};
	}
}

export class HospitalAffiliationModController {
	/* @ngInject */
	constructor($scope: any, $uibModalInstance: any,$rootScope  : any, DoctorProfileFactory: any, DoctorProfileService: any,CityByStateService: any) {
		$scope.getMatches = function(searchText:string,stateCode:string,city:string){
			if(!stateCode) {
				return DoctorProfileService.queryHospitalAffliations(searchText);
			} else {
				return DoctorProfileService.queryHospitalAffliations(searchText,stateCode,city);
			}
		}	
		$rootScope.$on('clearCity',function(event,data){
			$scope.cityList.selected = undefined;
		})
		$scope.onSelected = function (selectedItem) {
			$scope.getCities(selectedItem.code);
		  //do selectedItem.PropertyName like selectedItem.Name or selectedItem.Key 
		  //whatever property your list has.
		}
		$scope.selectedList = [];
		angular.copy(DoctorProfileFactory.originalDocObj.hospitalAffillation, $scope.selectedList);
		// DoctorProfileFactory.stageObj.hospitalAffillation = DoctorProfileFactory.originalDocObj.hospitalAffillation;
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
		$scope.getCities = function(stateCode:string){
			CityByStateService.getCities(stateCode).then(function(cityList){
				$scope.cityList = cityList;
			},function(err){

			});
		}
		$scope.addHospital = function(){
			var that = this;
			this.selectedObj = {
				"name": "",
				"_id": ""

			};
			DoctorProfileService.addNewHospital(this.hospitalLocation).then(function(data) {
				let flag = true;
				that.selectedList.forEach(function(hos){
					if(hos.hospitalId=== data._id){
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
		$scope.removeHospital = function($index){
			var that = this;
			this.selectedList.splice($index,1);
			this.addedList.splice($index - (this.selectedList.length - 1),1);
		}
		$scope.addFromList = function(){
			this.selectedObj = {
				"name": "",
				"_id": ""

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
		$scope.save = function(){
			let that = this;
			this.addedList.forEach(function(hos){
				// DoctorProfileFactory.stagedDocObj.hospitalAffillation.push(hos);
				DoctorProfileFactory.originalDocObj.hospitalAffillation.push(hos);
				// docObj.hospitalAffillation.push(hos);
				DoctorProfileFactory.stagedDocObj = DoctorProfileFactory.originalDocObj
			});
			$uibModalInstance.close();
		}
		// $scope.ok = function(){
		// 	if(!!$scope.selectedItem){
		// 		let originalObj = DoctorProfileFactory.originalDocObj;
		// 		let stageObj = DoctorProfileFactory.stagedDocObj;
		// 		if(!stageObj.hospitalAffillation){
		// 			stageObj.hospitalAffillation = [];
		// 		}
		// 		var flag = true;
		// 		stageObj.hospitalAffillation.forEach(function(hos){
		// 			if(hos.toLowerCase() === $scope.selectedItem.name.toLowerCase()){
		// 				flag = false;
		// 			}
		// 		});
		// 		if(flag){
		// 			stageObj.hospitalAffillation.push($scope.selectedItem.name);
		// 			originalObj.hospitalAffillation.push($scope.selectedItem.name);
		// 		}
		// 		$uibModalInstance.close();
		// 	}
		// }
		$scope.clear = function() {
			$scope.stateList.selected = undefined;
			$scope.cityList.selected = undefined;
			// $scope.country.selected = undefined;
		};
	}
}
export class MessageModalController {
	/* @ngInject */
	constructor($scope: any,public $mdDialog: any,public $state: angular.ui.IStateService,public DoctorProfileService:any,public DoctorProfileFactory:any) {
	}
	cancel() {
        this.$mdDialog.cancel();
    };
    updateDoctor(){
		let that = this;
		if(!this.DoctorProfileFactory.stagedDocObj._id) {
			angular.copy(this.DoctorProfileFactory.originalDocObj,this.DoctorProfileFactory.stagedDocObj)
		}
		if (that.isFileUploaded) {
			//upload image and on success update the user details
			this.Upload.upload({
				url: that.apiHost + "/api/fileUpload",
				data: { file: that.imgPath }
			}).then(function(resp) {
				that.DoctorProfileFactory.stagedDocObj.imageId = resp.data.imageId;
				let result = that.DoctorProfileService.updateDoctor();
				that.$state.go("doctor-profile-summary", {id:that.DoctorProfileFactory.docId });
				result.then(function(){
				},function(){
				});
			}, function(resp) {
			}, function(evt) {
				var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
			});
		}else{

			let result = this.DoctorProfileService.updateDoctor();

			result.then(function(){
				that.$state.go("doctor-profile-summary", {id:that.DoctorProfileFactory.docId });
			},function(){
			});			
		}
		setTimeout(function() {
			that.$mdDialog.cancel();
		},2000);
		
		//formatting the json object to be saved, this is temp code, 
		//backend api should be consistent with request and response to avoid this code
		/*var temp = JSON.stringify(this.DoctorProfileFactory.originalDocObj);	
		this.DoctorProfileFactory.stagedDocObj = JSON.parse(temp);
*/
		//cleaning taxonomies
		/*this.DoctorProfileFactory.stagedDocObj.taxonomy = [];
		this.DoctorProfileFactory.originalDocObj.taxonomy.forEach(function(element,index){
			that.DoctorProfileFactory.stagedDocObj.taxonomy.push(element["_id"]);
		});*/

		//cleaning insurances
		/*this.DoctorProfileFactory.stagedDocObj.insuranceIds = [];
		this.DoctorProfileFactory.originalDocObj.insuranceIds.forEach(function(element, index) {
			that.DoctorProfileFactory.stagedDocObj.insuranceIds.push(element["_id"]);
		});*/

		//cleaning languages spoken
		/*this.DoctorProfileFactory.stagedDocObj.languagesSpoken = [];
		this.DoctorProfileFactory.originalDocObj.languagesSpoken.forEach(function(element, index) {
			that.DoctorProfileFactory.stagedDocObj.languagesSpoken.push(parseInt(element["_id"]));
		});*/


	}
}
