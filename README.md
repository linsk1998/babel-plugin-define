# Define constants to replace with expression

This plugin allows replace ``identifier`` with other expression or literal, for example
when we want to specify in webpack's config different parameters for our code.

Consider the following example, in which we would like to use different
code dependant on the parameter passed from webpack/.babelrc:

```javascript
import LiveUI from './LiveUI';
import ReportViewer from './ReportViewer';

export { __ACTIVE_CONFIG__ as default };
```

## Config example:

### .babelrc

```json
{
   "presets": ["es2015", "react", "stage-1"],
   "plugins": [
     ["transform-decorators-legacy"],
     ["transform-inline-environment-variables"],
     [ "define", {
        "__API_ROOT__": "document.location.origin + '/api'",
        "__SOCKET_ROOT__": "document.location.origin",
        "__DEBUG__": "false",
        "__ACTIVE_CONFIG__": "LiveUI"
     } ]

   ]
}
```

### webpack.config.js

```javascript
var defines = {
  '__API_ROOT__': 'document.location.origin + "/api"',
  '__SOCKET_ROOT__': 'document.location.origin',
  '__DEBUG__': JSON.stringify( JSON.parse( process.env.BUILD_DEBUG || 'false' ) ),
  '__ACTIVE_CONFIG__': 'LiveUI'
};

var babelConfig = JSON.parse( fs.readFileSync('.babelrc') );
babelConfig.plugins.push( [ "define", defines ] );

...
module.exports = {
  ...
  module: {
    loaders: [
      ...
      { test: /\.js?$/, loader: 'babel', exclude: /node_modules|bower_components/, query: babelConfig },
      ...
    ]
  }
};
```
