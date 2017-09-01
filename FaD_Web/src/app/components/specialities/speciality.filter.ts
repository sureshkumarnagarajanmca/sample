/** @ngInject */
export function specialityConverterFilter(SpecialityService: any,$q:any) {	

	var specialities = null;
	var isApiInvoked = false;

	function specialityConverter(input) {
		let output;

		if(specialities!==null){
			specialities[1].forEach(function(specObj, j) {
				if (specObj["_id"] === input) {
					output = specObj.title;
				}
			});
			specialities[2].forEach(function(specObj, j) {
				if (specObj["_id"] === input) {
					output = specObj.title;
				}
			});
			specialities[3].forEach(function(specObj, j) {
				if (specObj["_id"] === input) {
					output = specObj.title;
				}
			});
		}
					
			return output;
	}

	specialityFilter.$stateful = true;

	function specialityFilter(input){
		if(specialities == null){
			if(!isApiInvoked){
				isApiInvoked = true;
				var promises = [SpecialityService.querySpecialities(1), 
				SpecialityService.querySpecialities(2), 
				SpecialityService.querySpecialities(3)];
				$q.all(promises).then(function(){
					specialities = SpecialityService.specialities;
				});
			}
			else{
				return "-";
			}
		}
		return specialityConverter(input);

	}
	return specialityFilter;
}