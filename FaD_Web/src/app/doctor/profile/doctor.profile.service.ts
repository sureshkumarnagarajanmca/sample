export class DoctorProfileService {
  public specialities: any;
  public apiHost: string;
  /** @ngInject */
  constructor(private $log: angular.ILogService, 
    private $http: angular.IHttpService, private hosts: any, public DoctorProfileFactory: any,
    public $httpParamSerializer:any, public moment:any,  public errorHandling: any) {
    this.apiHost = hosts.node.url;
    this.specialities = [];
    this.$httpParamSerializer = $httpParamSerializer;
  }

  querySpecialities(): angular.IPromise<any[]> {
    let that = this;
    return this.$http.get(this.apiHost + '/api/taxonomy/level/nodivision/2', {
      //params:{} Params to be sent are to be added here
    })
      .then((response: any): any => {
        that.DoctorProfileFactory.specialities = response.data;
        return response.data;
      })
      .catch((error: any): any => {
        this.$log.error('Failed to get taxonomies\n', error.data);
      });
  }
  queryNpi(npi:any): angular.IPromise<any[]> {
    let that = this;
    let npi = this.npi;
    return this.$http.get(this.apiHost + '/api/doctors/npi/' + npi)
      .then((response: any): any => {
          return response.data;  
      })
      .catch((error: any): any => {
        this.$log.error('Failed to get taxonomies\n', error.data);
      });
  }
  querySubSpecialities(): angular.IPromise<any[]> {
    let that = this;
    return this.$http.get(this.apiHost + '/api/taxonomy/level/nodivision/3', {
      //params:{} Params to be sent are to be added here
    })
      .then((response: any): any => {
        that.DoctorProfileFactory.subSpecialities = response.data;
        return response.data;
      })
      .catch((error: any): any => {
        this.$log.error('Failed to get taxonomies\n', error.data);
      });
  }

  queryDoctor(userId:string): angular.IPromise<any[]>{
   let docId = this.DoctorProfileFactory.docId;
    // let docId = "586bfb8c7fd655b077361972";
	if (typeof(docId) === 'undefined' ) {
		docId = userId;
	}
    return this.$http.get(this.apiHost + '/api/doctors/' + docId, {
      //params:{} Params to be sent are to be added here
    })
      .then((response: any): any => {
        this.DoctorProfileFactory.originalDocObj = response.data;
        return response.data;
      })
      .catch((error: any): any => {
        this.$log.error('Failed to get taxonomies\n', error.data);
      });
  }

  updateDoctor(){
    let doctorUserId = this.DoctorProfileFactory.docId;
    // let doctorUserId = '58230d6ffdb89ecf55b5ffbf';
    // let doctorUpdateObj = this.DoctorProfileFactory.originalDocObj;

    /* if(!!this.DoctorProfileFactory.originalDocObj.fName){
          var payload = {
          };
          // payload.fName
          // payload.taxonomy = this.DoctorProfileFactory.originalDocObj.taxonomy.map(function(e){
          //     return e._id;
          // })  

          // payload.otherAddress = this.DoctorProfileFactory.originalDocObj.otherAddress.map(function(e){
          //     delete e['$$hashKey'];
          //     return e;
          // });
		
          this.DoctorProfileFactory.stagedDocObj.taxonomy = this.DoctorProfileFactory.stagedDocObj.taxonomy.map(function(e){
              return e._id;
          })
          this.DoctorProfileFactory.stagedDocObj.pSubSpeciality = this.DoctorProfileFactory.stagedDocObj.pSubSpeciality.map(function(e){
              return e._id;
          })
		  
          this.DoctorProfileFactory.stagedDocObj.medicalSchoolName = this.DoctorProfileFactory.stagedDocObj.medicalSchoolName.map(function(e){
              e.collegeId = e.collegeId._id;
              e.taxanomyId = e.taxanomyId._id;
              return e;
          });  
          this.DoctorProfileFactory.stagedDocObj.languagesSpoken = this.DoctorProfileFactory.stagedDocObj.languagesSpoken.map(function(e){
              return e._id;
          });
          this.DoctorProfileFactory.stagedDocObj.insuranceIds = this.DoctorProfileFactory.stagedDocObj.insuranceIds.map(function(e){
              return e._id;
          });

            this.DoctorProfileFactory.stagedDocObj.otherAddress = this.DoctorProfileFactory.stagedDocObj.otherAddress.map(function(e){
              delete e['$$hashKey'];
              if(e['Line2StreetAddress'] == null) {
                e['Line2StreetAddress'] = " ";
              }
              if(typeof e.geoLocation.location.lat !== 'string') {
                e.geoLocation.location.lat = (e.geoLocation.location.lat).toString();
                e.geoLocation.location.lon = (e.geoLocation.location.lon).toString();
              }
              return e;
            });

           this.DoctorProfileFactory.stagedDocObj.updateDate = moment()*1.toString();
          // let doctorUpdateObj = JSON.stringify(this.DoctorProfileFactory.stagedDocObj);
    }else{
        if(!!this.DoctorProfileFactory.stagedDocObj.taxonomy){
          this.DoctorProfileFactory.stagedDocObj.taxonomy = this.DoctorProfileFactory.stagedDocObj.taxonomy.map(function(e){
              return e._id;
          })
        }

        if(!!this.DoctorProfileFactory.stagedDocObj.otherAddress){
            this.DoctorProfileFactory.stagedDocObj.otherAddress = this.DoctorProfileFactory.stagedDocObj.otherAddress.map(function(e){
              delete e['$$hashKey'];
              return e;
            });
        }

        if(!!this.DoctorProfileFactory.stagedDocObj.insuranceIds){
          this.DoctorProfileFactory.stagedDocObj.insuranceIds = this.DoctorProfileFactory.stagedDocObj.insuranceIds.map(function(e){
            return e._id;
          })    
        }
       this.DoctorProfileFactory.stagedDocObj.updateDate = moment()*1.toString();
         
        let doctorUpdateObj = JSON.stringify(this.DoctorProfileFactory.stagedDocObj);
    } */
	
		var taxonomy = [];
		var i = 0;
		console.log('0 ',this.DoctorProfileFactory.stagedDocObj.taxonomy);
		angular.forEach(this.DoctorProfileFactory.stagedDocObj.taxonomy, function(value, key) {
			taxonomy[i++] = value._id;
		});
		this.DoctorProfileFactory.stagedDocObj.taxonomy = taxonomy;
		
		var pSubSpeciality = [];
		var i = 0;
		console.log('2 ',this.DoctorProfileFactory.stagedDocObj.pSubSpeciality);
		angular.forEach(this.DoctorProfileFactory.stagedDocObj.pSubSpeciality, function(value, key) {
			pSubSpeciality[i++] = value._id;
		});
		this.DoctorProfileFactory.stagedDocObj.pSubSpeciality = pSubSpeciality;
		
		var medicalSchoolName = [];
		var i = 0;
		console.log('3 ',this.DoctorProfileFactory.stagedDocObj.medicalSchoolName);
		angular.forEach(this.DoctorProfileFactory.stagedDocObj.medicalSchoolName, function(value, key) {
			medicalSchoolName[i].collegeId = value.collegeId._id;
			medicalSchoolName[i].taxanomyId = value.taxanomyId._id;
			i++;
		});
		this.DoctorProfileFactory.stagedDocObj.medicalSchoolName = medicalSchoolName;
		
		var languagesSpoken = [];
		var i = 0;
		console.log('4 ',this.DoctorProfileFactory.stagedDocObj.languagesSpoken);		
		angular.forEach(this.DoctorProfileFactory.stagedDocObj.languagesSpoken, function(value, key) {
			languagesSpoken[i++] = value._id;
		});
		this.DoctorProfileFactory.stagedDocObj.languagesSpoken = languagesSpoken;
		
		var insuranceIds = [];
		var i = 0;
		console.log('5 ',this.DoctorProfileFactory.stagedDocObj.insuranceIds);		
		angular.forEach(this.DoctorProfileFactory.stagedDocObj.insuranceIds, function(value, key) {
			insuranceIds[i++] = value._id;
		});
		this.DoctorProfileFactory.stagedDocObj.insuranceIds = insuranceIds;
		
		var otherAddress = [];
		var i = 0;
		console.log('6 ',this.DoctorProfileFactory.stagedDocObj.otherAddress);		
		angular.forEach(this.DoctorProfileFactory.stagedDocObj.otherAddress, function(value, key) {
			delete this.DoctorProfileFactory.stagedDocObj.otherAddress[key]['$$hashKey'];
			if(this.DoctorProfileFactory.stagedDocObj.otherAddress[key]['Line2StreetAddress'] == null) {
				this.DoctorProfileFactory.stagedDocObj.otherAddress[key]['Line2StreetAddress'] = " ";
			}
			if(typeof this.DoctorProfileFactory.stagedDocObj.otherAddress[key].geoLocation.location.lat !== 'string') {
				this.DoctorProfileFactory.stagedDocObj.otherAddress[key].geoLocation.location.lat = (this.DoctorProfileFactory.stagedDocObj.otherAddress[key].geoLocation.location.lat).toString();
				this.DoctorProfileFactory.stagedDocObj.otherAddress[key].geoLocation.location.lon = (this.DoctorProfileFactory.stagedDocObj.otherAddress[key].geoLocation.location.lon).toString();
			}
			otherAddress[i++] = this.DoctorProfileFactory.stagedDocObj.otherAddress[key];
		});
		this.DoctorProfileFactory.stagedDocObj.otherAddress = otherAddress;		
		
		this.DoctorProfileFactory.stagedDocObj.updateDate = moment()*1.toString();
	
	
    return this.$http.put(this.apiHost + '/api/doctors/'+doctorUserId,
       // return this.$http.put(this.apiHost + '/api/doctors/586bfb8c7fd655b077361972',
    this.DoctorProfileFactory.stagedDocObj)
      .then((response: any): any => {
        //this.DoctorProfileFactory.originalDocObj = response.data;
        return response.data;
      })
      .catch((error: any): any => {
        this.$log.error('Failed to get taxonomies\n', error.data);
      });
  }

  verifyOTP(params: any): angular.IPromise<any[]> {

    var that = this;
    return this.$http.post(this.apiHost + '/api/user/verifyOtpOnSignup',
      params).then((response: any): any => {
        return response.data;
      })
      .catch((error: any): any => { 
        throw this.errorHandling.otpError(error.data.errCode);
        // this.$log.error('OTP verification failed\n', error.data);
      });
  }
  addNewHospital(params: any): angular.IPromise<any[]> {

    var that = this;
    return this.$http.post(this.apiHost + '/api/hospital',
      params).then((response: any): any => {
        return response.data;
      })
      .catch((error: any): any => { 
        throw this.errorHandling.otpError(error.data.errCode);
        // this.$log.error('OTP verification failed\n', error.data);
      });
  }
  addNewOrganization(params: any): angular.IPromise<any[]> {

    var that = this;
    return this.$http.post(this.apiHost + '/api/organization',
      params).then((response: any): any => {
        return response.data;
      })
      .catch((error: any): any => { 
        throw this.errorHandling.otpError(error.data.errCode);
        // this.$log.error('OTP verification failed\n', error.data);
      });
  }
  sendOTP(params: any): angular.IPromise<any[]> {
    var that = this;
    return this.$http.get(this.apiHost + '/api/user/regenerateotponsignup', {
      "params": params
    }).then((response: any): any => {
        return response.data;
      })
      .catch((error: any): any => {
        throw this.errorHandling.otpError(error.data.errCode);
      });
  }

  signupDoctor(params:any): angular.IPromise<any[]>{
    return this.$http.post(this.apiHost + '/api/users/signup', params)
      .then((response: any): any => {
          return response.data;  
      })
      .catch((error: any): any => {
        // return error.data;
        // if(error.data.hasOwnProperty("errorCode")){
          throw this.errorHandling.signUpErrorHandler(error.data.errCode);
        // }
        this.$log.error('Failed to signup\n', error.data);
      }); 
  }

  queryOrganizations(searchText: any, stateCode: any, city : any ): angular.IPromise<any[]> {
    var query = "";
      if(!!searchText){
        query = 'searchText=' + searchText;
      }
      if(!!stateCode){
        if(!!query){
          query = query+"&"+'stateCode=' + stateCode;
        }else{
          query = 'stateCode=' + stateCode;
        }
      }
      if(!!city){
        if(!!query){
          query = query+"&"+'city=' + city;
        }else{
          query = 'city=' + city;
        }
      }

      return this.$http.get(this.apiHost + '/api/organization?' + query, {
      })
      .then((response: any): any => {
        return response.data;
      })
      .catch((error: any): any => {
        this.$log.error('Failed to get taxonomies\n', error.data);
      });
  }

    queryHospitalAffliations(searchText: any, stateCode: any, city : any ): angular.IPromise<any[]> {
      var query = "";
      if(!!searchText){
        query = 'searchText=' + searchText;
      }
      if(!!stateCode){
        if(!!query){
          query = query+"&"+'stateCode=' + stateCode;
        }else{
          query = 'stateCode=' + stateCode;
        }
      }
      if(!!city){
        if(!!query){
          query = query+"&"+'city=' + city;
        }else{
          query = 'city=' + city;
        }
      }

    return this.$http.get(this.apiHost + '/api/hospital?' + query, {
    })
      .then((response: any): any => {
        return response.data;
      })
      .catch((error: any): any => {
        this.$log.error('Failed to get taxonomies\n', error.data);
      });
  } 
  queryMedicalSchools(searchText: any, country: any, stateCode : any ): angular.IPromise<any[]> {
      var query = "";
      if(!!searchText){
        query = 'searchText=' + searchText;
      }
      if(!!country){
        if(!!query){
          query = query+"&"+'country=' + country;
        }else{
          query = 'country=' + country;
        }
      }
      if(!!stateCode){
        if(!!query){
          query = query+"&"+'state=' + stateCode;
        }else{
          query = 'state=' + stateCode;
        }
      }
      // if(!!city){
      //   if(!!query){
      //     query = query+"&"+'city=' + city;
      //   }else{
      //     query = 'city=' + city;
      //   }
      // }

    return this.$http.get(this.apiHost + '/api/medicalSchool?' + query, {
    })
      .then((response: any): any => {
        return response.data;
      })
      .catch((error: any): any => {
        this.$log.error('Failed to get taxonomies\n', error.data);
      });
  } 
