/** @ngInject */
export function pinElement($animate:any): angular.IDirective {
  return {
    link: function(scope, element, attrs, model) {
      $animate.pin(element,document.body);
    }
  };
}