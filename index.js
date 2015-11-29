
var nunjucks = require('nunjucks');
var fs = require('fs');
var path = require('path');

var extend = function(object, source) {
  for (var key in source) object[key] = source[key];
  return object;
};

function NunjucksCompiler(config) {
  this.config = config;
  this.configure();
};

NunjucksCompiler.prototype = extend(NunjucksCompiler.prototype, {
  brunchPlugin: true,
  type: 'template',
  extension: 'html',
  templatePath: 'app/templates/',

  configure: function() {
    var options;
    if ((this.config.plugins != null) &&
        (this.config.plugins.nunjucks != null) ) {
      options = this.config.plugins.nunjucks;
    } else {
      options = {};
    }
    if (options.templatePath != null) {
      this.templatePath = options.templatePath;
    }
  },

  getDependencies: function(data, path, callback) {
    var match = data.match(/extends '([a-zA-Z\/]*)'/i);
    var dependencies = [];
    if (match && match[1]) {
      //dependencies.push("app/" + match[1] + '.html');
      dependencies.push(this.templatePath + match[1]);
    }
    callback(null, dependencies);
  },

  compile: function(data, path, callback) {
    var error, filename, result;
    try {
      //var name = path.replace(/^app\//, '').split(".")[0];
      console.log('path:', path);
      var name = path.replace(this.templatePath, '');
      console.log('compiling:', name);
      result = nunjucks.precompile(path, {name: name});
    } catch (err) {
      return error = err;
    } finally {
      callback(error, result);
    }
  }
});

module.exports = NunjucksCompiler;
