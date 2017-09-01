export class CertificationsModalCmpController {
	public dateInMonths: string;
	/* @ngInject */
	constructor($scope: any, $uibModalInstance: any, docObj: any, CertificationService: any) {
		$scope.certifications = [];
		$scope.selectedCertifications = [];
		angular.copy(docObj.certifications, $scope.selectedCertifications);
		var dateInMonths = "";
		var years = "";
		var months = "";
		$scope.arrayOfCerts = docObj.certifications.map(function(e){
	        return e.certficationName;
	    })
		$scope.monthList = [
			{"name":"January","id":"1"},{"name":"February","id":"2"},{"name":"March","id":"3"},{"name":"April","id":"4"},{"name":"May","id":"5"},{"name":"June","id":"6"},{"name":"July","id":"7"},{"name":"August","id":"8"},{"name":"September","id":"9"},{"name":"October","id":"10"},{"name":"November","id":"11"},{"name":"December","id":"12"}
		]
		CertificationService.getCertification().then((data: any) => {
			$scope.certifications = data;
			for (var i = 0; i < docObj.certifications.length ; i++) {
				if(docObj.certifications[i].dateInMonths % 12 === 0) {
					docObj.certifications[i].yearOfCert = parseInt((docObj.certifications[i].dateInMonths / 12)-1);
					docObj.certifications[i].monthOfCert = 12;
				} else {
					docObj.certifications[i].yearOfCert = parseInt(docObj.certifications[i].dateInMonths / 12);
					docObj.certifications[i].monthOfCert = docObj.certifications[i].dateInMonths % 12;
				}
				switch (!!docObj.certifications[i].monthOfCert) {
					case docObj.certifications[i].monthOfCert === "December":
						docObj.certifications[i].monthOfCert = "12"
						break;
					case docObj.certifications[i].monthOfCert === "January":
						docObj.certifications[i].monthOfCert = "1"
						break;
					case docObj.certifications[i].monthOfCert === "February":
						docObj.certifications[i].monthOfCert = "2"
						break;
					case docObj.certifications[i].monthOfCert === "March":
						docObj.certifications[i].monthOfCert = "3"
						break;
					case docObj.certifications[i].monthOfCert === "April":
						docObj.certifications[i].monthOfCert = "4"
						break;
					case docObj.certifications[i].monthOfCert === "May":
						docObj.certifications[i].monthOfCert = "5"
						break;
					case docObj.certifications[i].monthOfCert === "June":
						docObj.certifications[i].monthOfCert = "6"
						break;
					case docObj.certifications[i].monthOfCert === "July":
						docObj.certifications[i].monthOfCert = "7"
						break;
					case docObj.certifications[i].monthOfCert === "August":
						docObj.certifications[i].monthOfCert = "8"
						break;
					case docObj.certifications[i].monthOfCert === "September":
						docObj.certifications[i].monthOfCert = "9"
						break;
					case docObj.certifications[i].monthOfCert === "October":
						docObj.certifications[i].monthOfCert = "10"
						break;
					case docObj.certifications[i].monthOfCert === "November":
						docObj.certifications[i].monthOfCert = "11"
						break;
				}
	        	$scope.certifications.forEach(function(elem) {
	        		for (var i = 0; i < docObj.certifications.length; ++i) {
	        			if(elem.certficationName == docObj.certifications[i].certficationName) {
	        				elem.months = (docObj.certifications[i].monthOfCert).toString();
	        				elem.years = docObj.certifications[i].yearOfCert;
	        				break;
	        			}
	        		}
	    		}
			}
		});
		//Adding specialities to existing list of doctor specialities
		$scope.ok = function() {
			$scope.selectedCertifications.forEach(function(element, index) {
				if(!!element.monthOfCert) {
					$scope.certifications.forEach(function(inde){
						if(inde.certficationName == element.certficationName) {
							this.dateInMonths = (inde.years * 12 + parseInt(inde.months)).toString();
							element.dateInMonths = this.dateInMonths;
							delete element.yearOfCert;
							delete element.monthOfCert;
							$scope.flag = false;
						}
					});
					for (var _a = 0, _b = docObj.certifications; _a < _b.length; _a++) {
		                var cert = _b[_a];
		                if (cert.certficationName === element.certficationName && cert.dateInMonths !== element.dateInMonths) {
		                    docObj.certifications.splice(_a,1);
							$scope.flag = true;
		                }
		            }
				} else {
					$scope.selectedCertifications.forEach(function(indes){
						if(indes.certficationName == element.certficationName) {
							this.dateInMonths = (indes.years * 12 + parseInt(indes.months)).toString();
							element.dateInMonths = this.dateInMonths;
							delete element.years;
							delete element.months;
							$scope.flag = true;
						}
					});
				}
				
				if($scope.flag){
					docObj.certifications.push(element)
				}
			});
			if($scope.selectedCertifications.length == 0) {
				docObj.certifications = [];
			}
        	for (var i = 0; i < docObj.certifications.length ; i++) {
				if(docObj.certifications[i].dateInMonths % 12 === 0) {
					docObj.certifications[i].yearOfCert = parseInt((docObj.certifications[i].dateInMonths / 12)-1);
					docObj.certifications[i].monthOfCert = 12;
				} else {
					docObj.certifications[i].yearOfCert = parseInt(docObj.certifications[i].dateInMonths / 12);
					docObj.certifications[i].monthOfCert = docObj.certifications[i].dateInMonths % 12;
				}
				switch (!!docObj.certifications[i].monthOfCert) {
					case docObj.certifications[i].monthOfCert === 12:
						docObj.certifications[i].monthOfCert = "December"
						break;
					case docObj.certifications[i].monthOfCert === 1:
						docObj.certifications[i].monthOfCert = "January"
						break;
					case docObj.certifications[i].monthOfCert === 2:
						docObj.certifications[i].monthOfCert = "February"
						break;
					case docObj.certifications[i].monthOfCert === 3:
						docObj.certifications[i].monthOfCert = "March"
						break;
					case docObj.certifications[i].monthOfCert === 4:
						docObj.certifications[i].monthOfCert = "April"
						break;
					case docObj.certifications[i].monthOfCert === 5:
						docObj.certifications[i].monthOfCert = "May"
						break;
					case docObj.certifications[i].monthOfCert === 6:
						docObj.certifications[i].monthOfCert = "June"
						break;
					case docObj.certifications[i].monthOfCert === 7:
						docObj.certifications[i].monthOfCert = "July"
						break;
					case docObj.certifications[i].monthOfCert === 8:
						docObj.certifications[i].monthOfCert = "August"
						break;
					case docObj.certifications[i].monthOfCert === 9:
						docObj.certifications[i].monthOfCert = "September"
						break;
					case docObj.certifications[i].monthOfCert === 10:
						docObj.certifications[i].monthOfCert = "October"
						break;
					case docObj.certifications[i].monthOfCert === 11:
						docObj.certifications[i].monthOfCert = "November"
						break;

				}
			}
			$uibModalInstance.close();
		};
		//Cancelling speciality update modal
		$scope.cancel = function() {
			for (var i = 0; i < docObj.certifications.length ; i++) {
				if(docObj.certifications[i].dateInMonths % 12 === 0) {
					docObj.certifications[i].yearOfCert = parseInt((docObj.certifications[i].dateInMonths / 12)-1);
					docObj.certifications[i].monthOfCert = 12;
				} else {
					docObj.certifications[i].yearOfCert = parseInt(docObj.certifications[i].dateInMonths / 12);
					docObj.certifications[i].monthOfCert = docObj.certifications[i].dateInMonths % 12;
				}
				switch (!!docObj.certifications[i].monthOfCert) {
					case docObj.certifications[i].monthOfCert === 12:
						docObj.certifications[i].monthOfCert = "December"
						break;
					case docObj.certifications[i].monthOfCert === 1:
						docObj.certifications[i].monthOfCert = "January"
						break;
					case docObj.certifications[i].monthOfCert === 2:
						docObj.certifications[i].monthOfCert = "February"
						break;
					case docObj.certifications[i].monthOfCert === 3:
						docObj.certifications[i].monthOfCert = "March"
						break;
					case docObj.certifications[i].monthOfCert === 4:
						docObj.certifications[i].monthOfCert = "April"
						break;
					case docObj.certifications[i].monthOfCert === 5:
						docObj.certifications[i].monthOfCert = "May"
						break;
					case docObj.certifications[i].monthOfCert === 6:
						docObj.certifications[i].monthOfCert = "June"
						break;
					case docObj.certifications[i].monthOfCert === 7:
						docObj.certifications[i].monthOfCert = "July"
						break;
					case docObj.certifications[i].monthOfCert === 8:
						docObj.certifications[i].monthOfCert = "August"
						break;
					case docObj.certifications[i].monthOfCert === 9:
						docObj.certifications[i].monthOfCert = "September"
						break;
					case docObj.certifications[i].monthOfCert === 10:
						docObj.certifications[i].monthOfCert = "October"
						break;
					case docObj.certifications[i].monthOfCert === 11:
						docObj.certifications[i].monthOfCert = "November"
						break;

				}
			}
			$uibModalInstance.dismiss('cancel');
		};
		$scope.clearAll = function() {
			for(var i = 0, len = ($scope.selectedCertifications).length; i < len; i++) {
		        $scope.selectedCertifications.pop();
		        $scope.selected = false;
		        $scope.arrayOfCerts = [];
			}
		};
		//Pushing speciality when a check box is clicked on the modal
		$scope.addCertification = function(item, selected) {
			if (selected) {
				flag = true;
				for(var i = 0, len = ($scope.selectedCertifications).length; i < len; i++) {
				    if ($scope.selectedCertifications[i].certficationName === item.certficationName) {
				        flag= false;
				    }
				}
				if(flag) {
					$scope.selectedCertifications.push(item);
					$scope.arrayOfCerts = $scope.selectedCertifications.map(function(e){
				        return e.certficationName;
				    }) 
				}
			}else{
				cond = false;
				for(var i = 0, len = ($scope.selectedCertifications).length; i < len; i++) {
				    if ($scope.selectedCertifications[i].certficationName === item.certficationName) {
				    	inde = i
				        cond= true;
				    }
				}
				if(cond) {
					$scope.selectedCertifications.splice(inde,1);
					docObj.certifications.splice(inde,1);
					$scope.arrayOfCerts = $scope.selectedCertifications.map(function(e){
				        return e.certficationName;
				    }) 
				}
			}
		};
		for (var i = 0; i < docObj.certifications.length ; i++) {
			if(docObj.certifications[i].dateInMonths % 12 === 0) {
				docObj.certifications[i].yearOfCert = parseInt((docObj.certifications[i].dateInMonths / 12)-1);
				docObj.certifications[i].monthOfCert = 12;
			} else {
				docObj.certifications[i].yearOfCert = parseInt(docObj.certifications[i].dateInMonths / 12);
				docObj.certifications[i].monthOfCert = docObj.certifications[i].dateInMonths % 12;
			}
			switch (!!docObj.certifications[i].monthOfCert) {
				case docObj.certifications[i].monthOfCert === 12:
					docObj.certifications[i].monthOfCert = "December"
					break;
				case docObj.certifications[i].monthOfCert === 1:
					docObj.certifications[i].monthOfCert = "January"
					break;
				case docObj.certifications[i].monthOfCert === 2:
					docObj.certifications[i].monthOfCert = "February"
					break;
				case docObj.certifications[i].monthOfCert === 3:
					docObj.certifications[i].monthOfCert = "March"
					break;
				case docObj.certifications[i].monthOfCert === 4:
					docObj.certifications[i].monthOfCert = "April"
					break;
				case docObj.certifications[i].monthOfCert === 5:
					docObj.certifications[i].monthOfCert = "May"
					break;
				case docObj.certifications[i].monthOfCert === 6:
					docObj.certifications[i].monthOfCert = "June"
					break;
				case docObj.certifications[i].monthOfCert === 7:
					docObj.certifications[i].monthOfCert = "July"
					break;
				case docObj.certifications[i].monthOfCert === 8:
					docObj.certifications[i].monthOfCert = "August"
					break;
				case docObj.certifications[i].monthOfCert === 9:
					docObj.certifications[i].monthOfCert = "September"
					break;
				case docObj.certifications[i].monthOfCert === 10:
					docObj.certifications[i].monthOfCert = "October"
					break;
				case docObj.certifications[i].monthOfCert === 11:
					docObj.certifications[i].monthOfCert = "November"
					break;

			}
		}
	}
}