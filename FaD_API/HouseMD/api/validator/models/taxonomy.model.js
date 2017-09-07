/**
 * Created by pradeep on 3/18/16.
 */

module.exports = {
    metadata : {
        "id": "metadata",
        "type": "object",
        "additionalProperties": false,
        "properties": {
            "isParent": {"type":"boolean"},
            "score": {"type": "string"}
        }
    },

   /* _id : {type :string, unique : true, required : true}, // Taxonomy Id
    level : {tyep: Number, required: true},
    grouping : { type : string , required : true},
    speciality: { type : string , required : true},
    subSpeciality : {type : string},
    score :{type: Number},
   /* parentCode*!/
    taxonomy.level = data.level;
taxonomy.tittle = data.tittle;
taxonomy.definition = data.definition;
taxonomy.description = data.description;*/

    "taxonomy": {
        "id": "taxonomy",
        "type": "object",
        "properties": {
            "code": {
                "type": "string",
                "description": "taxonomy code"
            },
            "level": {
                "type": "Number",
                "description": "taxonomy levels Ex: Grouping level : 1, Speciality level:2, Sub Speciality level:3 etc"
            },
            "tittle": {
                "type": "string",
                "description":"Tittle (Name of the group /speciality/subspeciality) "
            },
            "definition": {
                "type": "string",
                "description":"If any"
            },
            "description": {
                "type": "string",
                "description":"If any"
            },
            "parent": {
                "type": "string",
                "description" : "This field tell us item (Grouping,speciality or subspeciality) belongs to which item"
            },
            "popularity":{
                "type": "number",
                "description" : "Popularity Score of Taxonomy"  
            },
            "order":{
                "type": "number",
                "description" : "Popularity Score of Taxonomy" 
            },
            "taxonomyName" : {
                "type": "string",
                "description" : "Speciality Orginal name" 
            }
        }
    }
};
