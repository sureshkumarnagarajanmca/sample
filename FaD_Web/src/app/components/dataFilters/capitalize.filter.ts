/** @ngInject */
export function capitalizeFilter(){
	return function(input) {
		var output;
		if(input){
			output = input.charAt(0).toUpperCase() + input.substr(1).toLowerCase();
			output = output.trim();
		}
		else{
			output = '';
		}
		return output;
    }
}