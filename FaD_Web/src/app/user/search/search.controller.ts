export class SearchController {
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
	public isActive: boolean;

	/* @ngInject */
	constructor(public $scope: any, hosts: any, public SearchService: SearchService, 
		public $state: angular.ui.IStateService, public SpecialityService: any, 
		public InsuranceService: any,
		public LanguageService: any,
		public $filter: any,
		public $location: any,
		public $window: any,
		public $timeout: any,
		public $anchorScroll: any,
		public CacheFactory:any,
		public $rootScope: any) {
		this.url = hosts.node.url;
		this.SearchService.selectedIllness = {}
		// this.insuranceProviders = ["Athena", "Blue Corss & Blue Shield", "Cigna", "United Health Care"];
		this.position = this.getGeolocation($scope);
		this.currentLocation = {};
		//Load taxanomies and insurance providers
		let that = this;
		$rootScope.$on('removeSpecialtyHolder',function(event,data){
			if(!!that.specialitySelected){
				$("#label").css("display", "block");	
			}else{
				$("#label").css("display", "none");
			}
			if(data){
				$("#label").css("display", "none");
			}
		});
		$(window).resize(function () {
		    var width = $(window).width();
		    var height = $(window).height();
		    //alert("width:"+ width + " and height:"+ height);
		    if(height < 550) {
		    	$('.footer').hide();
		    } else {
		    	$('.footer').show();

		    }
		});
		$rootScope.$on('removeInsuranceHolder',function(event,data){
			if(!!that.insuranceSelected){
				$("#label1").css("display", "block");	
			}else{
				$("#label1").css("display", "none");
			}
			if(data){
				$("#label1").css("display", "none");
			}
		});

		SearchService.test = 5000;
		// this.taxanomies = ["Cardiologist","Dentist","Gyancologist","Primary Care"];
		this.SearchService.querySpecialities().then(function(data) {
			that.specialities = data;
			
			//setting speciality to primary care as no speciality is selected by user
			var defaultSpeciality = "207Q00000X";//primary  care code
			var filteredSpeciality = that.$filter("filter")(that.specialities, defaultSpeciality);

			that.specialitySelected = filteredSpeciality[0];
		});
		// $('#itemLis').modal({keyboard:false});
		// $location.hash("search-page");
		//setting location on place change	
		// $scope.gPlace;
		// $scope.$watch('gPlace', function(changedPlace) {
		// 	if (typeof changedPlace !== "undefined") {
		// 		that.SearchService.currentLocation = changedPlace;
		// 		that.SearchService.setSearchFilter("lat", changedPlace.geometry.location.lat());
		// 		that.SearchService.setSearchFilter("lon", changedPlace.geometry.location.lng());
		// 	}
		// });
		// this.gPlace;
		// $scope.$watch('search.gPlace', function(changedPlace) {

		// 	if (typeof changedPlace !== "undefined") {
		// 		that.SearchService.currentLocation = changedPlace;
		// 		that.SearchService.setSearchFilter("lat", changedPlace.geometry.location.lat());
		// 		that.SearchService.setSearchFilter("lon", changedPlace.geometry.location.lng());
		// 	}
		// });

		
		//loading list of insurances(This list will be used in global level by insurance filter)
		
		InsuranceService.getInsurances().then((data: any) => {
			this.insuranceProviders = [{name : "I'll Choose My Insurance Later", popular : 100}];				
			this.insuranceProviders.push.apply(this.insuranceProviders, data);
		});
		
		//loading list of languages
		LanguageService.getLanguages();

		//carousel stuff
		this.carouselSlides = [];
		this.carouselSlides.push({
			image: "../../../assets/images/angular.png",
			text: "Find a Doctor",
			id: 1
		});
		this.carouselSlides.push({
			image: "../../../assets/images/bg-in-web.jpg",
			text: "Find a Doctor",
			id: 2
		});
		this.slide = "FaD-cover-container";
		this.slideIndex = 1;
		setTimeout(function(){
			$scope.$apply(
				function() { 
					that.slide = "FaD-cover-container1";
					that.slideIndex = 2;
				});
		},5000);

		//options for full page js
		$scope.fullPageConfig = {
			navigation: true,
			navigationPosition: 'right',
			scrollingSpeed: 500
		};

		//logged in user settings
		var loginCache = this.CacheFactory.get('loginDetails');
		var authObj = loginCache.get('authObj');
		if(authObj){
			$scope.loggedIn = true;
			$scope.loginType = authObj.loginType;
			$scope.userName = authObj.userName;
			$scope.userId = authObj.userId;
		}
	}



	  onSpecialtySelected = function (selectedItem) {
		  //do selectedItem.PropertyName like selectedItem.Name or selectedItem.Key 
		  //whatever property your list has.
		  $("#label").css("display", "block");
		  $("#label").css("z-index", "100");
		  $("#label").css("margin", "0");
		  $("#label").css("background-color", "transparent");
		  $("#label").css("color", "#fa5f5f");
		  $("#label").css("left", "10px");
		  $("#label").css("font-size", "14px");
		  
		}
		onInsuranceSelected = function (selectedItem) {
		  //do selectedItem.PropertyName like selectedItem.Name or selectedItem.Key 
		  //whatever property your list has.
		  $("#label1").css("display", "block");
		  $("#label1").css("z-index", "100");
		  $("#label1").css("margin", "0");
		  $("#label1").css("background-color", "transparent");
		  $("#label1").css("color", "#fa5f5f");
		  $("#label1").css("left", "10px");
		  $("#label1").css("font-size", "14px");
		}
	refresh() {
		location.reload();
		
		this.$location.hash("search-page");
		this.$anchorScroll();
		this.$location.hash("");
		}
	getSearchResults() {
		//Load search results and navigate on load
		let that = this;
		
		var sessionStorageSearchFilterObjFlag = this.$window.sessionStorage.sessionStorageSearchFilterObjFlag;
		if (typeof(sessionStorageSearchFilterObjFlag) === 'undefined' || sessionStorageSearchFilterObjFlag === false || sessionStorageSearchFilterObjFlag === 'false') {
			var defaultSearchFilterObj = this.SearchService.defaultSearchFilterObj;
			this.SearchService.setSearchFilter("radius", defaultSearchFilterObj.radius + 'mi');
			this.SearchService.setSearchFilter("sortName", defaultSearchFilterObj.sortName);
			this.SearchService.setSearchFilter("sortType", defaultSearchFilterObj.sortType);			
			this.SearchService.setSearchFilter("gender", defaultSearchFilterObj.gender);
			this.SearchService.setSearchFilter("name", defaultSearchFilterObj.name);
			this.$window.sessionStorage.setItem('sessionStorageSearchFilterObj', angular.toJson(defaultSearchFilterObj));
			this.$window.sessionStorage.sessionStorageSearchFilterObjFlag = true;
		} else {
			var sessionStorageSearchFilterObj = angular.fromJson(this.$window.sessionStorage.getItem('sessionStorageSearchFilterObj'));
			this.SearchService.setSearchFilter("radius", sessionStorageSearchFilterObj.radius + 'mi');
			this.SearchService.setSearchFilter("sortName", sessionStorageSearchFilterObj.sortName);
			this.SearchService.setSearchFilter("sortType", sessionStorageSearchFilterObj.sortType);
			this.SearchService.setSearchFilter("gender", sessionStorageSearchFilterObj.gender);
			this.SearchService.setSearchFilter("name", sessionStorageSearchFilterObj.name);
		}
		
		if(!this.SearchService.searchFilter.params.lat) {
			var lat = 36.778261;
			var lon = -119.41793239999998;
			this.SearchService.setSearchFilter("lat", lat);
			this.SearchService.setSearchFilter("lon", lon);
			this.getUserAddress(this.$scope, lat, lon);
		}

		if (this.specialitySelected) {
			this.SearchService.setSearchFilter("specId", this.specialitySelected["_id"]);	
		}
		this.SearchService.specialitySelected = this.specialitySelected;
		this.SearchService.queryIllness(this.specialitySelected["_id"]).then(function(data) {
			that.SearchService.illness = data;
		});

		//setting default insurance
		if (!this.insuranceSelected) {
			//code to populate default insurance in case of requirement
		}
		else {
			this.SearchService.setSearchFilter("insuranceId", this.insuranceSelected["_id"]);
		}

		//setting the search filter objs to be used by the search results page
		if(this.specialitySelected){
			this.SearchService.setSearchFilterObjs({
					"speciality":this.specialitySelected,
					"insurance": this.insuranceSelected
			});
		}
		
		// this.SearchService.setSearchFilter("lat", "34.31");
		// this.SearchService.setSearchFilter("lon", "-118.43");
		this.SearchService.fireSearch().then(function(data) {
			var sessionStorageSearchFilterObjFlag = that.$window.sessionStorage.sessionStorageSearchFilterObjFlag;
			if (typeof(sessionStorageSearchFilterObjFlag) === 'undefined' || sessionStorageSearchFilterObjFlag === false || sessionStorageSearchFilterObjFlag === 'false') {
				var defaultSearchFilterObj = that.SearchService.defaultSearchFilterObj;
				that.SearchService.sliderValue = defaultSearchFilterObj.radius;
			} else {
				var sessionStorageSearchFilterObj = angular.fromJson(that.$window.sessionStorage.getItem('sessionStorageSearchFilterObj'));
				that.SearchService.sliderValue = sessionStorageSearchFilterObj.radius;
			}
			that.SearchService.setSearchResults(data);
			that.$state.go("search-results");
		});
		this.SearchService.savedLocation = this.SearchService.currentLocation;
	}

	onBlurOfSerarch(){
		var that = this;
		geocodePlaceId();
		function geocodePlaceId() {
	        var placeId = that.SearchService.currentLocation.place_id;
	        let geocoder = new google.maps.Geocoder();
	        geocoder.geocode({'placeId': placeId}, function(results, status) {
	          if (status === 'OK') {
	            if (results[0]) {
	            	that.SearchService.currentLocation = results[0];
	            } else {
	              window.alert('No results found');
	            }
	          } else {
	            window.alert('Geocoder failed due to: ' + status);
	          }
	        });
	    }
	}
	//Getting the Geo Location from user
	getGeolocation($scope: any) {
		let that = this;
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(successCallback,errorCallback);
		} else {
		}

		function successCallback(position){
			console.log(position);
			that.SearchService.setSearchFilter("lat", position.coords.latitude);
			that.SearchService.setSearchFilter("lon", position.coords.longitude);
			that.getUserAddress($scope, position.coords.latitude, position.coords.longitude);
		}

		function errorCallback(error){
			//this code is usually reached when the user denies permission to access to his location
			//setting the default california lat log for release 1.0
			// var lat = 36.778261;
			// var lon = -119.41793239999998;
			//setting the default california lat log for northwell demo.
			// New york lat and lon
			// var lat = 40.717786;
			// var lon = -74.010944;
			var lat = 40.524463;
			var lon = -74.391134;
			that.SearchService.setSearchFilter("lat", lat);
			that.SearchService.setSearchFilter("lon", lon);
			that.getUserAddress($scope, lat, lon);
		}
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

	browseByService(service){
		var specialityIds = {
			dental: "122300000X",
			behavioral: "2084P0800X",
			medical: "208D00000X",
			urgent: "261QU0200X"
		};

		var specialityParentIds = {
			dental: "FADC1DEN_GP1",
			behavioral: "FADC3BEH_GP3",
			medical: "FADC2MED_GP2",
			urgent: "FADC4URG_GP4"
		}

		switch (service) {
			case "dental":	
				var obj = {};
				obj.specialityId = specialityIds.dental;
				obj.specialityParentId = specialityParentIds.dental;
				this.fireSearch(obj);
				break;
			case "behavioral":
				var obj = {};
				obj.specialityId = specialityIds.behavioral;
				obj.specialityParentId = specialityParentIds.behavioral;
				this.fireSearch(obj);
				break;
			case "medical":
				var obj = {};
				obj.specialityId = specialityIds.medical;
				obj.specialityParentId = specialityParentIds.medical;
				this.fireSearch(obj);
				break;
			case "urgent":
				var obj = {};
				obj.specialityId = specialityIds.urgent;
				obj.specialityParentId = specialityParentIds.urgent;
				this.fireSearch(obj);
				break;					
		}
	}

	//this method is primarily invoked when search invoked by clicking a service or category like(dental, urgent care etc.)
	fireSearch(obj){
		let that = this;
		if(obj.specialityId){
			var filteredSpeciality = this.$filter("filter")(this.specialities, obj.specialityId);
			var searchFilterObj = {};
			searchFilterObj.speciality = filteredSpeciality[0];
			searchFilterObj.parentSpecialityId = obj.specialityParentId;
			this.specialitySelected = filteredSpeciality[0];
			//setting params to be used in search results page
			this.SearchService.setSearchFilterObjs(searchFilterObj);
			this.SearchService.specialitySelected = this.specialitySelected;
			//setting speciality filter
			this.SearchService.setSearchFilter("specId", obj.specialityId);
			
		}
		this.SearchService.fireSearch().then(function(data) {
			that.SearchService.setSearchResults(data);
			that.$state.go("search-results");
			that.SearchService.setSearchFilter("specId", this.specialitySelected["_id"]);
			that.SearchService.setSearchFilter("boardCertification", this.isBoardCertified);
		});
	}

	//navigate to a div in page
	goTo(div){
		this.$location.hash(div);
		this.$anchorScroll();
		this.$location.hash("");
	}
}
