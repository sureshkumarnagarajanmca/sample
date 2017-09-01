var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrganizationSubSchema = mongoose.Schema({
    orgId : { type: Schema.Types.ObjectId, ref: 'Organization'},
    orgType : { type: String, default :'PL'}
},{ _id : false });


var medicalSchoolSubSchema = mongoose.Schema({
        collegeId :  { type :  Schema.Types.ObjectId, ref : 'MedicalSchool'},
        taxanomyId : { type : String, ref :  'Taxonomy' },
        degreeName : [{type : String, trim : true }]
    },{ _id : false });
/*
var medicalSchoolSubSchema = mongoose.Schema({
        collegeId :  { type: String},
        degreeName : [{type: String,trim:true}],
        taxanomyId : {  type: String}
    },{ _id : false });*/
var hospitalSubSchema = mongoose.Schema({
     hospitalName : String,
     hospitalId : String,
     Line1StreetAddress : String,
        Line2StreetAddress : String,
        city : String,
        state : {type: String},
        countyName : {type: String},
        country : {type: String, default:"US"},
        zipCode : Number,
        phoneNo : String 
 });

var addressSubSchema = mongoose.Schema(
   {
            organizationLegalName : String,
            Line1StreetAddress : String,
            Line2StreetAddress : String,
            city : String,
            state : {type: String, trim : true},
            country : {type: String, default :'US', trim : true},
            locationCode: String,
            zipCode : String,
            phoneNo : String,
            faxNo : String,
            isPrimary : { type: Boolean,default: false },
            geoLocation : {
                location: {
                    lat: {type: String},
                    lon: {type: String}
                }
            }
        },{ _id : false, strict : false });


var doctorSchema = new Schema({
    userId : { type: Schema.Types.ObjectId, ref: 'User' , index: true},
    npi : { type : String , unique : true, required : true, trim: true, index: true},
    entityTypeCode : { type : Number },
    lName : { type : String ,required : true, trim: true},
    fName : String,
    mName : String,
    prefix : String,
    suffix : String,
    gender : { type : String ,required : true, trim: true},
    credentialText : [{type: String,trim:true}],
    medicalSchoolName : [medicalSchoolSubSchema],

     //medicalSchool : [{type : String ,ref:'MedicalSchool'}],
    graduationYear : Number,
    taxonomy :[{ type: String, ref: 'Taxonomy' }],
    pSpeciality : [{type: String,  ref: 'Taxonomy'}],
    pSubSpeciality : [{type: String, ref: 'Taxonomy' }],
    pacId : String,
    groupPacId : String,  //new
    noOfGroupPracticemembers : Number,//new
    // hospitalAffillation :[{type:String, ref: 'Hospital'}],
    //hospitalAffillation :[{type : String}],
    hospitalAffillation  : [hospitalSubSchema],
    secSpecialty : [{type: String}],
    educationTraining :[{type: String}],
    awardsAndAccolades : [{type: String}],
    experience : String,
    pedId : String,  // Professional Enrollment Id  ProfessionalEnrollmentID
    //taxonomy : [{type:String}],
    mobile : String,
    countryCode : String,
    email: String,
    languagesSpoken : [{type: Number, default :37,trim:true, ref: 'Language'}],
    licenceNumbers : [{
        "state"  : { type : String ,required : true, trim: true},
        "number"    : { type : String ,required : true, trim: true}
       // "status": { type : String ,required : true, trim: true}
    }], // It has to rename to licences
    // orgId :[{ type: Schema.Types.ObjectId, ref: 'Organization' }],
    insuranceIds :[{ type: Schema.Types.ObjectId, ref: 'InsuranceProvider' }],
    address : {
        street : String,
        Line1StreetAddress : String,
        Line2StreetAddress : String,
        city : String,
        state : {type: String, trim : true},
        country : {type: String, default :'US', trim : true},
        locationCode: String,
        zipCode : String,
        phoneNo : String,
        faxNo : String,
        geoLocation : {
            location: {
                lat: {type: String},
                lon: {type: String}
            }
        }
    },
    // practiceLocationAddress :[
    //     { 
    //         // address :{
    //             organizationLegalName : String,
    //             Line1StreetAddress : String,
    //             Line2StreetAddress : String,
    //             city : String,
    //             state : {type: String, trim : true},
    //             country : {type: String, default :'US', trim : true},
    //             locationCode: Number,
    //             zipCode : Number,
    //             phoneNo : String,
    //             faxNo : String,
    //             geoLocation : {
    //                 location: {
    //                     lat: {type: String},
    //                     lon: {type: String}
    //                 }
    //             }
    //         // }
    //         // ,
    //         // availability : [],
    //         // allowedSlots : {type : Number}
    //     }
    // ],
    orgIds : [OrganizationSubSchema
        // {
        //     orgId : { type: Schema.Types.ObjectId, ref: 'Organization'},
        //     orgType : { type: String, default :'PL'}
        // }
    ],
    otherAddress :[
        addressSubSchema
    ],
    ProfessionalacceptsMedicareAssignment :String,
    isSubscribed :{type:Boolean, default:false },
    likes :{type:Number, default:0},
    doctorType :{type:String, default:'black',trim : true},
    dob:{ type: Number},
    updateDate : {type : Number},
    imageId : String,
    allowedSlots : Number,
    briefIntro: String,
    reasons: [{type: String}],
   certifications : [{
        certficationId : {type : String},
        certficationName : {type : String},
        dateInMonths:{type : String},
        specialities : [{
            taxonomyString : {type : String},
            status : {type : String},
            taxonomyCode : { type : String}
                       
        }
        ],
        level :   { type : String}
    }],
   // certifications :[{type: Schema.Types.ObjectId,ref : 'certifications' }]
    certificationsLastModified : { type : Date},
    website : {type : String},
	accountName: {type: String}
});


var Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;




