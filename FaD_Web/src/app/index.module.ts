/// <reference path="../../typings/main.d.ts" />

import {config } from './index.config';
import {routerConfig } from './index.route';
import {runBlock } from './index.run';
import {MainController } from './main/main.controller';
import {SearchController} from './user/search/search.controller';
import {listPracticeController} from './user/search/list.practice.controller.ts';
import {QuickSearchController} from './user/search/quick.search.controller';
import {ContentController} from './content/content.controller';
import {SearchResultsController} from './user/search/search.results.controller';
import {DoctorProfileController} from './user/search/doctor.profile.controller';
import {UserProfileController} from './user/profile/user.profile.controller';
import {UserSignupController} from './user/profile/user.signup.controller';
import {UserProfileService} from './user/profile/user.profile.service';
import {LoginService} from './login/login.service.ts';
import {CalendarController} from './doctor/calendar/calendar.controller';
import {DoctorSignupController} from './doctor/profile/doctor.signup.controller';
import {ProfileController} from './doctor/profile/profile.controller';
import {DoctorProfileUpdateController} from './doctor/profile/doctor.profile.update.controller';
import {DoctorAdvancedProfileController} from './doctor/profile-advanced/views/profile.advanced.controller.ts';
import {DoctorProfileSummaryController} from './doctor/profile-summary/profile.summary.controller';
import {DoctorProfileSummaryService} from './doctor/profile-summary/profile.summary.service';
import {doctorProfileFactory} from './doctor/profile/doctor.profile.factory';
import {DoctorProfileService} from './doctor/profile/doctor.profile.service';
import {DoctorService} from './doctor/common-services/doctor.service';
import {SpecialityModalController} from './doctor/profile/doctor.profile.modal.controllers';//This is temp controller need to be removed
import {PracticeLocationModalController} from './doctor/profile/doctor.profile.modal.controllers';
import {HospitalAffiliationModController} from './doctor/profile/doctor.profile.modal.controllers';
import {MessageModalController} from './doctor/profile/doctor.profile.modal.controllers';
import {InsurancesModalController} from './doctor/profile/doctor.profile.modal.controllers';
import {MapDirectionsModalController} from './components/modals/map-directions/map.directions.controller';
import {PasswordResetController} from './login/pwd.reset.controller';
import {LoginController} from './login/login.controller';
import {specialityFilter} from './doctor/profile/doctor.speciality.filter';
import {capitalizeFilter} from './components/dataFilters/capitalize.filter';
import {momentFilter} from './components/dataFilters/moment.filter';
import {titleCaseFilter} from './components/dataFilters/title.case.filter';
import {credentialFilter} from './components/dataFilters/credential.filter';
import {phoneFilter} from './components/dataFilters/phone.filter';
import {SpecialityModalCmpController} from './components/modals/specialities/speciality.modal.controller';
import {LanguageModalCmpController} from './components/modals/languages/language.modal.controller';
import {PracticeLocationModalCmpController} from './components/modals/practice-location/practice.location.modal.controller';
import {HospitalAffiliationModalCmpController} from './components/modals/hospital-affiliation/hospital.affiliation.modal.controller';
import {MedicalSchoolModalCmpController} from './components/modals/medical-school/medical.school.modal.controller';
import {InsurancesModalCmpController} from './components/modals/insurances/insurances.modal.controller';
import {CertificationsModalCmpController} from './components/modals/certification/certification.modal.controller';
import {SpecialityService} from './components/specialities/specialities.service';
import {specialityConverterFilter} from './components/specialities/speciality.filter';
import {insuranceConverterFilter} from './components/insurances/insurance.filter';
import {languageConverterFilter} from './components/languages/language.filter';
import {parentTaxonomyMergeFilter} from './components/dataFilters/parent.taxonomy.merge.filter';
import {LanguageService} from './components/languages/language.service';
import {InsuranceService} from './components/insurances/insurance.service';
import {CertificationService} from './components/certifications/certification.service';
import {yearDrop} from './components/certifications/yearDrop.directive';
import {certificationFilter} from './components/certifications/certification.filter';
import {CityByStateService} from './components/hospital-affiliation/cityByState.service';
import { SearchResultsFactory} from './user/search/search.factory';
import { GithubContributor } from '../app/components/githubContributor/githubContributor.service';
import { WebDevTecService } from '../app/components/webDevTec/webDevTec.service';
import { SearchService } from './user/search/search.service';
import { acmeNavbar } from '../app/components/navbar/navbar.directive';
import { acmeMalarkey } from '../app/components/malarkey/malarkey.directive';
import { placeAutoSuggestion } from '../app/components/location/location.autosuggestion.directive';
import { addressAutoSuggestion } from '../app/components/location/address.autosuggestion.directive';
import { hospitalAutoSuggestion } from '../app/components/location/hospital.autosuggestion.directive';
import { mapAutoSuggestion } from '../app/components/location/map.autosuggestion.directive';
import { mapDirections } from '../app/components/location/map.directions.directive';
import { pinElement } from '../app/components/scroll/pin.element.directive';
import { compareTo } from '../app/components/validators/match.passwords.directive';
import { mobileFormatter } from '../app/components/formatter/mobileFormatter.directive';
import { inputNumberOnly } from '../app/components/formatter/inputNumberOnly.directive';
import { inputTextOnly } from '../app/components/formatter/inputTextOnly.directive';
import { avatar } from '../app/components/avatar/avatar.directive';
import {localeConf} from './index.config';
import {errorHandling} from './error/errorHandling.service';

declare var malarkey: any;
declare var moment: moment.MomentStatic;

module fadWeb {
    'use strict';

    angular.module('fadWeb', ['serverConfig', 
                               'ngAnimate', 
                               'ngSanitize',
                               'ngMaterial', 
                               'ngMessages', 
                               'ngResource', 
                               'ui.router', 
                               'ui.bootstrap', 
                               'toastr', 
                               'ngLocalize',
                               'ngLocalize.Config',
                               'mwl.calendar',
                               'ui.select',
                               'angularAwesomeSlider',
                               'angular-loading-bar',
                               'ngFileUpload',
                               'ui.bootstrap.datetimepicker',
                               'angular-cache',
                               'sticky',
                               'fullPage.js',
                               'ab-base64',
                               'angularBootstrapMaterial',
                               'AngularPrint',
                               'angular.filter',
                               'ng-bootstrap-datepicker',
                               'hl.sticky',
                               'ui.select2',
                               'hm.readmore',
                               'swxSessionStorage'
							                 'betsol.intlTelInput'
                               // 'progressbar.js'
                               ])
        .constant('malarkey', malarkey)
        .constant('moment', moment)
        .constant('cnt', "test")
        .config(config)
        .config(routerConfig)
    		.config(
    			function (intlTelInputOptions: any) {
    				angular.extend(intlTelInputOptions, 
    					{
    						allowDropdown: true,
    						separateDialCode: false,
    						customPlaceholder: function(selectedCountryPlaceholder, selectedCountryData) {
    						  return "e.g. " + selectedCountryPlaceholder;
    						},					
    						initialCountry: 'auto',
    						geoIpLookup: function(callback) {
    							jQuery.get("https://ipinfo.io", function() {}, "jsonp").always(
    								function(resp) {
    									var countryCode = (resp && resp.country) ? resp.country : "";
    									callback(countryCode);
    								},
    								function(err) {
    									console.log('error', err);
    									callback('us');
    								}
    							);
    						}
    					}
    				);
    			}
    		)
        .value('localeConf',localeConf)
        .run(runBlock)
        .service('githubContributor', GithubContributor)
        .service('webDevTec', WebDevTecService)
        .service('SearchService', SearchService)
        .service('DoctorProfileService', DoctorProfileService)
        .service('UserProfileService', UserProfileService)
        .service('LoginService', LoginService)
        .service('DoctorService', DoctorService)
        .service('SpecialityService',SpecialityService)
        .service('LanguageService',LanguageService)
        .service('InsuranceService',InsuranceService)
        .service('CertificationService',CertificationService)
        .service('CityByStateService',CityByStateService)
        .service('DoctorProfileSummaryService',DoctorProfileSummaryService)
        .factory('DoctorProfileFactory',doctorProfileFactory)
        .controller('MainController', MainController)
        .controller('SearchController', SearchController)
        .controller('listPracticeController', listPracticeController)
        .controller('SearchResultsController', SearchResultsController)
        .controller('ContentController', ContentController)
        .controller('QuickSearchController', QuickSearchController)
        .controller('DoctorProfileController', DoctorProfileController)
        .controller('UserProfileController',UserProfileController)
        .controller('ProfileController',ProfileController)
		.controller('UserSignupController',UserSignupController)
        .controller('CalendarController',CalendarController)
        .controller('DoctorSignupController',DoctorSignupController)
        .controller('DoctorProfileUpdateController', DoctorProfileUpdateController)
        .controller('DoctorAdvancedProfileController', DoctorAdvancedProfileController)
        .controller('DoctorProfileSummaryController', DoctorProfileSummaryController)
        .controller('SpecialityModalController', SpecialityModalController)
        .controller('HospitalAffiliationModController', HospitalAffiliationModController)
        .controller('MedicalSchoolModalCmpController', MedicalSchoolModalCmpController)
        .controller('MessageModalController', MessageModalController)
        .controller('InsurancesModalController', InsurancesModalController)
        .controller('PracticeLocationModalController', PracticeLocationModalController)
        .controller('PasswordResetController',PasswordResetController)
        .controller('LoginController',LoginController)
        .controller('SpecialityModalCmpController',SpecialityModalCmpController)
        .controller('LanguageModalCmpController',LanguageModalCmpController)
        .controller('PracticeLocationModalCmpController', PracticeLocationModalCmpController)
        .controller('HospitalAffiliationModalCmpController', HospitalAffiliationModalCmpController)
        .controller('InsurancesModalCmpController', InsurancesModalCmpController)
        .controller('CertificationsModalCmpController', CertificationsModalCmpController)
        .controller('MapDirectionsModalController', MapDirectionsModalController)
        .directive('acmeNavbar', acmeNavbar)
        .directive('placeAutoSuggestion', placeAutoSuggestion)
        .directive('compareTo', compareTo)
        .directive('mobileFormatter', mobileFormatter)
        .directive('inputNumberOnly', inputNumberOnly)
        .directive('inputTextOnly', inputTextOnly)
        .directive('acmeMalarkey', acmeMalarkey)  
        .directive('avatar', avatar)  
        .directive('yearDrop', yearDrop)  
        .directive('mapAutoSuggestion', mapAutoSuggestion)  
        .directive('addressAutoSuggestion', addressAutoSuggestion)  
        .directive('hospitalAutoSuggestion', hospitalAutoSuggestion)  
        .directive('mapDirections', mapDirections)  
        .directive('pinElement', pinElement)  
        .filter('speciality',specialityFilter)
        .filter('capitalize',capitalizeFilter)
        .filter('credential',credentialFilter)
        .filter('phone',phoneFilter)
        .filter('titleCase',titleCaseFilter)
        .filter('specialityConverter',specialityConverterFilter)
        .filter('certificationFilter',certificationFilter)
        .filter('languageConverter',languageConverterFilter)
        .filter('insuranceConverter',insuranceConverterFilter)
        .filter('parentTaxonomyMerge',parentTaxonomyMergeFilter)
        .filter('moment',momentFilter)
        .service('errorHandling',errorHandling);
        
}
    if(location.host.search("localhost") > -1 || location.host.search("10.0.90.") > -1){ 
           angular.module('serverConfig', [])
              .constant('hosts', { 
                                     "node": { 
                                     "hostName": "Danmars-MacBook-Pro-2.local", 
                                    "port": "3004", 
                                    // "url": "http://10.0.90.13:3004"} 
                                   "url": "http://10.120.62.136:3004"} 
                                   // "url": "http://10.0.90.21:3004"} 
                                     "elastic": { 
                                     "hostName": "devElastic", "port": "3001", 
                                     "url": "http://devElastic:3001" 
                               } 
            });
    }else{
        angular.module('serverConfig', [])
            .constant('hosts', { 
                             "node": { 
                             "hostName": "Danmars-MacBook-Pro-2.local", 
                            "port": "3004", 
                              // "url": "http://10.0.90.13:3004"} 
                              "url": "http://10.120.62.136:3004"} 
                             "elastic": { 
                             "hostName": "devElastic", "port": "3001", 
                             "url": "http://devElastic:3001" 
                       } 
        });
    }

  


    

angular.module("serverConfig", [])
.constant("hosts", {"node":{"hostName":"10.120.62.136","port":"3004","url":"http://qa.findadoctor.com:3004"},"elastic":{"hostName":"devElastic","port":"3001","url":"http://devElastic:3001"}});
