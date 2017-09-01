export class CertificationService {
  public certifications: any;
  public apiHost: string;
  /** @ngInject */
  constructor(private $log: angular.ILogService, private $http: angular.IHttpService, private hosts: any, public DoctorProfileFactory: any) {
    this.apiHost = hosts.node.url;
    this.certifications = [];
  }

  getCertification(): angular.IPromise<any[]> {
    let that = this;
    return this.$http.get(this.apiHost + '/api/certifications', {
      //params:{} Params to be sent are to be added here
    })
      .then((response: any): any => {
        this.certifications = response.data;
        return response.data;
      })
      .catch((error: any): any => {
        this.$log.error('Failed to get certification\n', error.data);
      });
  }

} 
