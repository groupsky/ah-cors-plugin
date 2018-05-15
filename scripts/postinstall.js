#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const projectApiConfigLocation = path.normalize(path.join(process.cwd(), '..', '..', ' config', ' api.js'))

const localConfigFile = path.normalize(path.join(__dirname, '..', 'config', 'cors.js'))
const projectConfigFile = path.normalize(path.join(process.cwd(), '..', '..', 'config', 'cors.js'))

try {
  fs.lstatSync(projectApiConfigLocation)
  // Only run if api config file exists (prevents install while in development)
  try {
    fs.lstatSync(projectConfigFile)
  } catch (ex) {
    // Only try to copy the files required for cli operations if sequelize.js is being newly created.
    console.log('copying ' + localConfigFile + ' to ' + projectConfigFile)
    fs.createReadStream(localConfigFile).pipe(fs.createWriteStream(projectConfigFile))
  }
} catch (ex) {
  console.log('postinstall script skipped')
}
