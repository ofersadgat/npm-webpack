# npm-webpack
This will automatically export peerDependencies from the package.json

In your webpack.config:

var NpmPlugin = require('npm-webpack');

module.exports = {
	// The main part
	plugins: [
		new NpmPlugin()
	]
};
