import {httpInterceptor} from './auth/http.interceptor';
/** @ngInject */
export function config($logProvider: angular.ILogProvider, toastrConfig: any,$httpProvider:angular.IHttpProvider, $locationProvider:angular.ILocationProvider,cfpLoadingBarProvider:any) {
  // enable log
  $logProvider.debugEnabled(true);
  // set options third-party lib
  toastrConfig.allowHtml = true;
  toastrConfig.timeOut = 3000;
  toastrConfig.positionClass = 'toast-top-right';
  toastrConfig.preventDuplicates = true;
  toastrConfig.progressBar = true;
  //enable http configurations
  $httpProvider.interceptors.push(httpInterceptor);
  cfpLoadingBarProvider.includeSpinner = false;
       // use the HTML5 History API

//   $locationProvider.html5Mode({
  //   enabled: true
  // }).hashPrefix('!');
}

//localization configuration
export const localeConf = {
  basePath: 'app/languages',
  defaultLocale: 'en-US',
  sharedDictionary: 'common',
  fileExtension: '.lang.json',
  // persistSelection: true,
  // cookieName: 'COOKIE_LOCALE_LANG',
  // observableAttrs: new RegExp('^data-(?!ng-|i18n)'),
  // delimiter: '::',
  // validTokens: new RegExp('^[\\w\\.-]+\\.[\\w\\s\\.-]+\\w(:.*)?$')
};

