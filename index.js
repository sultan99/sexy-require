var dirname = require(`path`).dirname
var join = require(`path`).join
var normalize = require(`path`).normalize
var existsSync = require(`fs`).existsSync
var readFileSync = require(`fs`).readFileSync

var shortcuts = {}

function findRootDir(path) {
  var package = join(path, `package.json`)
  var parentPath = normalize(path + `/..`)
  return existsSync(package) ? path : findRootDir(parentPath)
}

function getOptions(root) {
  var path = join(root, `.paths`)
  var text = readFileSync(path, {encoding: `utf8`})
  var re = /(\$[\w-]+)\s*=\s*(.+)/gm
  var match, options = {}
  while(match = re.exec(text)) {
    var name = match[1]
    var value = match[2]
    options[name] = value === `/` ? root : join(root, value)
  }
  return options
}

function setShortcuts(path) {
  var dir = findRootDir(path)
  shortcuts[dir] = getOptions(dir)
  return shortcuts[dir]
}

function callerPath() {
  var err = new Error()
  var re = /at Object\.<anonymous> \((.*):\d+:\d+\)/m
  return err.stack.match(re)[1]
}

function moduleSearch(path) {
  return function(item) {
    var re = new RegExp(item.replace(/\\/g, `\\\\`))
    return path.search(re) === 0
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
  return root ? join(root, path) : null
}

function shortcutPath(path) {
  var root = getRoot()
  if (!root) return null
  var shortcut = path.match(/^\$\w+/)[0]
  var dir = shortcuts[root][shortcut]
  dir = path.replace(shortcut, dir)
  return dir
}

function getPaths(path) {
  var dir = path ? path : callerPath()
  return setShortcuts(dirname(dir))
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
