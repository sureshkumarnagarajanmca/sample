export class MapDirectionsModalController {
	/* @ngInject */
	constructor($scope: any, $uibModalInstance: any, locationObj: any) {
		$scope.locationObj = locationObj;

		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};
	}
}