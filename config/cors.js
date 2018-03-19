let origins = false

if (process.env.ALLOWED_ORIGINS) {
  origins = process.env.ALLOWED_ORIGINS.split(',')
}

exports[ 'default' ] = {
  cors: () => {
    return {
      // Should the plugin be enabled
      enabled: false,
      // List of origins that are allowed, all the rest will get `Access-Control-Allow-Origin: null`
      allowedOrigins: origins || [ 'http://localhost:8080' ]
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
