/** @ngInject */
export function titleCaseFilter(){
	return function(input) {
		var output;
		if(input){
			input = input.toString().toLowerCase();
			var test = input.split(" ");
			for (var i = 0; i < test.length; i++) {
				var arraytest = test[i].split("");
				if(!!arraytest[0]){
					arraytest[0] = arraytest[0].toUpperCase();					
				}
				test[i] = arraytest.join("");
				if(!output){
					output = test[i];
				}else{
					output = output + " " + test[i];
				}
			};
		}
		else{
			output = '';
		}
		return output;
    }
}

