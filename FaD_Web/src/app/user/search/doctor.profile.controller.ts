export class DoctorProfileController {
	public apiHost: any;
	public userId: string;
	public doctor: any;
	public cardObj: any;//object of search card from which doctor profile is invoked
	public userLocation: any;
	public locationObj:any;
	public searchDoctorPayload:any;
	//Initializing the object
	/* @ngInject */
	constructor(public $rootScope, public $scope: any,
		public $state: angular.ui.IStateService,
		public SearchService: any,
		public $uibModal: any,
		public $stateParams: any,
		public hosts:any,
		public $filter: any,
		public $location:any,
		public $anchorScroll:any,
		public CacheFactory:any) {
		var that = this;
		this.locationObj = {};
        this.apiHost = hosts.node.url;
        this.cardObj = this.$stateParams.cardObj;
        this.userLocation = this.$stateParams.userLocation;
        //temp code, redirect to the home on page refresh
   		if(!this.cardObj){
			$state.go('search');
   		}
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
   		$.fn.scrollBottom = function() { 
		  return $(document).height() - this.scrollTop() - this.height(); 
		};
		$(window).scroll(function () {
            if ($(this).scrollBottom() > 350) {
                $('.doc-prof-nav-btn').fadeIn();
            } else {
                $('.doc-prof-nav-btn').fadeOut();
            }
        });
        if(this.cardObj){
        	this.userId = this.cardObj["_source"].userId;
        	var userLocation = {};
			userLocation.lat = this.SearchService.searchFilter.params.lat;
			userLocation.lng = this.SearchService.searchFilter.params.lon;
        	this.locationObj.source = userLocation;
			this.locationObj.destination = this.cardObj["_source"].address.geoLocation.location;
        }
        $scope.limit = 10;
        //creating doctor profile details cache
        if (!CacheFactory.get('doctorProfileDetailsCache')) {
			// or CacheFactory('bookCache', { ... });
			CacheFactory.createCache('doctorProfileDetailsCache', {
				deleteOnExpire: 'aggressive',
				maxAge: 60 * 60 * 1000000, // 1hr
				storageMode: 'localStorage',
				capacity: 1
			});	
		}
		var doctorCache = CacheFactory.get('doctorProfileDetailsCache');

		//if the current doctor is not in cache, get the details from server
		if(this.cardObj){ //if cardObj is not empty, the the page is viewed by clickcin on "view profile" button on doctor profile summary
			var cacheObj = {
				cardObj: this.cardObj,
				userLocation: this.userLocation,
				userId: this.userId
			};
			SearchService.getDoctor(this.userId).then((data: any) => {
				this.doctor = data;
				if (data.hasOwnProperty("imageId") && data.imageId !== '') {
					that.imgPath = that.apiHost + "/api/getFile?imageId=" + data.imageId;
				} else if(data.gender == "M") {
					that.imgPath = "/assets/images/svg-avatar/male.svg";
				} else {
					that.imgPath = "/assets/images/svg-avatar/female.svg";
				}
				cacheObj.doctor = data;
				doctorCache.put(this.userId, cacheObj);	
				this.$filter("parentTaxonomyMerge")(data.taxonomy);
			});
		}
		else{
			var profileObj = doctorCache.values()[0];
			this.cardObj = profileObj.cardObj;
			this.userId = profileObj.userId;
			this.doctor = profileObj.doctor;
		}
	
	    	setTimeout(function(){
    	        var offsetHeight = document.getElementById('from').offsetHeight;
				document.getElementById('to').style.height = (offsetHeight + 30)+'px'; 
	    	}, 1000);

	    	this.searchDoctorPayload = angular.copy(SearchService.searchFilter);

	  //   	if (this.cardObj._source.hasOwnProperty("imageId") && this.cardObj._source.imageId !== '') {
			// 		this.imgPath = that.apiHost + "/api/getFile?imageId=" + this.cardObj._source.imageId;
			// } else if(this.cardObj._source.gender == "M") {
			// 	this.imgPath = "/assets/images/svg-avatar/male.svg";
			// } else {
			// 	this.imgPath = "/assets/images/svg-avatar/female.svg";
			// }
	}

	getNextDoctor(){
		var that = this;
		this.searchDoctorPayload.params.from = this.SearchService.doctorCount;
		this.searchDoctorPayload.params.size = 1;
		this.SearchService.fireSearchFromDoctorProfileForNExtAndPreviousDoctors(this.searchDoctorPayload)
		.then((response)=> {
			if(that.SearchService.doctorCount < response.totalRecords) {
				that.SearchService.doctorCount = that.SearchService.doctorCount + 1;
			 	that.$state.go("doctor-details", 
				{ "cardObj":response.data[0],
				"userLocation": that.userLocation});
			}
		});
	}

	showMore() {
		if(this.$scope.limit == (this.doctor.insuranceIds).length) {
			this.$scope.limit = 10;
			document.getElementById("showLess").innerHTML = "more";
		} 
		else {
			this.$scope.limit = (this.doctor.insuranceIds).length;
			document.getElementById("showLess").innerHTML = "less";
		}
	}


	getPrevDoctor(){
		var that = this;
		this.searchDoctorPayload.params.from = this.SearchService.doctorCount-2;
		this.searchDoctorPayload.params.size = 1;
		if(this.searchDoctorPayload.params.from !== -1) {
			this.SearchService.fireSearchFromDoctorProfileForNExtAndPreviousDoctors(this.searchDoctorPayload)
			.then((response)=> {
				that.SearchService.doctorCount = that.SearchService.doctorCount - 1;
				if(that.SearchService.doctorCount == 0) {
					that.SearchService.doctorCount = 1;
				}
			 	that.$state.go("doctor-details", 
				{ "cardObj":response.data[0],
				"userLocation": that.userLocation});
			});
		}
		
	}

	// 	viewDoctorProfile(cardObj,doctorCountInPage){
	// 	this.SearchService.doctorCount = doctorCountInPage + 1 + (this.SearchService.searchFilter.params.from * 5);
	// 	this.$state.go("doctor-details", 
	// 		{ "cardObj":cardObj,
	// 		"userLocation":this.geoObj});
	// }

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
}
