/** @ngInject */
export function specialityFilter(DoctorProfileFactory:any) {
	return function(input){
		let output;
		if (typeof input !== 'undefined') {
			//Checking if taxaonomy code is matching any level 1 speciality
			DoctorProfileFactory.specialities.forEach(function(specObj, j) {
				if (specObj["_id"] === input) {
					output = specObj.title;
				}
			});
			//Checking if the taxonomy code is matching any level 2 speciality
			if(typeof output === 'undefined'){
				DoctorProfileFactory.subSpecialities.forEach(function(specObj, j) {
					if (specObj["_id"] === input) {
						output = specObj.title;
					}
				});
			}	
		}
		if (typeof output === 'undefined'){
			output = input;
		}
	return output;
	}
}