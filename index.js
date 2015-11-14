
var fs = require('fs');
var path = require('path');

var ExternalModuleFactoryPlugin = require("webpack/lib/ExternalModuleFactoryPlugin");

function MistPlugin(options) {
  
}

MistPlugin.prototype.apply = function(compiler) {
  compiler.plugin('compile', function(params) {
    console.log('compile: ', params, '\n\n\n');

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

      var exportedModules = packageJson.peerDependencies || {};
      if (Object.keys(exportedModules).length > 0){
        Object.keys(exportedModules).forEach(function(exportedModule){
          exportedModules[exportedModule] = exportedModule;
        });
        console.log('exporting: ', exportedModules);
        params.normalModuleFactory.apply(new ExternalModuleFactoryPlugin('commonjs', exportedModules));
      }

      this.packageJson = packageJson;
    }
  }.bind(this));

};

module.exports = MistPlugin;
