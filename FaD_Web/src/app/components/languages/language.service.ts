export class LanguageService {
  public languages: any;
  public apiHost: string;
  /** @ngInject */
  constructor(private $log: angular.ILogService, private $http: angular.IHttpService, private hosts: any) {
    this.apiHost = hosts.node.url;
    this.languages = [];
  }

  getLanguages(): angular.IPromise<any[]> {
    let that = this;
    return this.$http.get(this.apiHost + '/api/languages', {
      //params:{} Params to be sent are to be added here
    })
      .then((response: any): any => {
      this.languages = response.data;
        return response.data;
      })
      .catch((error: any): any => {
        this.$log.error('Failed to get languages\n', error.data);
      });
  }

  }