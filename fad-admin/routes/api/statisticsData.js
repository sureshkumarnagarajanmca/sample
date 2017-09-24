var keystone = require('keystone');

var statisticsData = keystone.list('statisticsData');

exports = module.exports = function(req, res) {
	statisticsData.model.findOne({},{"_id":0})
		.exec(function(err, result) {
			if (err !== null) {
				res.status(500).send(err);
			} else {
				res.status(200).json(result);
			}
		});
}
