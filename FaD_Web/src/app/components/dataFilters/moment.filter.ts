/** @ngInject */

export function momentFilter(public moment:any){
	return function(input) {
		var output;
		if(input){
			output = moment(input).format('lll');
		}
		else{
			output = '';
		}
		return output;
    }
}