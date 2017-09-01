export class UserProfileService {
	public apiHost: string;
	public userId: string;
	public userDetails: string;
	/** @ngInject */
	constructor(private $log: angular.ILogService, private $http: angular.IHttpService, private hosts: any, public DoctorProfileFactory: any) {
		this.apiHost = hosts.node.url;
	}
	getUser(userId: string): angular.IPromise<any[]> {
		var that = this;
		return this.$http.get(this.apiHost + '/api/users/' + userId)
			.then((response: any): any => {
				return response.data;
			})
			.catch((error: any): any => {
				this.$log.error('Failed to get user information\n', error.data);
		});
	}
	updateUser(userId:string,params: any): angular.IPromise<any[]>{

		return this.$http.put(this.apiHost + '/api/users/' + userId,params)
			.then((response: any): any => {
				return response.data;
			})
			.catch((error: any): any => {
				this.$log.error('Failed to get taxonomies\n', error.data);
		});
	}
	/*getUserImage(params: any): angular.IPromise<any[]> {
		return this.$http.get(this.apiHost + '/api/users/' + this.imageId, params)
			.then((response: any): any => {
				return response.data;
			})
			.catch((error: any): any => {
				this.$log.error('Failed to get taxonomies\n', error.data);
			});
	}*/
	createUser(params: any): angular.IPromise<any[]> {
		//setting object type to user
		params.type = "user";
		var that = this;
		return this.$http.post(this.apiHost + '/api/users/signup', params)
			.then((response: any): any => {
				that.userId = response.data.userId;
				return response.data;
			})
			.catch((error: any): any => {
				this.$log.error('Failed to get taxonomies\n', error.data);
			});
	} 
}