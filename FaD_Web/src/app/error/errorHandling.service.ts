export class errorHandling {
	public apiHost: string;
	public userId: string;
	public userDetails: string;
	public  errorMessagesList;
	/** @ngInject */
	constructor(private $log: angular.ILogService, private $http: angular.IHttpService, private hosts: any) {
		this.apiHost = hosts.node.url;
		this.errorSignUpMessagesList = {
			"ERREMAILMBL" : ['email','mobile'],
			"ERREMAIL" : ['email'],
			"ERREMAILMBLNPI" : ['email','mobile','npi'],
			"ERRNPI" : ['npi'],
			"ERRMBLNPI" : ['npi','mobile'],
			"ERRMBL" : ['mobile'],
			"ERREMAILNPI" : ['npi','email'],
			"ERRNEWNPI" : ['newNpi'],
			"ERREMAILNEWNPI" : ['email','newNpi'],
			"ERRMBLNEWNPI" : ['newNpi', 'mobile'],
			"ERREMAILMBLNEWNPI" : ['newNpi', 'email', 'mobile']
		}

		this.otpErrorList = {
			"NOPNDGOTPVRF" : {message : "Invalid code"},
			"INCRCTOTP" : {message : "Invalid code"},
			"OTPEXPIRED" : {message : "Code Expired"},
			"NOOTOTPVALDT" : {message : "Invalid code"}
		}

		this.signInErrorList = {
			"USRNTFND" : {message : "user not found"},
			"PWDWRG" : {message: "Wrong password"}
		}

		this.erroronOtpSignUp = function(error){
			if(error.status === 412){

			}else{

			}
		}
	}

	signInErrorHandler(error: any){
		return this.otpErrorList[error];
	}
	signUpErrorHandler(error: any){
		return this.errorSignUpMessagesList[error];
	}

	otpError(error : any){
		return this.otpErrorList[error].message;
	}
}


// switch enumValue {
        
//         case .PWDWRG:
            
//             customError.title = "Wrong Password"
//             customError.message = "Password you enetered is wrong"
            
//             break
            
//         case .USRNTFND:
            
//             customError.title = "User Not Found"
//             customError.message = "User with this email/mobile not found"
            
//             break
            
//         case .INTERNAL:
            
//             customError.title = "Something went wrong"
//             customError.message = "Unknown error with status code: "
            
//             break
            
//         case .INVLD_USER_ID:
            
//             customError.title = "Entered User ID is not valid"
//             customError.message = "Entered User ID is not valid: "
            
//             break
            
//         case .ERREMAIL:
            
//             customError.title = "Existing email"
//             customError.message = "Unknown error with status code: "
            
//             break
            
//         case .ERRNPI:
            
//             customError.title = "Existing NPI"
//             customError.message = "Unknown error with status code: "
            
//             break
            
//         case .ERREMAILNPI:
            
//             customError.title = "Existing NPI and Email"
//             customError.message = "Unknown error with status code: "
            
//             break
            
//         case .NOPNDGOTPVRF:
            
//             customError.title = "Unknown"  // Related to web
//             customError.message = "Unknown error with status code: "
            
//             break
            
//         case .INCRCTOTP:
            
//             customError.title = "Wrong OTP"
//             customError.message = "Code entered is no valid"
            
//             break
            
//         case .ERRMBL:
            
//             customError.title = "Existing Mobiel Number"
//             customError.message = "Unknown error with status code: "
            
//             break
            
//         case .MOBILENOTVERFD: // Not related
            
//             customError.title = "Server Error"
//             customError.message = "Unknown error with status code: "
            
//             break
            
//         case .OTPEXPIRED:
            
//             customError.title = "OTP Expired"
//             customError.message = "Unknown error with status code: "
            
//             break
            
//         case .ERREMAILMBL:
            
//             customError.title = "Existing Email and Mobile"
//             customError.message = "Unknown error with status code: "
            
//             break
            
//         case .NOOTOTPVALDT:
            
//             customError.title = "Unknown"
//             customError.message = "Unknown error with status code: "
            
//             break
            
//         case .PROFNOTVERFD: // Manual Verification
            
//             customError.title = "Server Error"
//             customError.message = "Unknown error with status code: "
            
//             break
            
//         case .ERRMBLNPI:
            
//             customError.title = "Existing Mobile and NPI"
//             customError.message = "Unknown error with status code: "
            
//             break
            
//         case .ERREMAILMBLNPI:
            
//             customError.title = "Existing Mail, Mobile and NPI"
//             customError.message = "Unknown error with status code: "
            
//             break
            
//         case .EXPRDACCESSTOKEN:
            
//             customError.title = "Access Token expired"
//             customError.message = "Unknown error with status code: "
            
//             break
            
//         case .WRGACCESSTOKEN:
            
//             customError.title = "Wrong Access Token"
//             customError.message = "Unknown error with status code: "
            
//             break
            
//         case .NOACCESSTOKEN:
            
//             customError.title = "No Access Token"
//             customError.message = "Unknown error with status code: "
            
//             break
            
//         }
        
//         return customError
        
//     }