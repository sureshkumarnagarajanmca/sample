export class DoctorService{
	public apiHost: string;
	public docObj: any;//commonly referenced object for displaying data accross dashboard, profile
	// public docUserId: any;

	/** @ngInject */
	constructor(private $log: angular.ILogService, private $http: angular.IHttpService, private hosts: any, private moment: any) {
		this.apiHost = hosts.node.url;
	}

	//get doctor details for currently logged in doctor
	getDoctor(userId): angular.IPromise<any[]> {
		var that = this;
		return this.$http.get(this.apiHost + '/api/doctors/' + userId, {
		// return this.$http.get(this.apiHost + '/api/doctors/npi/1417957697', {
		}).then((response: any): any => {
				that.docObj = response.data;
				return response.data;
			})
			.catch((error: any): any => {
				this.$log.error('Failed to get doctor object\n', error.data);
			});
	}

	//update details for the currently logged in doctor
	updateDoctor(docUserId:string,docObj:any) {
		var that = this;
		docObj.taxonomy = docObj.taxonomy.map(function(e){
	        return e._id;
	    }) 
		docObj.pSubSpeciality = docObj.pSubSpeciality.map(function(e){
	        return e._id;
	    }) 
	    docObj.languagesSpoken = docObj.languagesSpoken.map(function(e){
	        return e._id;
	    });
	    docObj.insuranceIds = docObj.insuranceIds.map(function(e){
	        return e._id;
	    });
	    docObj.medicalSchoolName = docObj.medicalSchoolName.map(function(e){
	     	e.collegeId = e.collegeId._id;
	     	e.taxanomyId = e.taxanomyId._id;
	        return e;
	    });	  
	    docObj.updateDate = moment()*1.toString();
	    // let doctorUpdateObj = JSON.stringify(docObj);
		return this.$http.put(this.apiHost + '/api/doctors/' + docUserId,
			docObj)
			.then((response: any): any => {
				that.docObj = response.data;
				return response.data;
			})
			.catch((error: any): any => {
				this.$log.error('Failed to update doctor\n', error.data);
			});
	}
	// updateDoctorOnNext(docUserId:string,docObj:any) {
	// 	var that = this;
	//     docObj.updateDate = moment()*1.toString();
	//     // let doctorUpdateObj = JSON.stringify(docObj);
	// 	return this.$http.put(this.apiHost + '/api/doctors/' + docUserId,
	// 		docObj)
	// 		.then((response: any): any => {
	// 			that.docObj = response.data;
	// 			return response.data;
	// 		})
	// 		.catch((error: any): any => {
	// 			this.$log.error('Failed to update doctor\n', error.data);
	// 		});
	// }

	//get the details of doctor from user collection(ex:imageId)
	getDoctorInfo(userId: any): angular.IPromise<any[]> {
		return this.$http.get(this.apiHost + '/api/users/' + userId)
			.then((response: any): any => {
				return response.data;
			})
			.catch((error: any): any => {
				this.$log.error('Failed to get user information\n', error.data);
			});
	}
}