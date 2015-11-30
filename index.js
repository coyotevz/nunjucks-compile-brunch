
var nunjucks = require('nunjucks');
var fs = require('fs');
var path = require('path');

var extend = function(object, source) {
  for (var key in source) object[key] = source[key];
  return object;
};

function NunjucksCompiler(config) {
  if (config == null) config = {};
  var nunjucks = config.plugins && config.plugins.nunjucks;
  this.config = (nunjucks && nunjucks.options) || nunjucks;
  this.configure();
};

NunjucksCompiler.prototype = extend(NunjucksCompiler.prototype, {
  brunchPlugin: true,
  type: 'template',
  extension: 'html',
  templatePath: 'app/templates/',

  configure: function() {
    var options = this.config || {};
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
      var name = path.replace(this.templatePath, '');
      result = nunjucks.precompile(path, {name: name});
    } catch (err) {
      return error = err;
    } finally {
      callback(error, result);
    }
  }
});

module.exports = NunjucksCompiler;
