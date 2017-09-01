/** @ngInject */
export function placeAutoSuggestion(SearchService): angular.IDirective {
  return {
    link: function(scope, element, attrs, model) {
      var options = {
        // types: ['(cities)'],
        componentRestrictions: {country: 'US'}
      };
      var autoComplete;
      var previousValue;
      var indicator;

      element.bind('click', function(e) {
          element.text("");
          indicator = false;
        if(element.val()!=''){
          previousValue = element.val();
        }
        if(!autoComplete){
            initAutocomplete();
            element.val("");
        }
        else{
            element.val("");
        }
      });
      $(".submit-search").bind('click', function() {
        google.maps.event.trigger(input, 'focus')
        google.maps.event.trigger(input, 'keydown', {
            keyCode: 13
        });
      });
      element.bind('blur',function(e){
       if(indicator){
          element.text(element.val());
        }
        indicator = false;
        if(element.text()==''){
          element.val(previousValue);
        }   
      });
      function initAutocomplete(){
            
        autoComplete = new google.maps.places.Autocomplete(element[0], options);

        google.maps.event.addListener(autoComplete, 'place_changed', function() {
          indicator = true;
        // scope.$apply(function() {
        //   scope.search.gPlace = autoComplete.getPlace();
        // });
          SearchService.currentLocation =  autoComplete.getPlace();
          SearchService.setSearchFilter("lat", autoComplete.getPlace().geometry.location.lat());
          SearchService.setSearchFilter("lon", autoComplete.getPlace().geometry.location.lng());
        });
      } 
    }
  };
}

// export class InsuranceService {
//   public insurances: any;
//   public apiHost: string;
//   /** @ngInject */
//   constructor(private $log: angular.ILogService, private $http: angular.IHttpService, private hosts: any, public DoctorProfileFactory: any) {
//     this.apiHost = hosts.node.url;
//     this.insurances = [];
//   }

//   getInsurances(): angular.IPromise<any[]> {
//     let that = this;
//     return this.$http.get(this.apiHost + '/api/insuranceproviders', {
//       //params:{} Params to be sent are to be added here
//     })
//       .then((response: any): any => {
//         this.insurances = response.data;
//         return response.data;
//       })
//       .catch((error: any): any => {
//         this.$log.error('Failed to get insurances\n', error.data);
//       });
//   }

} 
