const fs = require("fs");
const assert = require('assert');
const { transform } = require("@babel/core");
const plugin = require("../index");

function test(title, options) {
	it(title, function () {
		const file = 'tests/case/' + title;
		const fileIn = file + '.js';
		const fileOut = file + '.out.js';
		// 使用 Fixture 作为输入
		const inputCode = fs.readFileSync(fileIn, 'utf8');
		// 调用插件转换
		const { code } = transform(inputCode, {
			filename: fileIn,
			plugins: [[plugin, options]]
		});
		// 验证输出
		assert.strictEqual(code.trim(), fs.readFileSync(fileOut, 'utf8').trim());
	});
}

describe('babel-plugin-transform-private-to-hash', function () {
	test('identifier', {
		'__API_ROOT__': 'document.location.origin + "/api"',
		'__SOCKET_ROOT__': 'document.location.origin',
		'__DEBUG__': JSON.stringify(JSON.parse(process.env.BUILD_DEBUG || 'false')),
		'__ACTIVE_CONFIG__': 'LiveUI'
	});
	test('scope', {
		'__API_ROOT__': 'document.location.origin + "/api"',
		'__SOCKET_ROOT__': 'document.location.origin',
		'__DEBUG__': JSON.stringify(JSON.parse(process.env.BUILD_DEBUG || 'false')),
		'__ACTIVE_CONFIG__': 'LiveUI'
	});
});
