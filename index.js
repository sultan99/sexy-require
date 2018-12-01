var dirname = require(`path`).dirname
var join = require(`path`).join
var normalize = require(`path`).normalize
var existsSync = require(`fs`).existsSync
var readFileSync = require(`fs`).readFileSync

var shortcuts = {}

function findRootDir(path) {
  var packageJson = join(path, `package.json`)
  var parentPath = normalize(path + `/..`)
  return existsSync(packageJson) ? path : findRootDir(parentPath)
}

function getOptions(root) {
  var path = join(root, `.paths`)
  if (!existsSync(path)) return {}
  var text = readFileSync(path, {encoding: `utf8`})
  var re = /(\$[\w-]+)\s*=\s*(.+)/gm
  var match, options = {}
  while(match = re.exec(text)) {
    var name = match[1]
    var value = match[2]
    var dir = value === `/` ? root : join(root, value)
    options[name] = dir
  }
  return options
}

function setShortcuts(path) {
  var root = findRootDir(path)
  if (!shortcuts[root]) {
    shortcuts[root] = getOptions(root)
  }
  return shortcuts[root]
}

function callerPath() {
  var err = new Error()
  var re = /at require \(internal\/module\.js:11:18\)\n.+\((.*):\d+:\d+\)/m
  if (!err.stack.match(re)) {
    re = /at Object\.<anonymous> \((.+):\d+:\d+\)/m
  }
  return err.stack.match(re)[1]
}

function moduleSearch(path) {
  return function(mdl) {
    var re = new RegExp(mdl.replace(/\\/g, `\\\\`))
    return !path.search(re)
  }
}

function getRoot() {
  var path = dirname(callerPath())
  var modules = Object.keys(shortcuts).reverse()
  var findModule = moduleSearch(path)
  return modules.find(findModule)
}

function rootPath(path) {
  var root = getRoot()
  var dir = join(root, path)
  var exists = existsSync(dir) || existsSync(normalize(dir + `/..`))
  return exists && dir
}

function shortcutPath(path) {
  var root = getRoot()
  if (!root) return false
  var shortcut = path.match(/^\$[\w-]+/)[0]
  var dir = shortcuts[root][shortcut]
  return path.replace(shortcut, dir)
}

function getPaths(path) {
  var dir = path || callerPath()
  return setShortcuts(dir)
}

var Module = require(`module`)
var include = Module.prototype.require

Module.prototype.require = function(path) {
  var dir = path
  if (path[0] === `.`) return include.call(this, path)
  if (path[0] === `/`) dir = rootPath(path) || path
  if (path[0] === `$`) dir = shortcutPath(path) || path
  if (path === `sexy-require`) return getPaths()
  return include.call(this, dir)
}

module.exports = getPaths(module.parent.filename)
