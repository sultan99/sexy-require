# Sexy require
No more ugly path inside the `require`. <br/>
```js
const user = require('../../../database/user') // 👎 what you have
// OR
const user = require('$db/user') // 👍 no matter how deep you are
```

## How to use
Three simple steps to use it.
1. Install the package:<br/>
  `npm install sexy-require --save`

2. Define shortcuts of paths in your application package.json:

  ```json
  {
    "name": "your-app-name",
    "version": "0.0.0",
    "main": "app.js",
    "author": "your-name",
    "path": {
        "$home": "/",
        "$db": "/database/models",
        "$api": "/api/v1"
    }
  }
  ```

3. Include `require('sexy-require')` once on the top in your main application file.<br/>
```js
require('sexy-require')
const routers = require('$home/routers')
const api = require('$api')
...
```

## List of paths
Anywhere in your project you can use the defined paths:
```js
const path = require(`sexy-require`)
console.log(path.$db) // -> '/database/models'
```
