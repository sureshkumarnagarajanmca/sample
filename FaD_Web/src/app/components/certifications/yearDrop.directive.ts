/** @ngInject */
export function yearDrop(): angular.IDirective {
    function getYears(offset, range){
        var currentYear = new Date().getFullYear();
        var years = [];
        for (var i = 0; i < range + 1; i++){
            years.push(currentYear + offset - i);
        }
        return years;
    }
    return {
        link: function(scope,element,attrs){
            scope.years = getYears(+attrs.offset, +attrs.range);
            scope.select = scope.years[0];
        },
        template: '<select name="yearOfCert" ng-model="item.years" ng-options="y for y in years"><option value="">Year</option></select>'
    }
}