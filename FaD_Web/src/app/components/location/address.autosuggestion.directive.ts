/** @ngInject */
export function addressAutoSuggestion(DoctorProfileService: any): angular.IDirective {
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
            else if (item.types[0] === 'administrative_area_level_1') {
              suggestionState = item['long_name'];
            }
            else if (item.types[0] === 'locality') {
              suggestionCity = item['long_name'];
            }
          });
            var view_value_state = model.$$parentForm.city.$viewValue;
            var model_value_state = model.$$parentForm.city.$modelValue;
            model.$$parentForm.city.$viewValue = suggestionCity;
            model.$$parentForm.city.$commitViewValue();
            model.$$parentForm.city.$render();
            var view_value_state = model.$$parentForm.state.$viewValue;
            var model_value_state = model.$$parentForm.state.$modelValue;
            model.$$parentForm.state.$viewValue = suggestionState;
            model.$$parentForm.state.$commitViewValue();
            model.$$parentForm.state.$render();
            var view_value = model.$viewValue; //The actual value from the control's view
            var model_value = model.$modelValue; //The value in the model that the control is bound to.
            model.$viewValue = suggestion; //set new view value
            model.$commitViewValue();
            model.$render();
          
        });
      }
    }
  };
}