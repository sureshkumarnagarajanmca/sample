export class SearchResultsController {
	public url: string;
	public doctorList: any;
	public totalRecords: number;
	public sliderOptions: any;
	public sliderInitialValue: number;
	public gender: string;
	public sortName: string;
	public specialitySelected: string;
	public specialityList: string;
	public insuranceSelected: string;
	public dateSelected: string;
	private pageNumber: number;
	public docName: string;
	public illness: any;
	public geoObj: any;
	public insuranceProviders: any;
	public isBoardCertified: any;
	public currentLocation: any;
	public totalNumberPages: any;
	public savedLocation: any;
	public isPrevActive = true;
	public isNextActive = true;
	public selectedIllness: any;

	// to do public taxanomySelected: string; This should be taken from result
	/* @ngInject */
	constructor(public $scope:any, hosts: any, public SearchService: any, 
		public $state: angular.ui.IStateService,
		public $uibModal: any,
		public InsuranceService:any,
		public $mdDialog: any, 
		public $filter:any,
		public $location:any,
		public $anchorScroll:any,
		public $rootScope: any,
		public $sessionStorage:any,
		public $cacheFactory: any,
		public $window: any
		) {
		let that = this;
		this.url = hosts.node.url;
		this.totalRecords = SearchService.getSearchResults().totalRecords;
		this.doctorList = SearchService.getSearchResults().data;
		this.specialityList = SearchService.getSpecialities();
		this.savedLocation = {};
		if(this.SearchService.currentLocation == undefined) {
			$state.go("search");
		}
		this.totalNumberPages = Math.ceil(this.totalRecords / 10);
		setTimeout(function() {
			if(SearchService.searchFilter.params.sortName == "fName") {
    			$("#fName1").css("border-color", "#fa5f5f");
    			if(SearchService.searchFilter.params.sortType == "desc") {
    				$(".button-for-filters span #svg1").css("transform", "rotate(180deg)");
    			}
			} else if(SearchService.searchFilter.params.sortName == "lName") {
    			$("#lName1").css("border-color", "#fa5f5f");
    			if(SearchService.searchFilter.params.sortType == "desc") {
    				$(".button-for-filters span #svg2").css("transform", "rotate(180deg)");
    			}
			} else {
    			$("#distance1").css("border-color", "#fa5f5f");
			}
			
		},50)
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
    	if(!this.specialityList) {
    		this.SearchService.querySpecialities().then(function(data) {
				that.specialityList = data;
				that.specialitySelected = that.SearchService.specialitySelected;
			});
    	}
    	
		$('#select').select2({
		  minimumResultsForSearch: 10 // at least 20 results must be displayed
		});
		this.sortBy = [
			{Name : "Sort by First Name", value : "fName"},
			{Name : "Sort by Last Name", value : "lName"},
			{Name : "Sort by Distance", value : "distance"}
		]
		this.sortName = this.sortBy[2].value;
		
		$(window).scroll(function () {
            if ($(this).scrollTop() > 350) {
                $('.goToSignup').fadeIn();
            } else {
                $('.goToSignup').fadeOut();
            }
        });
        $(window).scroll(function () {
            if ($(this).scrollTop() > 500) {
                $('.goTo').fadeIn();
            } else {
                $('.goTo').fadeOut();
            }
        });
        $('.goTo').click(function () {
            $("html, body").animate({ scrollTop: 0 }, 1000);
            return false;
        });
        
		$rootScope.$on('removeResultsSpecialtyHolder',function(event,data){
			if(!!that.SearchService.specialitySelected){
				$("#label3").css("display", "block");	
			}else{
				$("#label3").css("display", "none");
			}
			if(data){
				$("#label3").css("display", "none");
			}
		});
		$rootScope.$on('removeResultsInsuranceHolder',function(event,data){
			if(!!that.SearchService.searchFilter.params.insuranceId){
				$("#label4").css("display", "block");	
			}else if(data){
				$("#label4").css("display", "none");
			}
			else{
				$("#label4").css("display", "none");
			}
		});

		this.currentLocation = SearchService.currentLocation;
		angular.copy(this.SearchService.currentLocation,this.savedLocation);
		this.initPagination();
		// pagination variables
		this.maxSize= 10;
		if(SearchService.searchFilter.params.from){
			this.currentPage = SearchService.searchFilter.params.from + 1;
		}else{
			this.currentPage = 1;
		}
		
		//getting filter params from search home page
		let previousParams = SearchService.getSearchFilterObjs();
		this.specialitySelected = previousParams.speciality;

		if(previousParams.parentSpecialityId){
			this.specialityList = this.$filter("filter")(this.specialityList, previousParams.parentSpecialityId);
		}

		//getting insurance providers
		// this.insuranceProviders = InsuranceService.insurances;
		// this.insuranceSelected = previousParams.insurance;

		InsuranceService.getInsurances().then((data: any) => {
			that.insuranceProviders = [{name : "I'll Choose My Insurance Later", popular : 100}];
			that.insuranceProviders.push.apply(that.insuranceProviders, data);
			that.insuranceSelected = previousParams.insurance;
		});
		
		//old slider configuration
		/*this.sliderOptions = {
			from: 1,
			to: 50,
			floor: true,
			step: 1,
			dimension: " miles",
			vertical: false,x
			callback: function(value, elt) {
				that.triggerSearch("radius", value+"mi");
			}						
		};*/
		// setting reset filter values
		if(!this.SearchService.searchFilter.params.gender){
			var sessionStorageSearchFilterObjFlag = this.$window.sessionStorage.sessionStorageSearchFilterObjFlag;
			if (typeof(sessionStorageSearchFilterObjFlag) !== 'undefined' && sessionStorageSearchFilterObjFlag !== false && sessionStorageSearchFilterObjFlag !== 'false') {
				var sessionStorageSearchFilterObj = angular.fromJson(this.$window.sessionStorage.getItem('sessionStorageSearchFilterObj'));			
				this.gender = sessionStorageSearchFilterObj.gender ? sessionStorageSearchFilterObj.gender : 'D';
			} else {
				var defaultSearchFilterObj = this.SearchService.defaultSearchFilterObj;
				this.gender = defaultSearchFilterObj.gender ? defaultSearchFilterObj.gender : 'D';
			}
		}else{
			this.gender = this.SearchService.searchFilter.params.gender;
		}
		if(!this.SearchService.searchFilter.params.name)
		{
			var sessionStorageSearchFilterObjFlag = this.$window.sessionStorage.sessionStorageSearchFilterObjFlag;
			if (typeof(sessionStorageSearchFilterObjFlag) !== 'undefined' && sessionStorageSearchFilterObjFlag !== false && sessionStorageSearchFilterObjFlag !== 'false') {
				var sessionStorageSearchFilterObj = angular.fromJson(this.$window.sessionStorage.getItem('sessionStorageSearchFilterObj'));
				this.docName = sessionStorageSearchFilterObj.name;
			} else {
				var defaultSearchFilterObj = this.SearchService.defaultSearchFilterObj;
				this.docName = defaultSearchFilterObj.name;
			}			

		}else{
			this.docName = this.SearchService.searchFilter.params.name;
		}

		if(!this.SearchService.selectedIllness.parent) {
			this.selectedIllness = null;
		}else{
			this.selectedIllness = this.SearchService.selectedIllness;
		}

		if(!this.SearchService.sliderValue){
			var sessionStorageSearchFilterObjFlag = this.$window.sessionStorage.sessionStorageSearchFilterObjFlag;
			if (typeof(sessionStorageSearchFilterObjFlag) !== 'undefined' && sessionStorageSearchFilterObjFlag !== false && sessionStorageSearchFilterObjFlag !== 'false') {
				var sessionStorageSearchFilterObj = angular.fromJson(this.$window.sessionStorage.getItem('sessionStorageSearchFilterObj'));
				this.sliderValue = sessionStorageSearchFilterObj.radius;
			} else {
				var defaultSearchFilterObj = this.SearchService.defaultSearchFilterObj;
				this.sliderValue = defaultSearchFilterObj.radius;
			}
		}else{
			this.sliderValue = this.SearchService.sliderValue;
		}
		 //D stands for default, A stands for Any, M stands for male, F stands for Female
 		//intializing the page number
		// this.taxanomySelected = SearchResultsFactory.data.taxanomySelected.title;

		//Initializing illness
		this.illness = [];
		if(this.specialitySelected){
			this.SearchService.queryIllness(this.specialitySelected["_id"]).then(function(data) {
				that.illness = data;
				that.SearchService.illness = data;
			});
		}

		//setting location on place change	
		this.geoObj = {
		};
		$scope.gPlace;
		// $scope.$watch('mapPlace', function(changedPlace) {
		// 	if (typeof changedPlace !== "undefined") {
		// 		that.geoObj.lat = changedPlace.geometry.location.lat();
		// 		that.geoObj.lng = changedPlace.geometry.location.lng();
		// 		that.SearchService.setSearchFilter("lat", changedPlace.geometry.location.lat());
		// 		that.SearchService.setSearchFilter("lon", changedPlace.geometry.location.lng());
		// 		that.triggerSearch();
		// 		that.currentLocation = changedPlace;
		// 	}
		// });
		$scope.$watch('searchResults.sliderValue', function(distance) {
			if(that.SearchService.sliderValue == distance) {
				that.triggerSearch("radius", distance + "mi");
			} else {
				that.triggerSearchDistance("radius", distance + "mi");
				that.SearchService.sliderValue = distance;
			}
			var sessionStorageSearchFilterObjFlag = that.$window.sessionStorage.sessionStorageSearchFilterObjFlag;
			if (typeof(sessionStorageSearchFilterObjFlag) !== 'undefined' && sessionStorageSearchFilterObjFlag !== false && sessionStorageSearchFilterObjFlag !== 'false') {
				var sessionStorageSearchFilterObj = angular.fromJson(that.$window.sessionStorage.getItem('sessionStorageSearchFilterObj'));
				sessionStorageSearchFilterObj.radius = distance;
				that.$window.sessionStorage.setItem('sessionStorageSearchFilterObj', angular.toJson(sessionStorageSearchFilterObj));
			}
			if(that.totalRecords == 1) {
				document.getElementById("results").innerHTML = "result";
			}
			if(that.totalRecords > 1) {
				document.getElementById("results").innerHTML = "results";
			}
			if(distance == 1) {
				document.getElementById("mile").innerHTML = "mile";
			}
			if(distance > 1) {
				document.getElementById("mile").innerHTML = "miles";
			}
			setTimeout(function(){
	        var offsetHeight = document.getElementById('from').offsetHeight;
			document.getElementById('to').style.height = offsetHeight+'px'; 
    	}, 50);
		});
		//setting filter for the location input on the header
		$scope.$watch('gPlace', function(changedPlace) {
			if (typeof changedPlace !== "undefined") {
			
				that.geoObj.lat = changedPlace.geometry.location.lat();
				that.geoObj.lng = changedPlace.geometry.location.lng();
				that.SearchService.setSearchFilter("lat", changedPlace.geometry.location.lat());
				that.SearchService.setSearchFilter("lon", changedPlace.geometry.location.lng());
				that.currentLocation = changedPlace;
				setTimeout(function(){
	        var offsetHeight = document.getElementById('from').offsetHeight;
			document.getElementById('to').style.height = offsetHeight+'px'; 
    	}, 50);
			}
		});
		//getting search filters lat long postion that are sent from the search page
		this.geoObj.lat = this.SearchService.getSearchFilter().params.lat;
		this.geoObj.lng = this.SearchService.getSearchFilter().params.lon;

		setTimeout(function(){
	        var offsetHeight = document.getElementById('from').offsetHeight;
			document.getElementById('to').style.height = offsetHeight+'px'; 
    	}, 50);
	}
	genderSelectTrigger(gender){
		if (gender === '') {
			this.gender = 'A';
		}
		else {
			this.gender = gender;
		}
		
		this.SearchService.setSearchFilter("from", 0);
		this.currentPage = 1;
		
		this.triggerSearch("gender", gender);
		setTimeout(function(){
	        var offsetHeight = document.getElementById('from').offsetHeight;
			document.getElementById('to').style.height = offsetHeight+'px'; 
    	}, 50);
	}
	sortBySelectTriggerDistance(distance) {
		sortName = 'distance';
		this.SearchService.setSearchFilter("from", 0);
		this.currentPage = 1;
		this.initPagination();
		this.triggerSearch("sortName", sortName);
		this.flage = undefined;
		this.flag = undefined;
		$(".button-for-filters span #svg1").css("transform", "rotate(0deg)");
		$(".button-for-filters span #svg2").css("transform", "rotate(0deg)");
		$("#distance1").css("border-color", "#fa5f5f");
		$("#fName1").css("border-color", "#fff");
		$("#lName1").css("border-color", "#fff");
	}
	sortBySelectTriggerFirstName(sortName) {
		sortName = 'fName';
		$(".button-for-filters span #svg2").css("transform", "rotate(0deg)");
		if(this.flag == undefined) {
			this.flag = true;
		}
		if(this.flag) {
			var order = 'asc';
			this.triggerSearchOrder("sortType", order)
			this.flag = false;
			$(".button-for-filters span #svg1").css("transform", "rotate(0deg)");
		} else {
			var orderDes = 'desc';
			this.triggerSearchOrder("sortType", orderDes);
			this.flag = true;
			$(".button-for-filters span #svg1").css("transform", "rotate(180deg)");
		}
		this.SearchService.setSearchFilter("from", 0);
		this.currentPage = 1;
		this.initPagination();
		this.triggerSearch("sortName", sortName);
		$("#distance1").css("border-color", "#fff");
		$("#fName1").css("border-color", "#fa5f5f");
		$("#lName1").css("border-color", "#fff");
		this.flage = undefined;
	}
	sortBySelectTriggerLastName(sortName) {
		sortName = 'lName';
		$(".button-for-filters span #svg1").css("transform", "rotate(0deg)");
		if(this.flage == undefined) {
			this.flage = true;
		}
		if(this.flage) {
			var order = 'asc';
			this.triggerSearchOrder("sortType", order)
			this.flage = false;
			$(".button-for-filters span #svg2").css("transform", "rotate(0deg)");
		} else {
			var orderDes = 'desc';
			this.triggerSearchOrder("sortType", orderDes);
			this.flage = undefined;
			$(".button-for-filters span #svg2").css("transform", "rotate(180deg)");
		}
		this.SearchService.setSearchFilter("from", 0);
		this.currentPage = 1;
		this.initPagination();
		this.triggerSearch("sortName", sortName);
		$("#distance1").css("border-color", "#fff");
		$("#fName1").css("border-color", "#fff");
		$("#lName1").css("border-color", "#fa5f5f");
		this.flag = undefined;
	}
	triggerSearchOrder(filterAttr,filterVal){
		let that = this;
		if (typeof filterAttr !== 'undefined') {
			var sessionStorageSearchFilterObjFlag = this.$window.sessionStorage.sessionStorageSearchFilterObjFlag;
			if (typeof(sessionStorageSearchFilterObjFlag) !== 'undefined' && sessionStorageSearchFilterObjFlag !== false && sessionStorageSearchFilterObjFlag !== 'false') {
				var sessionStorageSearchFilterObj = angular.fromJson(this.$window.sessionStorage.getItem('sessionStorageSearchFilterObj'));
				sessionStorageSearchFilterObj[filterAttr] = filterVal;
				this.$window.sessionStorage.setItem('sessionStorageSearchFilterObj', angular.toJson(sessionStorageSearchFilterObj));
			}
			this.SearchService.setSearchFilter(filterAttr, filterVal);
		}
	}
	sortBySelectTrigger(sortName){
		if(sortName == 'fName') { 
			this.sortName = 'fName';
		} else if(sortName == 'lName'){
			this.sortName = 'lName';
		} else {
			this.sortName = 'distance';
		}
		this.triggerSearch("sortName", sortName);
		// this.triggerSearch("gender",this.gender);
		setTimeout(function(){
	        var offsetHeight = document.getElementById('from').offsetHeight;
			document.getElementById('to').style.height = offsetHeight+'px'; 
    	}, 50);
	}

	//Accepts filter condition and triggers the search
	triggerSearch(filterAttr,filterVal){
		let that = this;
		// that.selectedIllness;
		if (typeof filterAttr !== 'undefined') {
			var sessionStorageSearchFilterObjFlag = this.$window.sessionStorage.sessionStorageSearchFilterObjFlag;
			if (typeof(sessionStorageSearchFilterObjFlag) !== 'undefined' && sessionStorageSearchFilterObjFlag !== false && sessionStorageSearchFilterObjFlag !== 'false') {
				var sessionStorageSearchFilterObj = angular.fromJson(this.$window.sessionStorage.getItem('sessionStorageSearchFilterObj'));
				sessionStorageSearchFilterObj[filterAttr] = filterVal;
				this.$window.sessionStorage.setItem('sessionStorageSearchFilterObj', angular.toJson(sessionStorageSearchFilterObj));
			}		
			this.SearchService.setSearchFilter(filterAttr, filterVal);
		}
		//resetting the page number
		// this.pageNumber = 0;
		
		
		this.SearchService.fireSearch().then((response)=> {
			that.doctorList = response.data;
			that.illness = that.SearchService.illness;
			that.$location.hash("search-main-panel");
			that.$anchorScroll();
			that.$location.hash("");
			if(!!that.SearchService.currentLocation){
				that.currentLocation = that.SearchService.currentLocation;				
			}
			that.totalRecords = response.totalRecords;
			that.totalNumberPages = Math.ceil(that.totalRecords / 10)
			// that.$location.hash("search-main-panel");
			// that.SearchService.setSearchFilter("name", "");
			setTimeout(function(){
	        var offsetHeight = document.getElementById('from').offsetHeight;
			document.getElementById('to').style.height = offsetHeight+'px'; 
    	}, 50);
			if(that.totalRecords == 1) {
				document.getElementById("results").innerHTML = "result";
			}
			if(that.totalRecords > 1) {
				document.getElementById("results").innerHTML = "results";
			}
		});
		this.initPagination();
		if(this.SearchService.searchFilter.params.from == undefined) {
			this.currentPage = 1;
			this.SearchService.setSearchFilter("from", 0);
		} else {
			this.currentPage = this.SearchService.searchFilter.params.from + 1;
			this.SearchService.setSearchFilter("from", this.currentPage - 1);
		}
		this.$location.hash("search-main-panel");
			this.$anchorScroll();
			this.$location.hash("");
			if(this.totalRecords == 0) {
				this.$location.hash("search-main-panel");
				this.$anchorScroll();
				this.$location.hash("");
			}
	}
	triggerSearchDistance(filterAttr,filterVal){
		let that = this;
		// that.selectedIllness;
		if (typeof filterAttr !== 'undefined') {
			this.SearchService.setSearchFilter(filterAttr, filterVal);
		}
		//resetting the page number
		// this.pageNumber = 0;
		this.currentPage = 1;
		this.SearchService.setSearchFilter("from", 0);
		this.SearchService.fireSearch().then((response)=> {
			that.doctorList = response.data;
			that.$location.hash("search-main-panel");
			that.$anchorScroll();
			that.$location.hash("");
			if(!!that.SearchService.currentLocation){
				that.currentLocation = that.SearchService.currentLocation;				
			}
			that.totalRecords = response.totalRecords;
			that.totalNumberPages = Math.ceil(that.totalRecords / 10)
			// that.$location.hash("search-main-panel");
			// that.SearchService.setSearchFilter("name", "");
			setTimeout(function(){
	        var offsetHeight = document.getElementById('from').offsetHeight;
			document.getElementById('to').style.height = offsetHeight+'px'; 
    	}, 50);
		});
		this.initPagination();
		this.$location.hash("search-main-panel");
			this.$anchorScroll();
			this.$location.hash("");
			if(this.totalRecords == 0) {
				this.$location.hash("search-main-panel");
				this.$anchorScroll();
				this.$location.hash("");
			}
	}
	//Appending results to existing list
	/*loadMore(){
		let that = this;
		this.SearchService.setSearchFilter("from", ++(that.pageNumber));
		this.SearchService.fireSearch().then(function(response) {
			let temp = that.doctorList.concat(response.data);
			that.doctorList = temp;
			that.totalRecords = response.totalRecords;
		});
	}*/

	nextPagination(pageNum){
		let that = this;
		this.SearchService.setSearchFilter("from", (pageNum- 1));
		this.SearchService.fireSearch().then(function(response) {
			that.doctorList = response.data;
			that.totalRecords = response.totalRecords;
			that.$location.hash("search-main-panel");
			that.$anchorScroll();
			that.$location.hash("");
			setTimeout(function(){
	        var offsetHeight = document.getElementById('from').offsetHeight;
			document.getElementById('to').style.height = offsetHeight+'px'; 
    	}, 50);
		});
		if(this.currentPage == 1){
			this.isPrevActive = true;
			this.isNextActive = false;
		}
		if(this.currentPage>1 && this.totalRecords>0 && (this.currentPage <= Math.ceil(this.totalRecords / 10))){
			this.isNextActive = false;
			this.isPrevActive = false;
		}
		if(this.currentPage+1 > Math.ceil(this.totalRecords / 10))
		{
			this.isNextActive = true;
		}
	}


	initPagination(){
		if(this.currentPage == 1) {
			this.isPrevActive = true;
		} else {
			this.isPrevActive = false;
		}
		if(this.currentPage == this.totalNumberPages) {
			this.isNextActive = true;
		} else {
			this.isNextActive = false;
		}
		if (this.totalRecords > 10 && this.currentPage < this.totalNumberPages) {
			this.isNextActive = false;
		}
	}
	nextPage(param) {
		let that = this;
		var totalPages = Math.ceil(this.totalRecords / 10);
		if(param === 'n'){ //navigate to next page
			var currentPage = this.currentPage + 1;
			if(currentPage <= totalPages){
				this.currentPage = ++(this.currentPage)
				this.SearchService.setSearchFilter("from", this.currentPage -1);
				this.SearchService.fireSearch().then(function(response) {
					that.doctorList = response.data;
					that.totalRecords = response.totalRecords;
					that.$location.hash("search-main-panel");
					that.$anchorScroll();
					that.$location.hash("");
					setTimeout(function(){
			        var offsetHeight = document.getElementById('from').offsetHeight;
					document.getElementById('to').style.height = offsetHeight+'px'; 
		    	}, 50);
				});
			}
		}
		else{
			if (!(this.currentPage === 1)){
				this.currentPage = this.currentPage -1;
				this.SearchService.setSearchFilter("from", this.currentPage -1);
				this.SearchService.fireSearch().then(function(response) {
					that.doctorList = response.data;
					that.totalRecords = response.totalRecords;
					that.$location.hash("search-main-panel");
					that.$anchorScroll();
					that.$location.hash("");
					setTimeout(function(){
			        var offsetHeight = document.getElementById('from').offsetHeight;
					document.getElementById('to').style.height = offsetHeight+'px'; 
		    	}, 50);
				});
			}
		}
		
		if(this.currentPage == 1){
			this.isPrevActive = true;
			this.isNextActive = false;
		}
		if(this.currentPage>1 && this.totalRecords>0 && (this.currentPage <= Math.ceil(this.totalRecords / 10))){
			this.isNextActive = false;
			this.isPrevActive = false;
		}
		if(this.currentPage+1 > Math.ceil(this.totalRecords / 10))
		{
			this.isNextActive = true;
		}
	}

	//Search by last name
	searchByName(){
		this.SearchService.setSearchFilter("from", 0);
		this.currentPage = 1;	
		this.triggerSearch("name", this.docName);

	}
	//Search by illness
	searchByIllness(){
		var that = this;
		this.triggerSearch("specId",this.selectedIllness.parent);
		that.SearchService.selectedIllness = this.selectedIllness;
	}

	//Get doctors list after the main search criteria "speciality","insurance" and date are selected
	getSearchResults(){
		this.triggerSearch("", this.specialitySelected["_id"]);
		//@Todo we need to pass the insurance and date here once the functionality is in place
	}

	//search by board certification status
	searchByCertStatus() {
		this.triggerSearch("boardCertification", this.isBoardCertified);
	}

	findADoctor(){	
		//Load search results and navigate on load
		let that = this;
		this.initPagination();

		var sortName, sortType;
		
		var sessionStorageSearchFilterObjFlag = this.$window.sessionStorage.sessionStorageSearchFilterObjFlag;
		if (typeof(sessionStorageSearchFilterObjFlag) === 'undefined' || sessionStorageSearchFilterObjFlag === false || sessionStorageSearchFilterObjFlag === 'false') {
			var defaultSearchFilterObj = this.SearchService.defaultSearchFilterObj;
			this.SearchService.setSearchFilter("radius", defaultSearchFilterObj.radius + 'mi');
			this.SearchService.setSearchFilter("sortName", defaultSearchFilterObj.sortName);
			this.SearchService.setSearchFilter("gender", defaultSearchFilterObj.gender);
			this.SearchService.setSearchFilter("name", defaultSearchFilterObj.name);
			this.$window.sessionStorage.setItem('sessionStorageSearchFilterObj', angular.toJson(defaultSearchFilterObj));
			this.$window.sessionStorage.sessionStorageSearchFilterObjFlag = true;
			sortName = defaultSearchFilterObj.sortName;
			sortType = defaultSearchFilterObj.sortType;
		} else {
			var sessionStorageSearchFilterObj = angular.fromJson(this.$window.sessionStorage.getItem('sessionStorageSearchFilterObj'));
			this.SearchService.setSearchFilter("radius", sessionStorageSearchFilterObj.radius + 'mi');
			this.SearchService.setSearchFilter("sortName", sessionStorageSearchFilterObj.sortName);
			this.SearchService.setSearchFilter("gender", sessionStorageSearchFilterObj.gender);
			this.SearchService.setSearchFilter("name", sessionStorageSearchFilterObj.name);
			sortName = sessionStorageSearchFilterObj.sortName;
			sortType = sessionStorageSearchFilterObj.sortType;
		}
		
		if(sortName == "fName") {
			$("#fName1").css("border-color", "#fa5f5f");
			if(sortType == "desc") {
				$(".button-for-filters span #svg1").css("transform", "rotate(180deg)");
			}
			$("#lName1").css("border-color", "#fff");
			$(".button-for-filters span #svg2").css("transform", "rotate(0deg)");
		} else if(sortName == "lName") {
			$("#lName1").css("border-color", "#fa5f5f");
			if(sortType == "desc") {
				$(".button-for-filters span #svg2").css("transform", "rotate(180deg)");
			}
			$("#fName1").css("border-color", "#fff");
			$(".button-for-filters span #svg1").css("transform", "rotate(0deg)");			
		} else {
			$("#distance1").css("border-color", "#fa5f5f");
			
			$("#fName1").css("border-color", "#fff");
			$(".button-for-filters span #svg1").css("transform", "rotate(0deg)");
			
			$("#lName1").css("border-color", "#fff");
			$(".button-for-filters span #svg2").css("transform", "rotate(0deg)");
			
		}		
		
		this.SearchService.specialitySelected = this.specialitySelected;
		//@todo : enfore validations here
		if (this.specialitySelected) {
			this.SearchService.searchFilterObjs.speciality = this.specialitySelected;
			this.SearchService.setSearchFilter("specId", this.specialitySelected["_id"]);
		}
		if (this.insuranceSelected) {
			this.SearchService.searchFilterObjs.insurance = this.insuranceSelected;
			this.SearchService.setSearchFilter("insuranceId", this.insuranceSelected["_id"]);
		}

		//getting relavent illness
		if (this.specialitySelected) {
			this.SearchService.queryIllness(this.specialitySelected["_id"]).then(function(data) {
				that.illness = data;
			});
		}

		this.SearchService.fireSearch().then(function(response) {
			that.doctorList = response.data;
			that.totalRecords = response.totalRecords;
			that.totalNumberPages = Math.ceil(that.totalRecords / 10);
    		// that.savedLocation = that.SearchService.currentLocation;
    		angular.copy(that.SearchService.currentLocation,that.savedLocation)
		});
		// this.resetFilter();
		this.pageNumber = 0;
		this.SearchService.setSearchFilter("from", "0");
		this.currentPage = 1;

		// if(that.totalRecords == 0) {
		// 	document.getElementById('search-main-panel').style.height = 600 + 'px';
		// }
		setTimeout(function(){
	        var offsetHeight = document.getElementById('from').offsetHeight;
			document.getElementById('to').style.height = offsetHeight+'px'; 
    	}, 500);
	}

	//open get directions modal
	openGetDirectionsModal(location) {
		var locationObj = {};
		var userLocation = {};
		userLocation.lat = this.SearchService.searchFilter.params.lat;
		userLocation.lng = this.SearchService.searchFilter.params.lon;
		locationObj.source = userLocation;
		locationObj.destination = location.location;
		let that = this;
		let modalInstance = this.$uibModal.open({
			animation: this.$scope.animationsEnabled,
			templateUrl: 'map-directions',
			controller: 'MapDirectionsModalController',
			size: 'lg',
			resolve: {
				locationObj: locationObj
			}
		});
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


	//view doctor profile
	viewDoctorProfile(cardObj,doctorCountInPage){
		this.SearchService.totalRecords = this.SearchService.getSearchResults().totalRecords;
		this.SearchService.doctorCount = doctorCountInPage + 1 + (this.SearchService.searchFilter.params.from * 10);
		this.$state.go("doctor-details", 
			{ "cardObj":cardObj,
			"userLocation":this.geoObj});
	}

	//resetting filter
	resetFilter(){
		
		var defaultSearchFilterObj = this.SearchService.defaultSearchFilterObj;
		this.SearchService.setSearchFilter("radius", defaultSearchFilterObj.radius + 'mi');
		this.SearchService.setSearchFilter("sortName", defaultSearchFilterObj.sortName);
		this.SearchService.setSearchFilter("gender", defaultSearchFilterObj.gender);
		this.SearchService.setSearchFilter("name", defaultSearchFilterObj.name);

		this.sliderValue = defaultSearchFilterObj.radius;
		this.gender = 'D';
		
		this.$window.sessionStorage.sessionStorageSearchFilterObjFlag = false;
		this.$window.sessionStorage.removeItem('sessionStorageSearchFilterObj');
		
		if(defaultSearchFilterObj.sortName == "fName") {
			$("#fName1").css("border-color", "#fa5f5f");
			if(defaultSearchFilterObj.sortType == "desc") {
				$(".button-for-filters span #svg1").css("transform", "rotate(180deg)");
			}
			$("#lName1").css("border-color", "#fff");
			$(".button-for-filters span #svg2").css("transform", "rotate(0deg)");
		} else if(defaultSearchFilterObj.sortName == "lName") {
			$("#lName1").css("border-color", "#fa5f5f");
			if(defaultSearchFilterObj.sortType == "desc") {
				$(".button-for-filters span #svg2").css("transform", "rotate(180deg)");
			}
			$("#fName1").css("border-color", "#fff");
			$(".button-for-filters span #svg1").css("transform", "rotate(0deg)");			
		} else {
			$("#distance1").css("border-color", "#fa5f5f");
			
			$("#fName1").css("border-color", "#fff");
			$(".button-for-filters span #svg1").css("transform", "rotate(0deg)");
			
			$("#lName1").css("border-color", "#fff");
			$(".button-for-filters span #svg2").css("transform", "rotate(0deg)");
			
		}
	
		this.isBoardCertified = false;
		this.selectedIllness = null;
		this.docName = '';
		this.SearchService.setSearchFilter("specId", this.SearchService.specialitySelected["_id"]);
		this.SearchService.setSearchFilter("boardCertification", this.isBoardCertified);
		this.SearchService.selectedIllness = {};
		this.triggerSearch();
		this.currentPage = 1;
	}

	 $scope.showAlert = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#abc')))
        .clickOutsideToClose(true)
        .textContent('Team FINDaDOCTOR will be coming up with additional features for your easy usability. Online booking will soon be enabled which will show the doctors with their available date and time slots to book your appointment instantly.')
        .ariaLabel('Alert Dialog Demo')
        .ok('Ok')
        .targetEvent(ev)
    );
  };
  
  	onSpecialtySelected = function (selectedItem) {
		  //do selectedItem.PropertyName like selectedItem.Name or selectedItem.Key 
		  //whatever property your list has.
		  $("#label3").css("display", "block");
		  $("#label3").css("z-index", "100");
		  $("#label3").css("margin", "0");
		  $("#label3").css("background-color", "transparent");
		  $("#label3").css("color", "#fa5f5f");
		  $("#label3").css("left", "10px");
		  $("#label3").css("font-size", "14px");
		  
		}
	onInsuranceSelected = function (selectedItem) {
	  //do selectedItem.PropertyName like selectedItem.Name or selectedItem.Key 
	  //whatever property your list has.
	  $("#label4").css("display", "block");
	  $("#label4").css("z-index", "10");
	  $("#label4").css("margin", "0");
	  $("#label4").css("background-color", "transparent");
	  $("#label4").css("color", "#fa5f5f");
	  $("#label4").css("left", "10px");
	  $("#label4").css("font-size", "14px");
	}
}

