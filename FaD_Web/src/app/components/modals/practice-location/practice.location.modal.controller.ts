export class PracticeLocationModalCmpController {
	/* @ngInject */
	constructor($scope: any, public $mdDialog: any, $uibModalInstance: any, docObj:any, DoctorProfileFactory: any, DoctorProfileService: any, $rootScope  : any,CityByStateService: any) {
		/*if (!DoctorProfileFactory.stagedDocObj.hasOwnProperty('practiceLocationAddress')) {
			DoctorProfileFactory.stagedDocObj.practiceLocationAddress = [];
			angular.copy(DoctorProfileFactory.originalDocObj.practiceLocationAddress, DoctorProfileFactory.stagedDocObj.practiceLocationAddress);
		}*/
		$scope.onSelected = function (selectedItem) {
			$scope.getCities(selectedItem.code);
			$scope.practiceLocation = [];
			$scope.selectedItem = "";
		  //do selectedItem.PropertyName like selectedItem.Name or selectedItem.Key 
		  //whatever property your list has.
		}
		if(!docObj.hasOwnProperty('otherAddress')){
			docObj.otherAddress = [];
			// angular.copy(DoctorProfileFactory.originalDocObj.otherAddress, DoctorProfileFactory.stagedDocObj.otherAddress);
		}
		$scope.practiceLocation = {};
		$scope.practiceLocationManually = {};
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
		$rootScope.$on('clearState',function(event,data){
			$scope.cityList.selected = undefined;
		});
		$scope.showConfirmButton = function(selected) {
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
    	};
		$scope.toggless = function (selected) {
			if($scope.isPrimary == true) {
				docObj.otherAddress.forEach(function(element, index) {
		        	if(element.isPrimary == true) {
		        		element.isPrimary = false;
		        	}
		    	};
			}
      	};

		$scope.showConfirm = function(selected) {
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
    	};
		$scope.toggles = function (selected) {
			if(selected.isPrimary == true) {
				docObj.otherAddress.forEach(function(element, index) {
		        	if(element.isPrimary == true) {
		        		element.isPrimary = false;
		        	}
		    	};
			}
      	};
		$rootScope.$on("clearAuto",function(data,value){
		 	$scope.practiceLocation = "";
		})

		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
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
						for(let loc of docObj.otherAddress){
							if(loc.organizationLegalName === addressManually.organizationLegalName){
								flag = false;
								break;
							}
						}
						if(flag){
							docObj.otherAddress.push(addressManually);
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
			//creating address string from practice location
			var address = [];

			var addressString = "";
			for (key in $scope.practiceLocation) {
				address.push($scope.practiceLocation[key]);
			}
			if(!!$scope.practiceLocation.locationCode){
				let data = $scope.practiceLocation;
				if(!data.Line2StreetAddress){
					addressString = data.Line1StreetAddress.toString().trim()+", "+data.city.trim()+", "+data.state.trim()+", "+data.zipCode.trim()+", "+data.locationCode.trim();
				}else{
					addressString = data.Line1StreetAddress.toString().trim()+", "+data.Line2StreetAddress.toString().trim()+", "+data.city.trim()+", "+data.state.trim()+", "+data.zipCode.trim()+", "+data.locationCode.trim();
				}
			}else{
				let data = $scope.practiceLocation;
				if(!data.Line2StreetAddress){
					addressString = data.Line1StreetAddress.toString().trim()+", "+data.city.trim()+", "+data.state.trim()+", "+data.zipCode.trim();
				}else{
					addressString = data.Line1StreetAddress.toString().trim()+", "+data.Line2StreetAddress.toString().trim()+", "+data.city.trim()+", "+data.state.trim()+", "+data.zipCode.trim();
				}
			}
			// addressString = address.join(",");
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({ 'address': addressString }, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					$scope.practiceLocation.geoLocation = {};
					//creating the locaiton object
					let location = {
						"lat": results[0].geometry.location.lat().toString(),
						"lon": results[0].geometry.location.lng().toString()
					}
					$scope.practiceLocation.geoLocation.location = location;
					//pushing to the orginal doc object to render the updated details in UI

					// DoctorProfileFactory.originalDocObj.practiceLocationAddress.push($scope.practiceLocation);

					//pushing the data to staged object which is later used to send to server for doctor update
					// DoctorProfileFactory.stagedDocObj.practiceLocationAddress.push($scope.practiceLocation);
					let flag = true;
					for(let loc of docObj.otherAddress){
						if(loc.organizationLegalName === $scope.practiceLocation.organizationLegalName){
							flag = false;
							break;
						}
					}
					if(!$scope.practiceLocation.isPrimary) {
						$scope.practiceLocation.isPrimary = false;
					}
					if(flag){
						docObj.otherAddress.push($scope.practiceLocation);
					}
					// docObj.otherAddress.push($scope.practiceLocation);
					// $scope.$apply();
					$uibModalInstance.close();
				} else {
					$uibModalInstance.close();
					alert('Geocode was not successful for the following reason: ' + status);
				}
			});
			
		};
		$scope.clear = function() {
			$scope.stateList.selected = undefined;
			$scope.cityList.selected = undefined;
			// $scope.country.selected = undefined;
		};
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