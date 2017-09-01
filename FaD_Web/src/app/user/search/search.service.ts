
//This class is used to share data btween the search filter and search results page
export class SearchService {
  public apiHost: string;
  public defaultSearchFilterObj: any;
  private searchResults: any;
  private searchFilter: any;
  private specialities: any;
  private illness: any;
  public searchFilterObjs: any;
  public  currentLocation: any;
  public  savedLocation: any;
  public selectedIllness: any;
  public illness: any;

  /** @ngInject */
  constructor(private $log: angular.ILogService, 
              private $http: angular.IHttpService, 
              private hosts: any,
              public CacheFactory: any) {
    this.apiHost = hosts.node.url;
    this.currentLocation = {};
    this.savedLocation = {}
    this.selectedIllness = {};
    this.illness = [];
    
    //building temp search object
    this.searchFilter = {
                          "params":{

                          }
                        };
    this.searchResults = {};
    this.querySpecialities();
    this.searchFilterObjs = {
      "date":"",
      "insurance":"",
      "speciality":""
    };
	this.defaultSearchFilterObj = {
		"radius": 5,
		"sortName": "distance",
		"sortType":"asc",
		"gender": "",
		"name":""
	};
  }

  fireSearch(): angular.IPromise<any[]> {
    //temp code, setting page size to 5
    var that = this;
    this.searchFilter.params.size = 10;
    if(!this.searchFilter.params.lat) {
      var searchCache = that.CacheFactory.get('searchDetails');
      var locationCache = that.CacheFactory.get('locationDetails');
      var specialtyCache = that.CacheFactory.get('specialtyDetails');
      var illnessCache = that.CacheFactory.get('illnessDetails');
      var searchFilter = searchCache.get('location');
      var currentLocation = locationCache.get('currentLocation');
      var specialitySelected = specialtyCache.get('selectedSpecialty');
      var illness = illnessCache.get('illness');
      this.searchFilter = searchFilter;
      this.currentLocation = currentLocation;
      this.specialitySelected = specialitySelected;
      this.illness = illness;
    }
    return this.$http.post(this.apiHost + '/api/search', 
      this.searchFilter)
      .then((response: any): any => {
      this.searchResults = response.data;
        var searchCache = that.CacheFactory.get('searchDetails');
        var locationCache = that.CacheFactory.get('locationDetails');
        var specialtyCache = that.CacheFactory.get('specialtyDetails');
        var illnessCache = that.CacheFactory.get('illnessDetails');
        searchCache.put('location', this.searchFilter);
        locationCache.put('currentLocation', this.currentLocation);
        specialtyCache.put('selectedSpecialty', this.specialitySelected);
        illnessCache.put('illness', this.illness  );
        return response.data;
      })
      .catch((error: any): any => {
        this.$log.error('Failed to get Search results\n', error.data);
      });
  }

  fireSearchFromDoctorProfileForNExtAndPreviousDoctors(payload): angular.IPromise<any[]> {
    return this.$http.post(this.apiHost + '/api/search', 
      payload)
      .then((response: any): any => {
        return response.data;
      })
      .catch((error: any): any => {
        this.$log.error('Failed to get Search results\n', error.data);
      });
  }
  sendMessage(payload): angular.IPromise<any[]> {
    return this.$http.post(this.apiHost + '/api/support/sendMail', 
      payload)
      .then((response: any): any => {
        return response.data;
      })
      .catch((error: any): any => {
        this.$log.error('Failed to get Search results\n', error.data);
      });
  }
  getSearchResults(){
    return this.searchResults; 
  }

  setSearchResults(data){
    this.searchResults = data;
  }

  getSearchFilter(){
    return this.searchFilter;
  }

  setSearchFilter(attr,value){
    this.searchFilter.params[attr] = value;
  }

  //This object is used in search results page to pre fill the main search results
  setSearchFilterObjs(obj){
    this.searchFilterObjs = obj;
  }

  getSearchFilterObjs(){
    return this.searchFilterObjs;
  }

  getSpecialities(){
    return this.specialities;
  }

  getIllness(){
    return this.illness;
  }

  querySpecialities(limit: number = 30): angular.IPromise<any[]> {
    return this.$http.get(this.apiHost + '/api/taxonomy/level/nodivision/2', {

    })
      .then((response: any): any => {
        this.specialities = response.data;
        return response.data;
      })
      .catch((error: any): any => {
        this.$log.error('Failed to get taxonomies\n', error.data);
      });
  }

  queryIllness(parentCode:string):angular.IPromise<any[]>{
    var params = {
      "parentCode":parentCode
    }
    return this.$http.get(this.apiHost + '/api/taxonomy/level/nodivision/4', { "params":params })
      .then((response: any): any => {
        this.illness = response.data;
        return response.data;
      })
      .catch((error: any): any => {
        this.$log.error('Failed to get taxonomies\n', error.data);
      });
  }

  getDoctor(userId): angular.IPromise<any[]> {
    var that = this;
    return this.$http.get(this.apiHost + '/api/doctors/' + userId, {
      // return this.$http.get(this.apiHost + '/api/doctors/npi/1417957697', {
    }).then((response: any): any => {
      return response.data;
      })
      .catch((error: any): any => {
        this.$log.error('Failed to get doctor object\n', error.data);
      });
  }

}
