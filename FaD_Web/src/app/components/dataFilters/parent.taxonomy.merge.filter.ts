/** @ngInject */
export function parentTaxonomyMergeFilter(public $filter: any, public SpecialityService: any) {
	return function(input) {
		var filteredLevel3Taxonomy;
		input.forEach(function(taxonomyCode){
			filteredLevel3Taxonomy = $filter("filter")(SpecialityService.specialities[3], taxonomyCode); 
			filteredLevel3Taxonomy.forEach(function(obj){
				if(taxonomyCode === obj["_id"]){
					if (input.indexOf(obj.parent) === -1) {
						input.push(obj.parent);
					}
				}
			});
		});
		return input;
    }
}