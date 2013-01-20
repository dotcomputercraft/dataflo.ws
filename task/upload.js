var task         = require ('./base'),
	util         = require ('util'),
	formidable   = require ('formidable');


var upload = module.exports = function (config) {

	this.request = config.request;
	this.init (config);

};

util.inherits (upload, task);

util.extend (upload.prototype, {

	run: function () {

		var self = this;

		var form = new formidable.IncomingForm();
		// TODO: add support for parameters

		form.on ('fileBegin', function (name, file) {
			self.emit ('log', 'started loading '+name);
			// here we can overload generated file name
		});

		form.on ('file', function (name, file) {
			self.emit ('log', 'finished loading '+name);
		});
		
		form.on ('error', function (error) {
			self.emit ('error', 'form error '+ error);
		});

		form.on ('aborted', function () {
			self.emit ('error', 'form aborted');
		});

		form.on ('end', function () {
			self.emit ('log', 'form end');
		});

		form.parse(this.request, function(err, fields, files) {
			self.completed ({err: err, fields: fields, files: files});
		});

	}
});
