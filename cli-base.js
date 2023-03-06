#!/usr/bin/env node

var spawn = require('cross-spawn')
var path = require('path')

var dotenv = require('dotenv')
var dotenvExpand = require('dotenv-expand').expand

module.exports = function (argv, printHelp) {
  if (argv.help || argv.h) {
    printHelp()
    process.exit()
  }

  var paths = []
  if (argv.e) {
    if (typeof argv.e === 'string') {
      paths.push(argv.e)
    } else {
      paths.push(...argv.e)
    }
  } else {
    paths.push('.env')
  }

  if (argv.c) {
    paths = paths.reduce((accumulator, path) => accumulator.concat(
      typeof argv.c === 'string'
        ? [`${path}.${argv.c}.local`, `${path}.local`, `${path}.${argv.c}`, path]
        : [`${path}.local`, path]
    ), [])
  }

  if (argv.C) {
    var dotEnvName = typeof argv.C === 'string' ? argv.C : 'DOT_ENV'
    var dotEnv = process.env[dotEnvName] || ''
    paths = paths.reduce((accumulator, path) => accumulator.concat(
      dotEnv && dotEnv !== ''
        ? [`${path}.${dotEnv}.local`, `${path}.local`, `${path}.${dotEnv}`, path]
        : [`${path}.local`, path]
    ), [])
  }

  function validateCmdVariable (param) {
    if (!param.match(/^\w+=[a-zA-Z0-9"=^!?%@_&\-/:;.]+$/)) {
      console.error('Unexpected argument ' + param + '. Expected variable in format variable=value')
      process.exit(1)
    }

    return param
  }
  var variables = []
  if (argv.v) {
    if (typeof argv.v === 'string') {
      variables.push(validateCmdVariable(argv.v))
    } else {
      variables.push(...argv.v.map(validateCmdVariable))
    }
  }
  var parsedVariables = dotenv.parse(Buffer.from(variables.join('\n')))

  if (argv.debug) {
    console.log(paths)
    console.log(parsedVariables)
    process.exit()
  }

  paths.forEach(function (env) {
    dotenvExpand(dotenv.config({ path: path.resolve(env) }))
  })
  Object.assign(process.env, parsedVariables)

  if (argv.p) {
    var value = process.env[argv.p]
    console.log(value != null ? value : '')
    process.exit()
  }

  var command = argv._[0]
  if (!command) {
    printHelp()
    process.exit(1)
  }

  spawn(command, argv._.slice(1), { stdio: 'inherit' })
    .on('exit', function (exitCode, signal) {
      if (typeof exitCode === 'number') {
        process.exit(exitCode)
      } else {
        process.kill(process.pid, signal)
      }
    })
}
