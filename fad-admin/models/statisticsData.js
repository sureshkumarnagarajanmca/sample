var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * statisticsData Model
 * ==========
 */
var statisticsData = new keystone.List('statisticsData', {
	schema: { collection: 'statisticsData' },
	hidden: true,
	nocreate: true,
	noedit: true,
	nodelete: true	
});

statisticsData.add({
	abmsDumped: { type: Types.Number, required: false, index: true, default: 0},
	abmsMerged: { type: Types.Number, required: false, index: true, default: 0}
});

statisticsData.register();
