var path = require('path');
var fs = require('fs');

var MODULE_NAME = 'dataflo.ws';
var INITIATOR_PATH = 'initiator';

var instanceTypes = [ 'initiator', 'task' ];
var common = require(path.join(MODULE_NAME, 'common'));
var registry = {};
var project = common.getProject();

// - - -

function registryLookup (instanceType, instanceName) {
	var instanceClass = registry[instanceType] &&
		registry[instanceType][instanceName];

	if (!instanceClass) {
		var fixedName = instanceName;
		if (instanceType == 'initiator') {

			fixedName = instanceName.replace(/d$/, '');
			if (fixedName !== instanceName) {
				console.warn(
		'[DEPRECATED] Remove trailing "d" from "%s" in your initiator config',
					instanceName
				);
			}
		} else if (instanceType == 'task') {
			fixedName = instanceName.replace(/^(dataflo.ws\/)?task\//, '');
			if (fixedName !== instanceName) {
				console.warn(
		'[DEPRECATED] Remove preceding "task/" from "%s" in your task config',
					instanceName
				);
			}
		}
		// console.log ('get from symlink');
		try {
			instanceClass = require(
				path.join(instanceType, fixedName)
			);
		} catch (e) {
			try {
<<<<<<< HEAD
				instanceClass = require(
					path.join(MODULE_NAME, instanceType, fixedName)
				);
			} catch (e) {
				throw e;
=======
				instanceClass = require (path.join (project.root.path, 'node_modules', instanceType, fixedName));
			} catch (e) {
			
				try {
					instanceClass = require(path.join(MODULE_NAME, instanceType, fixedName));
				} catch (ee) {

					console.error ('cannot find ' + instanceType + ' named ' + fixedName);
					throw e;
					throw ee;
				}

>>>>>>> 7bbc904b8cf6b9e6c61610c946855774d1a19552
			}
		}
	}

<<<<<<< HEAD
	return instanceClass;
};
=======
		registry[instanceType][instanceName] = instanceClass;
		return instanceClass;

	};
>>>>>>> 7bbc904b8cf6b9e6c61610c946855774d1a19552

instanceTypes.forEach(function(instanceType) {
	registry[instanceType] = {};
	module.exports[instanceType] = function (instanceName) {
		return registryLookup (instanceType, instanceName);
	};
});

// - - -

/**
 * Makes symlinks from modules to base dataflo.ws directory.
 */
module.exports.install = function (moduleName) {
	var baseDir = path.dirname(require.resolve(MODULE_NAME));
	var nodePath = path.dirname(baseDir);
	var moduleDir = path.join(nodePath, moduleName);

	instanceTypes.forEach(function (dir) {
		var srcDir = path.join(moduleDir, dir);
		var destDir = path.join(baseDir, dir);

		if (fs.existsSync(srcDir)) {
			var files = fs.readdirSync(srcDir);
			files.forEach(function (fileName) {
				var srcPath = path.join(srcDir, fileName);
				var destPath = path.join(destDir, fileName);
				if (!fs.existsSync(destPath)) {
					fs.symlinkSync(srcPath, destPath);
				}
			});
		}
	});
};

/**
 * Register base entities for dataflo.ws processing.
 */
module.exports.register = function (instanceType, instanceName, instanceClass) {
	if (!registry[instanceType]) {
		console.warn(
			'Unexpected instance type. Predefined types [ %s ]',
			instanceTypes.join(', ')
		);

		return;
	}

	registry[instanceType][instanceName] = instanceClass;
};

module.exports.common = common;
