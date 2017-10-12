let env = {
	"NODE_ENV": "production"
};

let env_local1 = {
	"NODE_ENV": "local1"
};

let env_local2 = {
	"NODE_ENV": "local2"
};

let env_dev1 = {
	"NODE_ENV": "dev1"
};

let env_dev2 = {
	"NODE_ENV": "dev2"
};

module.exports = {
	"apps": [
		{
			"name": "abms",
			"script": "./watchers/folders-and-files-watchers/abms/watcher.js"
		},
		{
			"name": "abms-fetcher",
			"script": "./watchers/folders-and-files-watchers/abms-fetcher/watcher.js"
		},
		/*{
			"name": "abms-merger-csv-to-db",
			"script": "./watchers/folders-and-files-watchers/abms-merger/to-abms-alone-merged-db-from-abms-output-csv/watcher.js"
		},
		{
			"name": "taxonomy-collector",
			"script": "./watchers/folders-and-files-watchers/taxonomy-collector/watcher.js"
		},	
		{
			"name": "abms-merger-internal-db-to-merged-db",
			"script": "./watchers/mongodb-watchers/abms-merger/to-abms-after-merged-db-from-abms-alone-merged-db/watcher.js",
			"env": env,
			"env_local1": env_local1,
			"env_local2": env_local2,
			"env_dev1": env_dev1,
			"env_dev2": env_dev2
		},
		{
			"name": "final-merger",
			"script": "./watchers/mongodb-watchers/final-merger/watcher.js",
			"env": env,
			"env_local1": env_local1,
			"env_local2": env_local2,
			"env_dev1": env_dev1,
			"env_dev2": env_dev2			
		}*/
	]
}