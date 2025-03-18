var { parseExpression } = require('@babel/parser');
var { declare } = require('@babel/helper-plugin-utils');

function hasOwn(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
}

module.exports = declare((api, options = {}) => {
	api.assertVersion(7);
	const t = api.types;

	function flatten(node) {
		if (t.isMemberExpression(node)) {
			if (!node.computed) {
				const object = node.object;
				const property = node.property;
				if (t.isIdentifier(property)) {
					const objectPath = flatten(object);
					if (objectPath) {
						return `${objectPath}.${property.name}`;
					}
				}
			}
		} else if (t.isIdentifier(node)) {
			return node.name;
		} else if (t.isMetaProperty(node)) {
			return `import.meta`;
		}
		return null;
	}

	return {
		visitor: {
			Identifier: function(path, state) {
				if (hasOwn(options, path.node.name)) {
					if (path.isExpression()) {
						const binding = path.scope.getBinding(path.node.name);
						if (!binding) {
							var definition = options[path.node.name];
							path.replaceWith(parseExpression(definition));
						}
					}
				}
			},
			MemberExpression(path, state) {
				const node = path.node;
				const keypath = flatten(node);
				if (keypath) {
					path.skip();
					if (hasOwn(options, keypath)) {
						if (!t.isMetaProperty(node.object)) {
							if (!path.isExpression()) return;
							if (path.scope.getBinding(path.node.name)) return;
						}
						var definition = options[keypath];
						path.replaceWith(parseExpression(definition));
					}
				}
			},
			UnaryExpression(path, state) {
				const node = path.node;
				if (node.operator === "typeof") {
					const arg = node.argument;
					let keypath = flatten(arg);
					if (keypath) {
						keypath = `typeof ${keypath}`;
						if (hasOwn(options, keypath)) {
							if (!t.isMetaProperty(arg.object)) {
								if (!path.isExpression()) return;
								if (path.scope.getBinding(path.node.name)) return;
							}
							var definition = options[keypath];
							path.replaceWith(parseExpression(definition));
							path.skip();
						}
					}
				}
			}
		}
	};
});
