/* globals after, before, describe, it */

require('should')

const request = require('request-promise-native')
const path = require('path')

process.env.PROJECT_ROOT = path.join(__dirname, '..', 'node_modules', 'actionhero')

const ActionHero = require('actionhero')
const actionhero = new ActionHero.Process()

let api
let url

describe('CORS Middleware', () => {
  describe('allow all', () => {
    before(async () => {
      let configChanges = {
        cors: {
          enabled: true,
          allowedOrigins: '*'
        },
        plugins: {
          'ah-cors-plugin': { path: path.join(__dirname, '..') }
        }
      }
      api = await actionhero.start({ configChanges })
      url = 'http://localhost:' + api.config.servers.web.port
    })

    after(async () => { await actionhero.stop() })

    it('should be up and return data', async () => {
      await request.get(url + '/api/randomNumber')
      // should throw no errors
    })

    it('should allow any origin', async () => {
      const response = await request.get({
        url: url + '/api/randomNumber',
        headers: { Origin: 'http://example.domain.com:12345' },
        resolveWithFullResponse: true
      })
      response.should.have.property('headers').Object()
      response.headers.should.have.property('access-control-allow-origin', 'http://example.domain.com:12345')
    })
  })

  describe('single origin', () => {
    before(async () => {
      let configChanges = {
        cors: {
          enabled: true,
          allowedOrigins: 'http://localhost:5000'
        },
        plugins: {
          'ah-cors-plugin': { path: path.join(__dirname, '..') }
        }
      }
      api = await actionhero.start({ configChanges })
      url = 'http://localhost:' + api.config.servers.web.port
    })

    after(async () => { await actionhero.stop() })

    it('should be up and return data', async () => {
      await request.get(url + '/api/randomNumber')
      // should throw no errors
    })

    it('should allow any origin', async () => {
      const response = await request.get({
        url: url + '/api/randomNumber',
        headers: { Origin: 'http://localhost:5000' },
        resolveWithFullResponse: true
      })
      response.should.have.property('headers').Object()
      response.headers.should.have.property('access-control-allow-origin', 'http://localhost:5000')
    })

    it('should respond to unknown origin', async () => {
      const response = await request.get({
        url: url + '/api/randomNumber',
        headers: { Origin: 'http://localhost:8000' },
        resolveWithFullResponse: true
      })
      response.should.have.property('headers').Object()
      response.headers.should.have.property('access-control-allow-origin', 'null')
    })
  })

  describe('multiple origins', () => {
    before(async () => {
      let configChanges = {
        cors: {
          enabled: true,
          allowedOrigins: [ 'http://localhost:5000', 'http://localhost:8000' ]
        },
        plugins: {
          'ah-cors-plugin': { path: path.join(__dirname, '..') }
        }
      }
      api = await actionhero.start({ configChanges })
      url = 'http://localhost:' + api.config.servers.web.port
    })

    after(async () => { await actionhero.stop() })

    it('should be up and return data', async () => {
      await request.get(url + '/api/randomNumber')
      // should throw no errors
    })

    it('should respond to allowed origin', async () => {
      const response = await request.get({
        url: url + '/api/randomNumber',
        headers: { Origin: 'http://localhost:5000' },
        resolveWithFullResponse: true
      })
      response.should.have.property('headers').Object()
      response.headers.should.have.property('access-control-allow-origin', 'http://localhost:5000')
    })

    it('should respond to second allowed origin', async () => {
      const response = await request.get({
        url: url + '/api/randomNumber',
        headers: { Origin: 'http://localhost:8000' },
        resolveWithFullResponse: true
      })
      response.should.have.property('headers').Object()
      response.headers.should.have.property('access-control-allow-origin', 'http://localhost:8000')
    })

    it('should respond to unknown origin', async () => {
      const response = await request.get({
        url: url + '/api/randomNumber',
        headers: { Origin: 'http://localhost:9999' },
        resolveWithFullResponse: true
      })
      response.should.have.property('headers').Object()
      response.headers.should.have.property('access-control-allow-origin', 'null')
    })
  })
})
