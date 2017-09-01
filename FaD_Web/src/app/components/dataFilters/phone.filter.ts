/** @ngInject */
export function phoneFilter() {
	return function(input) {
		if(input){
			var x = input.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/);
			return '(' + x[1] + ') ' + x[2] + '-' + x[3];
		}
    }
}