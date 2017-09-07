var path = require('path');

function uploadPath(baseDir, filename) {
	var FILE_EXT_RE = /(\.[_\-a-zA-Z0-9]{0,16}).*/;
    var ext = path.extname(filename).replace(FILE_EXT_RE, '$1');
    var name = process.pid + '-' + (Math.random() * 0x100000000 + 1).toString(36) + ext;
    return path.join(baseDir, name);
}

exports.uploadPath = uploadPath;

function generateComponentId() {
	return (Math.floor(Math.random() * 1e10)).toString(36);
}

exports.generateComponentId = generateComponentId;