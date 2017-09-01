export class DoctorProfileSummaryService {
	private apiHost: string;

	/** @ngInject */
	constructor(private $log: angular.ILogService, private $http: angular.IHttpService, private hosts: any) {
		this.apiHost = hosts.node.url;
		
	}

	//get doctor details for currently logged in doctor
	getDoctor(userId): angular.IPromise<any[]> {
		var that = this;
		// return this.$http.get(this.apiHost + '/api/doctors/' + this.docUserId, {
		return this.$http.get(this.apiHost + '/api/doctors/'+userId, {
		}).then((response: any): any => {
			return response.data;
		})
			.catch((error: any): any => {
				this.$log.error('Failed to get doctor object\n', error.data);
			});
	}
}