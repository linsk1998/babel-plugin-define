var { expression } = require('@babel/template');
var { declare } = require('@babel/helper-plugin-utils');

function getAst(t, code) {
	// we first try to see if it's a simple stringified value
	try {
		var val = JSON.parse(code);
		return t.valueToNode(val);
	} catch (e) { }

	// if we reached here, it's probably not a simple value but some code
	var ast = expression(code)();
	return ast;
}

module.exports = declare((api, options = {}) => {
	api.assertVersion(7);
	const t = api.types;

	return {
		visitor: {
			Identifier: function (path, state) {
				if (t.isIdentifier(path.node)) {
					if (options.hasOwnProperty(path.node.name)) {
						var definition = state.opts[path.node.name];
						path.replaceWith(getAst(t, definition));
					}
				}
			}
		}
	};
});
