/** @ngInject */
export function hospitalAutoSuggestion(DoctorProfileService: any): angular.IDirective {
  return {
    require:'ngModel',
    link: function(scope, element, attrs, model) {
      var options = {
        // types: ['(cities)'],
        componentRestrictions: {country: 'US'}
      };
      var autoComplete;
      var previousValue;
      element.bind('click', function(e) {
        if (element.val() != '') {
          previousValue = element.val();
          // element.attr("placeholder", "");
        }
        if (!autoComplete) {
          initAutocomplete();
          element.val("");
          // element.attr("placeholder", "");
        }
        else {
          element.val("");
          // element.attr("placeholder", "");
        }
      });
      element.bind('blur', function(e) {
        if (element.text() == '') {
          element.val(previousValue);
          // element.attr("placeholder", "");
        }
      });
      function initAutocomplete() {
        autoComplete = new google.maps.places.Autocomplete(element[0], options);
        google.maps.event.addListener(autoComplete, 'place_changed', function() {
          var place = autoComplete.getPlace();
          var suggestion , suggestionState, suggestionCity, hospSuggestionCity, hospSuggestionState;
          place['address_components'].forEach(function(item){
            if (item.types[0] === 'country'&&attrs.suggestionType === 'country') {
              suggestion = item['long_name'];
            }
            else if (item.types[0] === 'postal_code' && attrs.suggestionType === 'postal_code'){
              suggestion = item['long_name']; 
              
            }
            else if (item.types[0] === 'administrative_area_level_1'){
              hospSuggestionState = item['long_name']; 
            }
            else if (item.types[0] === 'locality' ){
              hospSuggestionCity = item['long_name']; 
            }
          });
              var hosp_view_value_city = model.$viewValue; //The actual value from the control's view
              var hosp_model_value_city = model.$modelValue; //The value in the model that the control is bound to.
              model.$viewValue = hospSuggestionCity; //set new view value
              model.$commitViewValue();
              model.$render();
              var view_value_state = model.$$parentForm.hospState.$viewValue;
              var model_value_state = model.$$parentForm.hospState.$modelValue;
              model.$$parentForm.hospState.$viewValue = hospSuggestionState;
              model.$$parentForm.hospState.$commitViewValue();
              model.$$parentForm.hospState.$render();
              if(model.$name == "hospState") {
                var hosp_view_value_state = model.$viewValue; //The actual value from the control's view
                var hosp_model_value_state = model.$modelValue; //The value in the model that the control is bound to.
                model.$viewValue = hospSuggestionState; //set new view value
                model.$commitViewValue();
                model.$render(); 
              }
              
        });
      }
    }
  };
}