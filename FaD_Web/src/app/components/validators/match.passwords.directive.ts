export function compareTo(){
	return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {
                console.log(ngModel)
            ngModel.$validators.compareTo = function(modelValue) {
console.log(ngModel,scope)
                console.log(modelValue,scope.otherModelValue);

console.log(modelValue === scope.otherModelValue)

                return modelValue === scope.otherModelValue;


            };
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
                console.log(ngModel)
            });
        }
    };
}