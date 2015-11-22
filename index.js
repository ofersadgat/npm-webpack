
var fs = require('fs');
var path = require('path');

var ExternalModuleFactoryPlugin = require("webpack/lib/ExternalModuleFactoryPlugin");

function NpmPlugin(options) {
  options = options || {};
  options.type = options.type || 'commonjs';
  options.packageJsonKeys = options.packageJsonKeys || ['peerDependencies', 'externalDependencies'];
  this.options = options;
}

NpmPlugin.prototype.apply = function(compiler) {
  compiler.plugin('compile', function(params) {

    var packageJsonPath = path.resolve(params.normalModuleFactory.context, 'package.json');
    if (fs.existsSync(packageJsonPath)){
      var packageJsonString = fs.readFileSync(packageJsonPath, "utf8");
      var packageJson;
      try {
        packageJson = JSON.parse(packageJsonString);
      } catch (e){
        console.error('Invalid package.json');
        return;
      }

      var exportedModules = {};
      this.options.packageJsonKeys.forEach(function(packageJsonKey){
        var currentExportedModules = packageJson[packageJsonKey];
        if (currentExportedModules){
          Object.keys(currentExportedModules).forEach(function(exportedModule){
            exportedModules[exportedModule] = currentExportedModules[exportedModule];
          });
        }
      });
      if (Object.keys(exportedModules).length > 0){
        Object.keys(exportedModules).forEach(function(exportedModule){
          exportedModules[exportedModule] = exportedModule;
        });
        params.normalModuleFactory.apply(new ExternalModuleFactoryPlugin(this.options.type, exportedModules));
      }

      this.packageJson = packageJson;
    }
  }.bind(this));

};

module.exports = NpmPlugin;
