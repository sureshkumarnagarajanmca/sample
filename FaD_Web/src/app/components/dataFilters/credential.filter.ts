/** @ngInject */
export function credentialFilter() {
	return function(input) {
		return (!!input) ? input.split("\.").join("").split("\s").join("").trim() : '';
    }
}