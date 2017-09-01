export function mobileFormatter(){
	return {
        require: "ngModel",
        scope: {
           
        },
        link: function(scope, element, attributes, ngModel) {
            var modalvalue;
                ngModel.$parsers.push(function(mobile){
                mobile = mobile.replace(/[^0-9]/g, '');
                var return_value;
                if(mobile.length === 10){
                  modalvalue = mobile;
                    return_value = "("+mobile.substring(0,3)+") "+mobile.substring(3,6)+"-"+mobile.substring(6,10);
                    ngModel.$setViewValue(return_value);
                    ngModel.$render();
                }else{
                    if(mobile.length < 14){
                        var a = mobile.split("-").join("");
                        var b = a.split("(").join("");
                        var c = b.split(")").join("");
                        var d = c.split(" ").join("");
                        modalvalue = d;
                        if(modalvalue.length !== 10){
                           ngModel.$setViewValue(modalvalue);
                           ngModel.$render();
                        }  
                    }else{
                        // ngModel.$setViewValue(modalvalue);
                        // ngModel.$render(); 
                    }
                    
                }
                return modalvalue;
            });
        }
    };
}
