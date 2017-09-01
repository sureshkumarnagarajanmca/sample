/** @ngInject */
export function certificationsFilter(CertificationService: any) {
	var certification = null;
	var certificationServiceInvoked = false;

	certificationFilter.$stateful = true;

	function certificationFilter(input){
		if(certification === null){
			if(!certificationServiceInvoked){
				certificationServiceInvoked = true;
				CertificationService.getCertification().then(function(result) {
					certification = result;
				});
			}
			else{
				return "-";
			}
		}
	}
	return certificationFilter;
}