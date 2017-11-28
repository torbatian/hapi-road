'use strict'

const Glob = require('glob')
const Hoek = require('hoek')
const Path = require('path')

exports.plugin = {
  once: true,
  pkg: require('../package.json'),

  register: (server, options) => {
    Hoek.assert(options, 'Hapi road options is missing')
    Hoek.assert(options.routes, 'Hapi road options.routes is missing')

    const globOptions = {
      nodir: true,
      strict: true,
      cwd: options.cwd || process.cwd(),
      ignore: options.ignore
    }

    options.routes = Array.isArray(options.routes) ? options.routes : [options.routes]

    options.routes.forEach(pattern => {
      const files = Glob.sync(pattern.globOptions)

      files.forEach(file => {
        const route = require(Path.join(globOptions.cwd, file))
        server.route(route.default || route)
      })
    })
  }
}
