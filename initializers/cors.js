const { api, Initializer } = require('actionhero')

module.exports = class MyInitializer extends Initializer {
  constructor () {
    super()
    this.name = 'cors'
  }

  initialize () {
    const config = api.config.cors
    if (!config.enabled) {
      api.log('CORS Origin Header Control disabled', 'info')
      return
    }
    if (!config.allowedOrigins || config.allowedOrigins.length === 0) {
      api.log('CORS Origin Header Control enabled, but no allowedOrigins are set!', 'error')
      return
    }
    api.log('CORS Origin Header Control enabled', 'info', config.allowedOrigins)

    const middleware = {
      name: 'cors',
      create: ({ type, rawConnection: { req: { headers: { origin } }, responseHeaders } }) => {
        // we are only applicable to web connections
        if (type !== 'web') {
          return
        }

        // if there is no origin header we don't have anything to validate, most likely a non-browser connection,
        // so CORS doesn't apply
        if (!origin) {
          return
        }

        // is the origin allowed?
        const allowed = config.allowedOrigins.indexOf(origin) !== -1
        api.log('origin checked', 'debug', { origin, allowed })

        // set the header according to allowed or not
        responseHeaders.push([ 'Access-Control-Allow-Origin', allowed ? origin : 'null' ])
      }
    }

    api.connections.addMiddleware(middleware)
  }
}
