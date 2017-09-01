export class DashboardController {	
	public startTime: string;
	public endTime: string;
	public isCalendarVisible: boolean;
	/* @ngInject */
	constructor( public $scope:any) {
		// $scope.days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']; 
		this.isCalendarVisible = false;
		$scope.days = ['SUNDAY']; 
		$scope.dateConfig = {
			'startView': 'hour',
			'minView': 'minute',
			'modelType': 'moment'
		};
		$scope.starttime = "";
	}
	printTime(){
	}
	test(){
		alert("slot will be added");
	}
	toggleCalendar(){
		if(this.startTime){
			this.startTime = this.startTime.format("HH:MM");
		}
		if(this.isCalendarVisible){
			this.isCalendarVisible = false;
		}
		else{
			this.isCalendarVisible = true;
		}
	}

}