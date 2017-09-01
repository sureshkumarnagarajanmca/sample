export class InsurancesModalCmpController {
	/* @ngInject */
	constructor($scope: any, $uibModalInstance: any, docObj: any, InsuranceService: any) {
		var that = this;
		$scope.insurances = [];
		$scope.selectedInsurances = [];
		angular.copy(docObj.insuranceIds, $scope.selectedInsurances);
		// $scope.arrayOfIds = docObj.insuranceIds;
		//$scope.languageFilter;
		$scope.arrayOfIds = docObj.insuranceIds.map(function(e){
	        return e._id;
	    }) 
		
		if(!!InsuranceService.insurances.length > 0){
			this.insuranceProviders = InsuranceService.insurances;
		}else{
			InsuranceService.getInsurances().then((data: any) => {
				this.insuranceProviders = data;				
			});
		}
		if(!!docObj.insuranceIds.length > 0){
			this.selectedInsurances = docObj.insuranceIds;
		}else{
			
		}
		//Adding specialities to existing list of doctor specialities
		$scope.ok = function() {
			docObj.insuranceIds = $scope.selectedInsurances;
			// $scope.selectedInsurances.forEach(function(element, index) {
			// 	// if (docObj.insuranceIds.indexOf(element) === -1) {
			// 	// 	docObj.insuranceIds.push(element);
			// 	// }
			// 	let flag = true;
			// 	for(let insurance of docObj.insuranceIds){
			// 		if(insurance._id === element._id){
			// 			flag = false;
			// 			break;
			// 		}
			// 	}
			// 	if(flag){
			// 		docObj.insuranceIds.push(element);
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