/* To remove node_modules recursively to the whole application, we can use this script */
const fs = require('fs');
const resolve = require('path').resolve;
const join = require('path').join;
const exec = require('child_process').exec;

// get library path
let rootFolder = resolve(__dirname, '.');
let folderToBeRemoved = 'node_modules';

let walkSync = function(dir, foldersList) {
 
	let files = fs.readdirSync(dir);
	foldersList = foldersList || [];

	files.forEach(function(file) {
		try {
			let path = join(dir, file);
			if (fs.statSync(path).isDirectory()) {
				if ((path).indexOf(folderToBeRemoved) !== -1) {
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
	let cmd = /^win/.test(process.platform) ? 'rmdir /s /q ' + foldersList[folder] : 'rm -rf ' + foldersList[folder];

	exec(cmd,{ env: process.env, cwd: '.', stdio: 'inherit' }, function(error, stdout, stderr) {
		//console.log(stdout);
		//console.log(stderr);
	});
};