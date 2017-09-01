export class ContentController{
	/* @ngInject */
	constructor($scope:any,public $mdDialog: any,public $state: angular.ui.IStateService,public $location: any,public $anchorScroll: any,public SearchService: SearchService){
		
		this.contactUs = {};
		$scope.config = {
			sectionsColor: ['#1bbc9b', '#4BBFC3', '#7BAABE'],
			navigation: true,
			navigationPosition: 'right',
    		scrollingSpeed: 1000
		};
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

	}	
	goTo(div){
		this.$location.hash(div);
		this.$anchorScroll();
		this.$location.hash("");
	}
	sendEmail = function(){
		var that = this;
		this.sendObj = {
			"name": "";
			"email": "";
			"message": "";

		};
		SearchService.sendMessage(this.contactUs).then(function(data) {
			if(!!data) {
				$mdDialog.show(
  					$mdDialog.alert()
			        .parent(angular.element(document.querySelector('#abc')))
			        .clickOutsideToClose(true)
			        .title('THANK YOU')
			        .textContent('Thank you for contacting us, we will get back to you soon.')
			        .ariaLabel('Alert Dialog Demo')
			        .ok('Ok')
			        .targetEvent()
	    		);
				that.contactUs = {};
			}
			
		}, function(error) {
			
			that.otpErrorNotification = error;
		});
	}
}