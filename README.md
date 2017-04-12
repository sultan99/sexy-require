# Sexy require
No more ugly path inside the `require`. <br/>
```js
const user = require('../../../database/user') // 👎 what you have
// OR
const user = require('$db/user') // 👍 no matter how deep you are
```

## How to user
You need to make three simple steps to use it.
1. Install the package:<br/>
	`npm install sexy-require --save`

2. Define shortcuts of paths in your application package.json. If don't have it then create `package.json` file on root of your project folder:
```json
{
	"name": "your-app-name",
	"version": "0.0.2",
	"main": "app.js",
	"author": "your-name",
	"path": {
		"$home": "/",
		"#db": "/database",
		"$api": "/api/v1"
	}
}
```

3. Include `require('sexy-require')` once on top in your main application file. Anywhere in your project you can use the defined paths like the follow:
```js
const routers = require('$home/routers')
const product = require('$db/product')
const api = require('$api')
```
