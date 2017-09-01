export class SpecialityService {
  public specialities: any;
  public apiHost: string;
  public specialitiesAvailable: boolean;
  /** @ngInject */
  constructor(private $log: angular.ILogService, private $http: angular.IHttpService, private hosts: any, public DoctorProfileFactory: any) {
    this.apiHost = hosts.node.url;
    this.specialities = [];
  }

  querySpecialities(level:number): angular.IPromise<any[]> {
    let that = this;
    return this.$http.get(this.apiHost + '/api/taxonomy/level/nodivision/'+level, {
      // params:{} Params to be sent are to be added here
    })
      .then((response: any): any => {
        that.specialities[level] = response.data;
        return response.data;
      })
      .catch((error: any): any => {
        this.$log.error('Failed to get taxonomies\n', error.data);
      });
  }

}
