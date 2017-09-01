/** @ngInject */
export function mapDirections(): angular.IDirective {
  return {
    link: function(scope, element, attrs, model) {
        attrs.$observe("location",function(value){
          var location = JSON.parse(value);
          var directionsService = new google.maps.DirectionsService;
          var directionsDisplay = new google.maps.DirectionsRenderer;
          var map = new google.maps.Map(element[0], {
            zoom: 20,
            center: { lat: 41.85, lng: -87.65 }
          });
          directionsDisplay.setMap(map);
          calculateAndDisplayRoute(directionsService, directionsDisplay,location);

      function calculateAndDisplayRoute(directionsService, directionsDisplay, location) {
            directionsService.route({
              origin: location.source.lat + "," + location.source.lng,
              destination: location.destination.lat + "," + location.destination.lon,
              travelMode: google.maps.TravelMode.DRIVING
            }, function(response, status) {
              if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                google.maps.event.trigger(map, 'resize');
              } else {
                window.alert('Directions request failed due to ' + status);
              }
            });
        });
    }
  };
}