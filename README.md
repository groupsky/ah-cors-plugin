# ah-cors-plugin

[![CircleCI](https://circleci.com/gh/groupsky/ah-cors-plugin.svg?style=svg)](https://circleci.com/gh/groupsky/ah-cors-plugin)

Configure CORS origins for Actionhero v18+

***
**[NPM](https://www.npmjs.com/package/ah-cors-plugin) | [GitHub](https://github.com/groupsky/ah-cors-plugin)**
***

## Install & Setup

1. `npm install ah-cors-plugin --save`
2. Register the plugin

    ```diff
    // config/plugins.js
    exports['default'] = {
      plugins: (api) => {
        return {
    +      'ah-cors-plugin': { path: path.join(__dirname, '/../node_modules/ah-cors-plugin') }
        }
      }
    }
    
    ``` 

3. Configure the origins or use `ALLOWED_ORIGINS` environment

    ```js
    // config/cors.js
    exports[ 'default' ] = {
      cors: () => {
        return {
          // Should the plugin be enabled
          enabled: false,
          // List of origins that are allowed, all the rest will get `null` as `Access-Control-Allow-Origin`
          allowedOrigins: [ 'http://localhost:5000' ]
        }
      }
    }
    
    exports.production = {
      cors: () => {
        return {
          enabled: true
        }
      }
    }
    
    ```
