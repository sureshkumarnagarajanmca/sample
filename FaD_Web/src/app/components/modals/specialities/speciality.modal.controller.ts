export class SpecialityModalCmpController {
	/* @ngInject */
	constructor($scope: any, $uibModalInstance: any, docObj: any, SpecialityService:any, public DoctorProfileFactory:any ) {
		$scope.specialities = [];
		let subSpecialities = [];
		$scope.subSpecialtiesAdded = [];
		$scope.specialtiesAdded = [];
		$scope.emptySub = [];
		angular.copy(docObj.pSubSpeciality, $scope.subSpecialtiesAdded);
		angular.copy(docObj.taxonomy, $scope.specialtiesAdded);
		$scope.placeHolderValue = "Search for specialties";
		var vm = this;
		$scope.arrayOfIds = docObj.pSubSpeciality.map(function(e){
	        return e._id;
	    })
		if(!SpecialityService.specialities[2]){
			SpecialityService.querySpecialities(2).then(function(data) {
				$scope.specialities = data;
			});
		}else{
			$scope.specialities = SpecialityService.specialities[2];
		}
		if(!SpecialityService.specialities[3]){
			SpecialityService.querySpecialities(3).then(function(data) {
				vm.subSpecialities = data;
			});
		}else{
			vm.subSpecialities = SpecialityService.specialities[3]
		}
		
		$scope.selectedSpecialities = [];
		//Adding specialities to existing list of doctor specialities
		$scope.ok = function() {
			docObj.taxonomy = $scope.specialtiesAdded;
			docObj.pSubSpeciality = $scope.subSpecialtiesAdded;
			// $scope.selectedSpecialities.forEach(function(element,index){
			// 	let flag = true;
			// 	for(let taxo of docObj.taxonomy){
			// 		if(taxo._id === element._id){
			// 			flag = false;
			// 			break;
			// 		}
			// 	}
			// 	if(flag){
			// 		if(element.level == 2) {
			// 			docObj.taxonomy.push(element);
			// 		} else if(element.level == 3) {
			// 			docObj.pSubSpeciality.push(element);
			// 		}
			// 	}

			// 	// if (docObj.taxonomy.indexOf(element) === -1) {
			// 	// 	docObj.taxonomy.push(element);
			// 	// }
			// });
			$uibModalInstance.close(docObj);
		};

		//Cancelling speciality update modal
		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};

		//Pushing speciality when a check box is clicked on the modal
		$scope.addSpeciality = function(item, selected) {
			var matchingSubSpecs = [];
			if (selected) {
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
				vm.subSpecialities.forEach(function(element, index) {
					if (element.parent === item["_id"]) {
						matchingSubSpecs.push(element);
					}
				}
				$scope.placeHolderValue = "Search for sub specialties";
				if(matchingSubSpecs.length!==0){
					$scope.specialityFilter = "";
					$scope.specialities	= matchingSubSpecs;
					// $scope.items = matchingSubSpecs;
					$scope.emptySub = matchingSubSpecs.map(function(e){
				        return e.parent;
				    }) 
				}
			} else {
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

		// $scope.addSpeciality = function(item,selected){
		// 	var matchingSubSpecs = [];
		// 	if(selected){
		// 		$scope.selectedSpecialities.push(item);
		// 		DoctorProfileFactory.subSpecialities.forEach(function(element, index) {
		// 			if (element.parent === item["_id"]) {
		// 				matchingSubSpecs.push(element);
		// 			}
		// 		}
		// 		if(matchingSubSpecs.length!==0){		
		// 			$scope.items = matchingSubSpecs;
		// 		}
		// 	}else{
		// 		$scope.selectedSpecialities = $scope.selectedSpecialities.filter(function(elem){
		// 			if(item._id !== elem._id){
		// 				return elem;
		// 			}
		// 		})
		// 	}
		// };
	}
}