/* To execute 'npm install' recursively to the whole application, we can use this script */
const fs = require('fs');
const resolve = require('path').resolve;
const join = require('path').join;
const cp = require('child_process');

// get library path
let rootFolder = resolve(__dirname, '.');
let fileToBeFind = 'package.json';

let walkSync = function(dir, foldersList) {
 
	let files = fs.readdirSync(dir);
	foldersList = foldersList || [];
	
	// current directory checking...
	if (fs.existsSync(join(dir, fileToBeFind))) {
		foldersList.push(dir);
	}
	files.forEach(function(file) {
		let path = join(dir, file);
		try {
			if (fs.statSync(path).isDirectory()) {
				if (fs.existsSync(join(path, fileToBeFind))) {
					foldersList.push(path);
				} else {
					foldersList = walkSync(path, foldersList);
				}
				//console.log('it exists');
			}
		} catch(err) {
			//console.log('it does not exist');
		}
	});
	return foldersList;
};

let foldersList = walkSync(rootFolder, []);

for (let folder in foldersList) {
	//console.log(foldersList[folder]);

	// Determine OS and set command accordingly
	const cmd = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';

	// install folder
	cp.spawn(cmd, ['i'], { env: process.env, cwd: foldersList[folder], stdio: 'inherit' });
};