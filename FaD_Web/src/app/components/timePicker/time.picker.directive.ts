/** @ngInject */
export function timePicker(): angular.IDirective{
	return{
		template:
		`<div class="select-box">
			<span class="time-input">place holder</span>
			<span class="picker-icon"></span>
			<div class="drop-down">drop down items</div>	
		</div>`,
		link:function(scope,element,attr){
			var icon = element.find('.picker-icon')[0];
			icon.addEventListener('click',function(){
				element.find('.drop-down').toggle();
			});

		}
	}
}