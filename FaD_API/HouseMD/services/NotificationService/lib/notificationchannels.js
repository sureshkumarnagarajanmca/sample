var channels;
var fs = require('fs'),
	path = require('path');

function initialize(config) {
	channels = {};

	function capitalize(str) {
		return str && str[0].toUpperCase() + str.slice(1);
	}

	fs.readdirSync(path.join(__dirname, 'channels')).forEach(function(file) {
		var channelName = file.replace('.js', '');
		var smsconfig = config.notifications[channelName];
		var Channel = require('./channels/' + channelName);
		channels[capitalize(channelName)]= new Channel(smsconfig);
	});
	return channels;
}

module.exports = function(config) {
	if(channels){
		return channels;
	}
	return initialize(config);
};