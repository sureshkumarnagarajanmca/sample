/** @ngInject */
export function avatar(): angular.IDirective {
  return {
    link: function(scope, element, attrs, model) {
      var that = this;
      attrs.$observe("gender",function(value){
        var imageNumber = Math.floor((Math.random() * 3) + 1);
        if (value === 'M') {
          // attrs.$set('src', '../../../assets/images/svg-avatar/male-' + imageNumber + '.svg');
          attrs.$set('src', '../../../assets/images/svg-avatar/male.svg');
        }
        else {
          // attrs.$set('src', '../../../assets/images/svg-avatar/female-'+ imageNumber +'.svg');
          attrs.$set('src', '../../../assets/images/svg-avatar/female.svg');
        }
      });
    }
  };
}