export class listPracticeController {
	/* @ngInject */
	constructor($scope: any, hosts: any, 
		public $state: angular.ui.IStateService, 
		public $filter: any,
		public $location: any,
		public $window: any,
		public $timeout: any,
		public $anchorScroll: any,
		public CacheFactory:any,
		public $rootScope: any) {
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
		});
	goTo(div){
		this.$location.hash(div);
		this.$anchorScroll();
		this.$location.hash("");
	}
}
