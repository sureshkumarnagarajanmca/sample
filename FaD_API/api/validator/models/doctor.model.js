




/**
 * Created by pradeep on 3/21/16.
 */



/*"location" : {
    "lat" : -33.86879,
        "lng" : 151.194217
}}*/

module.exports = {
    "drAddress": {
        "id": "drAddress",
        "type": "object",
        "additionalProperties": false,
        "properties": {
           /* "street" : {
                "type" :"string",
                "description": "Address Line 1 and Line 2"
            },*/
            "Line1StreetAddress" : {
                "type" :["string","null"],
                "description": "Address Line 1"
            },
            "Line2StreetAddress" : {
                "type" :["string","null"],
                "description": "Address Line 2"
            },
            "city" : {
                "type" :["string","null"],
                "description": "City code"
            },
            "state" : {
                "type" :["string","null"],
                "description": "City code"
            },
            "country" : {
                "type" :["string","null"],
                "description": "Country code"
            },
            "phoneNo" : {
                "type" :["string","null"],
                "description": "Contact Number"
            },
            "locationCode" : {
                "type" :["string","null"],
                "description": "Location Code"
            },
            "zipCode" : {
                "type" :["string","null"],
                "description": "zip/postal code"
            },
            "faxNo" : {
                "type" :["string","null"],
                "description": "faxNo"
            },
            "geoLocation":{
                "$ref" : "geoLocation"
            },
            "location":{
                "$ref" : "location"
            }

        }
    },
    "geoLocation" : {
        "id": "geoLocation",
        "type": "object",
        "properties": {
            "location" : {
                "$ref" : "location"
            }
        }
    },
    "location": {
        "id": "location",
        "type": "object",
        "properties": {
            "lat" : {
                "type": ["string","number"],
                "description": "lattitude"
            },
            "lon" : {
                "type": ["string","number"],
                "description": "langitude"
            }
        }
    },
    "drPracAddress": {
        "id": "drPracAddress",
        "type": "object",
        "additionalProperties": false,
        "properties": {
            "_id":{
                "type" : "string" ,
                "description": "unique id"
            },
            "organizationLegalName" :{
                "type" : "string" ,
                "description": "organizationLegalName"
            },
            "Line1StreetAddress" : {
                "type" :"string",
                "description": "Address Line 1"
            },
            "Line2StreetAddress" : {
                "type" :"string",
                "description": "Address Line 2"
            },
            "city" : {
                "type" :"string",
                "description": "City code"
            },
            "state" : {
                "type" :"string",
                "description": "City code"
            },
            "country" : {
                "type" :"string",
                "description": "Country code"
            },
            "phoneNo" : {
                "type": "string",
                "description": "Contact Number"
            },
            "locationCode" : {
                "type": "string",
                "description": "Location Code"
            },
            "faxNo" : {
                "type": "string",
                "description": "faxNo"
            },
            "zipCode" : {
                "type": "string",
                "description": "zip/postal code"
            },
            "geoLocation":{
                "$ref" : "geoLocation"
            },
            "isPrimary" : {
                "type" : "boolean",
                "description"  : "is primary practice location"  
              }  
        }
    },
    "licence" : {
        "id": "licence",
        "type": "object",
        "properties" :{
            "state" : {
                "type": "string",
                "description" : "State code of the licenced"
            },
            "number" : {
                "type": "string",
                "description" : "Licence number"
            }
        }
    },
    "organizationObjectWithId" : {
        "id": "organizationObjectWithId",
        "type": "object",
        "properties" :{
            "orgId" : {
                "type": "string",
                "description" : "organizationId"
            },
            "orgType" : {
                "type": "string",
                "description" : "organization type PL",
                'enum':['PL']
            },
            "allowedSlots" : {
                "type": "number",
                "description" : "number of allowd slots for doctor"
            }
        }
    },
    "doctorCollege" : {
        "id": "doctorCollege",
        "type": "object",
        "properties" :{
            "collegeId" : {
                "type": "string",
                "description" : "collegeId"
            },
            "degreeName" : {
               "type": "array",
                "description": "List of degrees",
                "items": {
                    "type": "string",
                    "description":"List of degree names"
                }
            },
            "taxanomyId" :{
                "type" : "string",
                "description" :" specialityId"
            }
        }
    },
    /*

collegeId :  { type: Schema.Types.ObjectId, ref: 'MedicalSchool'},
        courseName : String,
        taxanomyId : {  type: Schema.Types.ObjectId, ref: 'Taxonomy'}





    */
   "hospitalsAff" : {
        "id": "hospitalsAff",
        "type": "object",
        "properties" :{
            "hospitalName" : {
                "type": "string",
                "description" : "hospital  name"
            },
            "hospitalId" : {
                "type": "string",
                "description" : "hospital Id"
            },
              "Line1StreetAddress" : {
                "type" :"string",
                "description": "Address Line 1"
            },
            "Line2StreetAddress" : {
                "type" :"string",
                "description": "Address Line 2"
            },
            "city" : {
                "type" :"string",
                "description": "City code"
            },
            "state" : {
                "type" :"string",
                "description": "City code"
            },
            "country" : {
                "type" :"string",
                "description": "Country code"
            },
            "phoneNo" : {
                "type": "string",
                "description": "Contact Number"
            },
            "countyName" : {
                "type": "string",
                "description": "Location Code"
            },
             "zipCode" : {
                "type": "string",
                "description": "zip/postal code"
            }
           
           

    
        }
    },


    "specialitiesCertificationsObject" : {
        "id": "specialitiesCertificationsObject",
        "type": "object",
        "properties" :{
            "taxonomyString" : {
                "type": "string",
                "description" : "taxonomy name"
            },
            "status" : {
                "type": "string",
                "description" : "certificationStatus"
            },
            "taxonomyCode" : {
                "type": "string",
                "description":"TAXONOMYIDS"
            }
        }
    },
    "certificationObject" : {
        "id": "certificationObject",
        "type": "object",
        "properties" :{
            "certficationName" : {
                "type": "string",
                "description" : "State code of the licenced"
            },
            "dateInMonths" : {
                "type": "string",
                "description" : "convert into months and send"
            },
            "specialities" : {
                "type": "array",
                "items":{"$ref": "specialitiesCertificationsObject"},
                "required" : true
            },
            "certficationId"  : {
                 "type": "string",
                "description" : "id for relation  with broadcertifications"

            },
            "level" :{
                 "type": "string",
                 "description" : "certifications taxonomy level"    
            }
        }
    },
    "doctor": {
        "id": "doctor",
        "type": "object",
        "properties": {
            "npi": {
                "type": "string",
                "description": "npi is required field for doctor registration. This field is unique for each doctor"
            },
            "lName": {
                "type": "string",
                "description": "Doctor's last name. Required field"
            },
            "fName": {
                "type": "string",
                "description": "Doctor's first name. Required field"
            },
            "mName": {
                "type": "string",
                "description": "Doctor's middle name. In any"
            },
            "dob": {
                "type": "string",
                "description": "date of birth in unix timestamp fromat"
            },
            "updateDate": {
                "type": ["string","number"],
                "description": "date of birth in unix timestamp fromat",
                "required": true
            },
            "imageId": {
                "type": "string",
                "description": "imageId after uploading the image"
            },
            "prefix": {
                "type": "string",
                "description": "Doctor's prefix ex: MD , MS etc"
            },
            "suffix": {
                "type": "string",
                "description": "Doctor's prefix ex: Jr etc"
            },
            "gender": {
                "type": "string",
                "default":"M",
                "description": "Doctor's gender. Possible options M or F or T. Required field",
                'enum':['M','F', 'T']
            },
            "doctorType": {
                "type": "string",
                "default":"black",
                "description": "Doctor's status grey for lgggedin but  not scheduled, black for not signedup white for loggedin and scheduled",
                'enum':['black','white', 'grey','yellow']
            },
            "medicalSchoolName": {
                "type": "array",
                "description": "Doctor's list of medical school name",
                "items": { "$ref" : "doctorCollege"}
            },
            "hospitalAffillation":{
                "type": "array",
                "description": "List of affiliated hospitals",
                "items": {  "$ref" : "hospitalsAff" }
            },
            "boardCertificates":{
                "type": "array",
                "description": "List of board certificates",
                "items": {
                    "type": "string",
                    "description":"List of board certificates"
                }
            },
            "educationTraining":{
                "type": "array",
                "description": "List of educations and trainings completed",
                "items": {
                    "type": "string",
                    "description":"List of educations and trainings completed"
                }
            },
            "awardsAndAccolades":{
                "type": "array",
                "description": "List of aeards and accolades",
                "items": {
                    "type": "string",
                    "description":"List of aeards and accolades"
                }
            },
            "experience":{
                "type" : "string",
                "description": "Doctor's experience"
            },
            "website" : {
                "type": "website",
                "description": "website"
            },
            "likes":{
                "type" : "number",
                "description": "No of likes for the doctor"
            },
            "ProfessionalacceptsMedicareAssignment":{
                "type" : "string",
                "description": "Is doctor accepts MedicareAssignment"
            },
            "isSubscribed":{
                "type" : "boolean",
                "description": "Is doctor accepts MedicareAssignment"
            },
            "languagesSpoken":{
                "type": "array",
                "description": "List of languages spoken",
                "items": {
                    "type": "number",
                    "default":"English",
                    "description":"List of languages spoken"
                }
            },
            "credentialText":{
                "type": "array",
                "description": "Credentials",
                "items": {
                    "type": "string",
                    "description":"List of credential"
                }
            },
            "pacId": {
                "type": "string",
                "description": "Doctor's PAC Id if any."
            },
            "insurancePlans":{
                "type": "array",
                "description": "Supported insurance plans",
                "items": {
                    "type": "string",
                    "description":"List of supported insurace plans"
                }
            },
            "pSpeciality": {
                "type": "array",
                "description": "Doctor's Speciality",
                "items": {
                    "type": "string",
                    "description":"name of the Speciality"
                }
            },
            "pSubSpeciality": {
                "type": "array",
                "description": "Doctor's  Sub Speciality",
                "items": {
                    "type": "string",
                    "description":"name of the Sub Speciality"
                }
            },
            "taxonomy": {
                "type": "array",
                "description": "Doctor's Speciality and Subspeciality Id,s of  taxonomys",
                "items": {
                    "type": "string",
                    "description":"name of taxonomys"
                }
            },
            "address": {
                "$ref": "drAddress"
            },

            // "practiceLocationAddress" :{
            //     "type": "array",
            //     "description": "list of practice address",
            //     "items":{"$ref": "organizationObjectWithId"}
            // },
            "orgIds" : {
                "type": "array",
                "description": "list of practice address",
                "items":{"$ref": "organizationObjectWithId"}
            },
            "otherAddress" : {
                "type": "array",
                "description": "list of practiclocation Id address",
                "items":{"$ref": "drPracAddress"}
            },
            "licenceNumbers" : {
                "type": "array",
                "description" : "list of licences registered states details",
                "items" :{"$ref": "licence"}
            },
            "briefIntro": {
              "type" : "string",
                "description" : "about doctor"
            },
            "certificationsLastModified" : {
                "type" : "string",
                "description" : "certifications last updated date"
            },
            "certifications": {
                "type": "array",
                "description": "list of  all certifications",
                "items":{"$ref": "certificationObject"}
            },
            "reasons": {
                "type": "array",
                "description": "Doctor specifis reasons",
                "items": {
                    "type": "string",
                    "description":"name of reasons"
                }
            },
            "insuranceIds":{
                "type": "array",
                "description": "Doctor's insurance  ids",
                "items": {
                    "type": "string",
                    "description":"id of insurance"
                }
            }
        }
    },
    "doctorUpload": {
        "id": "doctorUpload",
        "type": "object",
        "properties": {
            "npi": {
                "type": "string",
                "description": "npi is required field for doctor registration. This field is unique for each doctor"
            },
            "lName": {
                "type": "string",
                "description": "Doctor's last name. Required field"
            },
            "fName": {
                "type": "string",
                "description": "Doctor's first name. Required field"
            },
            "mName": {
                "type": "string",
                "description": "Doctor's middle name. In any"
            },
            "dob": {
                "type": "string",
                "description": "date of birth in YYYY-MM-DD fromat"
            },
            "imageId": {
                "type": "string",
                "description": "imageId after uploading the image"
            },
             "mobile": {
                "type": "string",
                "description": "Enter mobile number"
            },
             "countryCode" : {
                "type": "string",
                "description": "possible options are doctor or user",
                "default":"+1"
            },
            "prefix": {
                "type": "string",
                "description": "Doctor's prefix ex: MD etc"
            },
            "suffix": {
                "type": "string",
                "description": "Doctor's prefix ex: Jr etc"
            },
            "gender": {
                "type": "string",
                "default":"M",
                "description": "Doctor's gender. Possible options M or F or T. Required field",
                'enum':['M','F', 'T']
            },
            "doctorType": {
                "type": "string",
                "default":"black",
                "description": "Doctor's status grey for lgggedin but  not scheduled, black for not signedup white for loggedin and scheduled",
                'enum':['black','white', 'grey']
            },
            "hospitalAffillations":{
                "type": "array",
                "description": "List of affiliated hospitals",
                "items": {
                   "type": "string",
                    "description":"List of affiliated hospitals"
                }
            },
            "educationTraining":{
                "type": "array",
                "description": "List of educations and trainings completed",
                "items": {
                    "type": "string",
                    "description":"List of educations and trainings completed"
                }
            },
            "awardsAndAccolades":{
                "type": "array",
                "description": "List of aeards and accolades",
                "items": {
                    "type": "string",
                    "description":"List of aeards and accolades"
                }
            },
            "experience":{
                "type" : "string",
                "description": "Doctor's experience"
            },
            "likes":{
                "type" : "number",
                "description": "No of likes for the doctor"
            },
            "ProfessionalacceptsMedicareAssignment":{
                "type" : "string",
                "description": "Is doctor accepts MedicareAssignment"
            },
            "isSubscribed":{
                "type" : "boolean",
                "description": "Is doctor accepts MedicareAssignment"
            },
            "languagesSpoken":{
                "type": "array",
                "description": "List of languages spoken",
                "items": {
                    "type": "number",
                    "default":"English",
                    "description":"List of languages spoken"
                }
            },
            "website" : {
                "type": "website",
                "description": "website"
            },
            "email": {
                "type": "string",
                "description": "email"
            },
            "credentialText":{
                "type": "array",
                "description": "Credentials",
                "items": {
                    "type": "string",
                    "description":"List of credential"
                }
            },
            "pacId": {
                "type": "string",
                "description": "Doctor's PAC Id if any."
            },
            "insurancePlans":{
                "type": "array",
                "description": "Supported insurance plans",
                "items": {
                    "type": "string",
                    "description":"List of supported insurace plans"
                }
            },
            "pSpeciality": {
                "type": "array",
                "description": "Doctor's Speciality",
                "items": {
                    "type": "string",
                    "description":"name of the Speciality"
                }
            },
            "pSubSpeciality": {
                "type": "array",
                "description": "Doctor's  Sub Speciality",
                "items": {
                    "type": "string",
                    "description":"name of the Sub Speciality"
                }
            },
            "taxonomy": {
                "type": "array",
                "description": "Doctor's Speciality and Subspeciality Id,s of  taxonomys",
                "items": {
                    "type": "string",
                    "description":"name of taxonomys"
                }
            },
            "address": {
                "$ref": "drAddress"
            },

            "practiceLocationAddress" :{
                "type": "array",
                "description": "list of practice address",
                "items":{"$ref": "organizationObjectWithId"}
            },
            "otherAddress" : {
                "type": "array",
                "description": "list of practiclocation Id address",
                "items":{"$ref": "drPracAddress"}
            },
            "licenceNumbers" : {
                "type": "array",
                "description" : "list of licences registered states details",
                "items" :{"$ref": "licence"}
            },
            "briefIntro": {
              "type" : "string",
                "description" : "about doctor"
            },
            "certificationsLastModified" : {
                "type" : "string",
                "description" : "certifications last updated date"
            },
            "certifications": {
                "type": "array",
                "description": "list of practice address",
                "items":{"$ref": "certificationObject"}
            },
            "reasons": {
                "type": "array",
                "description": "Doctor specifis reasons",
                "items": {
                    "type": "string",
                    "description":"name of reasons"
                }
            },
            "insuranceIds":{
                "type": "array",
                "description": "Doctor's insurance  ids",
                "items": {
                    "type": "string",
                    "description":"id of insurance"
                }
            }
        }
    },
    "doctorScheduleForOrganization": {
         "id": "doctorScheduleForOrganization",
        "type": "object",
        "additionalProperties": false,
        "properties": {
            "availability":{
                "type": "array",
                "description": "list of practice address",
                "items":{"$ref": "organizationAvailabitlity"}   
            }
        }
    },
    "organizationAvailabitlity" : { 
        "id": "organizationAvailabitlity",
        "type": "object",
        "additionalProperties": false,
        "properties": {
            "orgId" :{
                "type" : "string" ,
                "description": "Enter organization Id"
            },
            "allowedSlots" :{
                "type" : "number" ,
                "description": "number of allowd slots"
            },
            "schedule" :{
                "$ref": "scheduleObj"
            },
            "slotDuration" : {
                "type" : "number",
                "description" : "Enter slot duration in minutes"
            }
        }
    },
    "scheduleObj" : {
        "id": "scheduleObj",
        "type": "object",
        "additionalProperties": false,
        "properties": {
        //     "Monday" :{
        //         "type": "array",
        //         "description": "Doctor specifis reasons",
        //         "items":{"$ref": "startTimeEndTime"}
        //     },
        //     "Tuesday" :{
        //         "type": "array",
        //         "description": "Doctor specifis reasons",
        //         "items":{"$ref": "startTimeEndTime"}
        //     },
        //     "Wednesday" :{
        //         "type": "array",
        //         "description": "Doctor specifis reasons",
        //         "items":{"$ref": "startTimeEndTime"}
        //     },
        //     "Thursday" :{
        //         "type": "array",
        //         "description": "Doctor specifis reasons",
        //         "items":{"$ref": "startTimeEndTime"}
        //     },
        //     "Friday" :{
        //         "type": "array",
        //         "description": "Doctor specifis reasons",
        //         "items":{"$ref": "startTimeEndTime"}
        //     },
        //     "Saturday" :{
        //         "type": "array",
        //         "description": "Doctor specifis reasons",
        //         "items":{"$ref": "startTimeEndTime"}
        //     },
        //     "Sunday" :{
        //         "type": "array",
        //         "description": "Doctor specifis reasons",
        //         "items":{"$ref": "startTimeEndTime"}
        //     }
        // }
            "0" :{
                "type": "array",
                "description": "Doctor specifis reasons",
                "items":{"$ref": "startTimeEndTime"}
            },
            "1" :{
                "type": "array",
                "description": "Doctor specifis reasons",
                "items":{"$ref": "startTimeEndTime"}
            },
            "2" :{
                "type": "array",
                "description": "Doctor specifis reasons",
                "items":{"$ref": "startTimeEndTime"}
            },
            "3" :{
                "type": "array",
                "description": "Doctor specifis reasons",
                "items":{"$ref": "startTimeEndTime"}
            },
            "4" :{
                "type": "array",
                "description": "Doctor specifis reasons",
                "items":{"$ref": "startTimeEndTime"}
            },
            "5" :{
                "type": "array",
                "description": "Doctor specifis reasons",
                "items":{"$ref": "startTimeEndTime"}
            },
            "6" :{
                "type": "array",
                "description": "Doctor specifis reasons",
                "items":{"$ref": "startTimeEndTime"}
            }
        }
    },
    // "day" :{
    //     "type" : "string" ,
    //     "description": "Enter one day eg : Sunday",
    //     'enum':['Monday','Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    // },
    // "scheduleList" : {
    //     "type": "array",
    //     "description": "Doctor specifis reasons",
    //     "items":{"$ref": "startTimeEndTime"}
    // },
    "startTimeEndTime" : {
        "id": "startTimeEndTime",
        "type": "object",
        "additionalProperties": false,
        "properties": {
            "startTime" :{
                "type" : "number" ,
                "description": "Enter startTime in minutes"
            },
            "endTime" :{
                "type" : "number" ,
                "description": "Enter endTime in minutes"
            }
        }
    },
    "searchDoctorAppointmentObj" :{
        "id": "searchDoctorAppointmentObj",
        "type": "object",
        "additionalProperties": false,
        "properties": {
            "startTime" :{
                "type" : "number" ,
                "description": "Enter startTime in milliseconds"
            },
            "endTime" :{
                "type" : "number" ,
                "description": "Enter endTime in milliseconds"
            }
        }  
    }
};

