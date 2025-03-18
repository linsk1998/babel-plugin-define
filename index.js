var { parseExpression } = require('@babel/parser');
var { declare } = require('@babel/helper-plugin-utils');

function hasOwn(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
}

module.exports = declare((api, options = {}) => {
	api.assertVersion(7);
	const t = api.types;

	return {
		visitor: {
			Identifier: function(path, state) {
				if(path.isExpression()) {
					const binding = path.scope.getBinding(path.node.name);
					if(binding) {
						return;
					}
					if(hasOwn(options, path.node.name)) {
						var definition = options[path.node.name];
						path.replaceWith(parseExpression(definition));
					}
				}
			},
			MemberExpression(path, state) {
				path.skip();
			},
		}
	};
});
