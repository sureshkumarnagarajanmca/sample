/** @ngInject */
export function languageConverterFilter(LanguageService: any) {
	var languages = null;
	var isAPIInvoked = false;
	function languageConverter(input) {
		let output;
		if (languages !== null) {
			languages.forEach(function(languageObj, j) {
				if (languageObj["_id"] === input) {
					output = languageObj.languageName;
				}
			});
		}
		return output;
	}
	languageFilter.$stateful = true;
	function languageFilter(input){
		if(languages === null){
			if(!isAPIInvoked){
				isAPIInvoked = true;
				LanguageService.getLanguages().then(function(data){
					languages = data;
				});
			}
			else{
				return "-";
			}
		}
		else{
			return languageConverter(input);
		}

	}
	return languageFilter;
}