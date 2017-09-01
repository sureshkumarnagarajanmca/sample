export class LanguageModalCmpController {
	/* @ngInject */
	constructor($scope: any, $uibModalInstance: any, docObj: any, LanguageService: any) {
		$scope.languages = [];
		$scope.selectedLanguages = [];
		angular.copy(docObj.languagesSpoken, $scope.selectedLanguages);
		//$scope.languageFilter;
		let subSpecialities = [];

		LanguageService.getLanguages().then(function(data) {
			$scope.languages = data;
		});

		$scope.arrayOfLangs = docObj.languagesSpoken.map(function(e){
	        return e._id;
	    }) 
		//Adding Language to existing list of doctor Languages
		$scope.ok = function() {
			docObj.languagesSpoken = $scope.selectedLanguages;
			// $scope.selectedLanguages.forEach(function(element, index) {
			// 	let flag = true;
			// 	for(let lang of docObj.languagesSpoken){
			// 		if(lang._id === element._id){
			// 			flag = false;
			// 			break;
			// 		}
			// 	}
			// 	if(flag){
			// 		docObj.languagesSpoken.push(element);
			// 	}
			// });
			$uibModalInstance.close();
		};
		// $scope.remove = function() {
		// 	$scope.removedLanguages.forEach(function(element, index) {
		// 		// if (docObj.insuranceIds.indexOf(element) === -1) {
		// 		// 	docObj.insuranceIds.push(element);
		// 		// }
				
		// 		for(var i = 0, len = (docObj.languagesSpoken).length; i < len; i++) {
		// 		    if (docObj.languagesSpoken[i]._id === element._id) {
		// 		        var inde = i;
		// 		        flag= true;
		// 		    }
		// 		}
		// 		if(flag) {
		// 			docObj.languagesSpoken.splice(inde,1);
		// 		}
		// 	});
		// 	$scope.removedLanguages = [];
		// };
		//Cancelling Language update modal
		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};
		$scope.clearAll = function() {
			for(var i = 0, len = ($scope.selectedLanguages).length; i < len; i++) {
		        // docObj.languagesSpoken.pop();
		        $scope.selected = false;
		        $scope.arrayOfLangs = [];
		        $scope.selectedLanguages.pop();
			}
				
		};
		//Pushing Language when a check box is clicked on the modal
		$scope.addLanguage = function(item, selected) {
			if (selected) {
				flag = true;
				for(var i = 0, len = ($scope.selectedLanguages).length; i < len; i++) {
				    if ($scope.selectedLanguages[i]._id === item._id) {
				        flag= false;
				    }
				}
				if(flag) {
					$scope.selectedLanguages.push(item);
					$scope.arrayOfLangs = $scope.selectedLanguages.map(function(e){
				        return e._id;
				    }) 
				}
			}else{
				cond = false;
				for(var i = 0, len = ($scope.selectedLanguages).length; i < len; i++) {
				    if ($scope.selectedLanguages[i]._id === item._id) {
				    	inde = i
				        cond= true;
				    }
				}
				if(cond) {
					$scope.selectedLanguages.splice(inde,1);
					$scope.arrayOfLangs = $scope.selectedLanguages.map(function(e){
				        return e._id;
				    }) 
				}
				
			}
		};
	}
}