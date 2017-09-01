/** @ngInject */
export function httpInterceptor($q:any,CacheFactory:any) {
	return {
		'request': function(config) {
			var loginCache = CacheFactory.get('loginDetails');
			if(loginCache.get('authObj')){
				var authObj = loginCache.get('authObj');
				config.headers.accessToken = authObj.accessToken;
			}
			
			return config;
		},
		'response': function(response) {
			return response;
		}
	};
}