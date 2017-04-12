const Module = require(`module`)
const join = require(`path`).join
const normalize = require(`path`).normalize
const paths = require(`../../package.json`).path
const _require = Module.prototype.require

Module.prototype.require = function(path) {
	if (path.indexOf(`$`) >= 0) {
		for (let dirname in paths) {
			path = path.replace(dirname, paths[dirname])
		}
	}
	const root = normalize(`${__dirname}/../..`)
	return _require.call(this, join(root, path))
}

module.exports = Module.prototype.require
