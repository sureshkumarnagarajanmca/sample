/** @ngInject */
export function insuranceConverterFilter(InsuranceService: any) {
	var insurances = null;
	var insuranceServiceInvoked = false;

	function insuranceConverter(input){
		var output;
		insurances.forEach(function(insuranceObj,index){
			if(insuranceObj["_id"] === input){
				output = insuranceObj.name;
			}
		});
		return output;
	}

	insuranceFilter.$stateful = true;

	function insuranceFilter(input){
		if(insurances === null){
			if(!insuranceServiceInvoked){
				insuranceServiceInvoked = true;
				InsuranceService.getInsurances().then(function(result) {
					insurances = result;
				});
			}
			else{
				return "-";
			}
		}
		else{
			return insuranceConverter(input);
		}
	}
	return insuranceFilter;
}