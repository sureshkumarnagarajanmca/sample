export class CityByStateService {
  public cities: any;
  public apiHost: string;
  /** @ngInject */
  constructor(private $log: angular.ILogService, private $http: angular.IHttpService, private hosts: any) {
    this.apiHost = hosts.node.url;
    this.cities = [];
    this.states = [];
  }

  getCities(stateCode:any): angular.IPromise<any[]> {
    let that = this;
    var query = "";
    if(!!stateCode){
    	query = 'stateCode='+stateCode
    }
    return this.$http.get(this.apiHost + '/api/hospital/cities?'+query, {
      //params:{} Params to be sent are to be added here
    })
      .then((response: any): any => {
        this.cities = response.data;
        return response.data;
      })
      .catch((error: any): any => {
        this.$log.error('Failed to get affiliations\n', error.data);
      });
  }
  getCitiesForPractice(stateCode:any): angular.IPromise<any[]> {
    let that = this;
    var query = "";
    if(!!stateCode){
      query = 'stateCode='+stateCode
    }
    return this.$http.get(this.apiHost + '/api/organization/cities?'+query, {
      //params:{} Params to be sent are to be added here
    })
      .then((response: any): any => {
        this.cities = response.data;
        return response.data;
      })
      .catch((error: any): any => {
        this.$log.error('Failed to get affiliations\n', error.data);
      });
  }
  getStatesForMedical(country:any): angular.IPromise<any[]> {
    let that = this;
    var query = "";
    if(!!country){
      query = 'country='+country
    }
    return this.$http.get(this.apiHost + '/api/medicalSchool/states?'+query, {
      //params:{} Params to be sent are to be added here
    })
      .then((response: any): any => {
        this.states = response.data;
        return response.data;
      })
      .catch((error: any): any => {
        this.$log.error('Failed to get affiliations\n', error.data);
      });
  }

} 
