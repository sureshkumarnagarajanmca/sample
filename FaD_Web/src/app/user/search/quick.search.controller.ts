export class QuickSearchController {
	public url: string;
	public searchResults: any;
	public specialities: Array<String>;
	public insuranceProviders: Array<String>;
	public position: any;
	public currentLocation: any;
	public insuranceSelected: string;
	public specialitySelected: string;
	public selectedIllness: string;
	public carouselInterval: number;
	public carouselActive: number;
	public carouselSlides: any;
	public slide: string;
	public slideIndex: number;
	public params: string;

	/* @ngInject */
	constructor(public $scope: any, hosts: any, public SearchService: SearchService,
		public $state: angular.ui.IStateService, public SpecialityService: any,
		public InsuranceService: any,
		public LanguageService: any,
		public $filter: any,
		public $stateParams:any,
		public $q:any) {
		//preserving this for further use
		var that = this;
		//retrieving the params passed for the state
		this.params = this.$stateParams;	

		//loading the list of specialities(This list will be used in global level by the speciality filter)	
		this.SearchService.querySpecialities().then((data: any): any => {
			this.specialities = data;
			this.initiateQuickSearch(this.params);
		});

		// this.position = this.getGeolocation($scope);
		this.currentLocation = {};	

		//loading list of languages
		LanguageService.getLanguages();
	}

	initiateQuickSearch(params){
		var filter;
		for(var key in params){
			if(params[key]!= null){
				filter = key;
			}
		}

		switch (filter) {
			case "speciality":
				this.getGeolocation(this.$scope).then(()=>{
					this.specialityQuickSearch(params.speciality);
				});
				break;
			case "insurance":
				this.getGeolocation(this.$scope).then(() => {
					this.insuranceQuickSearch(params.insurance);
				});
				break;
			case "location":
				this.locationQuickSearch(params.location);
			default:
				// code...
				break;
		}
	}

	//speciality quick search
	specialityQuickSearch(speciality){
		if(!speciality){
			speciality = "PRIMTAXO1";//primary  care code
		}
		var filteredSpeciality = this.$filter("filter")(this.specialities, speciality)[0];
		this.specialitySelected = filteredSpeciality;
		this.SearchService.specialitySelected = this.specialitySelected;
		this.SearchService.setSearchFilter("specId", filteredSpeciality["_id"]);
		this.getSearchResults();
		//loading list of insurances(This list will be used in global level by insurance filter)
		this.InsuranceService.getInsurances().then((data: any) => {
			this.insuranceProviders = data;
		});
	}

	//insurance quick search
	insuranceQuickSearch(insurance) {
		//loading list of insurances(This list will be used in global level by insurance filter)
		var that = this;
		this.InsuranceService.getInsurances().then((data: any) => {
			this.insuranceProviders = data;
			invokeSearch(this);
		});
		function invokeSearch(that) {
			//speciality settings
			var speciality = "208D00000X";//primary  care code the default speciality
			var filteredSpeciality = that.$filter("filter")(that.specialities, speciality)[0];
			that.specialitySelected = filteredSpeciality;
			that.SearchService.specialitySelected = that.specialitySelected;
			that.SearchService.setSearchFilter("specId", filteredSpeciality["_id"]);

			//insurance settings
			var filteredInsurance = that.$filter("filter")(that.insuranceProviders, insurance)[0];
			that.insuranceSelected = filteredInsurance;
			that.SearchService.setSearchFilter("insuranceId", filteredInsurance["_id"]);
			that.getSearchResults();
		}			
	}

	//location quick search
	locationQuickSearch(location){
		var speciality = "208D00000X";//primary  care code the default speciality

		//setting default speciality as primariy speciality
		var filteredSpeciality = this.$filter("filter")(this.specialities, speciality)[0];
		this.specialitySelected = filteredSpeciality;
		this.SearchService.setSearchFilter("specId", filteredSpeciality["_id"]);
		this.SearchService.specialitySelected = this.specialitySelected;
		//setting the lat and long
		this.SearchService.setSearchFilter("lat", location.lat);
		this.SearchService.setSearchFilter("lon", location.lon);

		//getting the user location
		this.getUserAddress(this.$scope, location.lat, location.lon);
		this.getSearchResults();

		//loading list of insurances(This list will be used in global level by insurance filter)
		this.InsuranceService.getInsurances().then((data: any) => {
			this.insuranceProviders = data;
		});
	}

	getSearchResults() {
		//Load search results and navigate on load
		let that = this;	

		//setting the search filter objs to be used by the search results page
		if (this.specialitySelected) {
			this.SearchService.setSearchFilterObjs({
				"speciality": this.specialitySelected,
				"insurance": this.insuranceSelected
			});
		}

		// this.SearchService.setSearchFilter("lat", "34.31");
		// this.SearchService.setSearchFilter("lon", "-118.43");
		this.SearchService.fireSearch().then(function(data) {
			that.SearchService.setSearchResults(data);
			that.$state.go("search-results");
		});
	}


	//Getting the Geo Location from user
	getGeolocation($scope: any): angular.IPromise<any[]> {
		let that = this;
		var deferred = this.$q.defer();
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(successCallback,errorCallback);
		} else {
			deferred.reject();
		}
		function successCallback(position) {
			that.SearchService.setSearchFilter("lat", position.coords.latitude);
			that.SearchService.setSearchFilter("lon", position.coords.longitude);
			that.getUserAddress($scope, position.coords.latitude, position.coords.longitude);
			deferred.resolve();
		}

		function errorCallback(error) {
			//this code is usually reached when the user denies permission to access to his location
			//setting the default california lat log for release 1.0
			var lat = 36.778261;
			var lon = -119.41793239999998;
			that.SearchService.setSearchFilter("lat", lat);
			that.SearchService.setSearchFilter("lon", lon);
			that.getUserAddress($scope, lat, lon);
			deferred.resolve();
		}
		return deferred.promise;
	}

	getUserAddress($scope, lat, lng) {
		let geocoder = new google.maps.Geocoder();
		let latlng = new google.maps.LatLng(lat, lng);
		var that = this;
		geocoder.geocode({ 'latLng': latlng }, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					//formatted address
					//alert(results[0].formatted_address)
					//find country name
					for (var i = 0; i < results[0].address_components.length; i++) {
						for (var b = 0; b < results[0].address_components[i].types.length; b++) {
							//sublocality_level_1 - area
							//administrative_area_level_1 - state
							//locality - city
							if (results[0].address_components[i].types[b] == "locality") {
								//this is the object you are looking for
								$scope.$apply(function() {
									that.currentLocation = results[0];
									that.SearchService.currentLocation = results[0];
								});
								break;
							}
						}
					}

				} else {
					alert("No results found");
				}
			} else {
				alert("Geocoder failed due to: " + status);
			}
		});
	}
}
