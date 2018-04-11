# 💃🏻 Sexy require v 1.1
No more ugly path inside the `require`. <br/>
```js
const user = require('../../../database/user') // 👎 what you have
// OR
const user = require('$db/user') // 👍 no matter how deep you are
const product = require('/database/product') // 👍 alias or pathing from application directory
```

## Getting started
Three simple steps to use it.
1. Install the package: `npm install sexy-require --save`

2. Include `require('sexy-require')` once on the top of your main application file.
```js
require('sexy-require')
const routers = require('/routers')
const api = require('$api')
...
```

3. Optional step. Path configuration can be defined in `.paths` file on root directory of your project.
```
$db = /server/database
$api-v1 = /server/api/legacy
$api-v2 = /server/api/v2
```

## List of paths
Anywhere in your project you can get the defined shortcut paths:
```js
const path = require(`sexy-require`)
console.log(path.$db) // -> '/full/path/to/app/server/database'
```

## Changelog
### v 1.1
 - Seamless module require. If a given path doesn't exist in the app directory it will be ignored by sexy-require.
### v 1.0
 - definition of path shortcuts moved from `package.json` to `.paths` config file
 - depending modules can use `sexy-require` too, previously it was not possible
 - supporting pathing from root directory, now it is not required to define shortcuts
 - caching and optimized code for higher performance

### v 0.1
 - returns defined shortcut list with absolute path
 - minor bug fixes
