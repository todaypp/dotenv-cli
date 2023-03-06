#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2))

var cli = require('./cli-base')

function printHelp () {
  console.log([
    'Usage: dotenv [--help] [--debug] [-e <path>] [-v <name>=<value>] [-p <variable name>] [-c [environment]] [-C [<envVarName>]] [-- command]',
    '  --help              print help',
    '  --debug             output the files that would be processed but don\'t actually parse them or run the `command`',
    '  -e <path>           parses the file <path> as a `.env` file and adds the variables to the environment',
    '  -e <path>           multiple -e flags are allowed',
    '  -v <name>=<value>   put variable <name> into environment using value <value>',
    '  -v <name>=<value>   multiple -v flags are allowed',
    '  -p <variable>       print value of <variable> to the console. If you specify this, you do not have to specify a `command`',
    '  -c [environment]    support cascading env variables from `.env`, `.env.<environment>`, `.env.local`, `.env.<environment>.local` files',
    '  -C [envVarName]     works like -c but set [environment] with [envVarName] environment variable automatically (default: `DOT_ENV`)',
    '  command             `command` is the actual command you want to run. Best practice is to precede this command with ` -- `. Everything after `--` is considered to be your command. So any flags will not be parsed by this tool but be passed to your command. If you do not do it, this tool will strip those flags'
  ].join('\n'))
}

cli(argv, printHelp)
