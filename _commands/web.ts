#!/usr/bin/env -S npx tsx
import args from 'args'

import { errorConsole } from '../helpers/console'

import __import from './__import'

function initArgs(): void {
    args.command('init', 'Init')
    args.command('dev', 'Dev')
    args.command('build', 'Build')
    args.command('start', 'Start')

    args.parse(process.argv, {
        name: 'sky web',
        mainColor: 'magenta',
        subColor: 'grey',
        mri: {},
    })
}

const command = process.argv[3]
if (!command) {
    initArgs()
    args.showHelp()
} else if (!__import(`./web-${command}.ts`)) {
    initArgs()
    errorConsole(`web: command "${command}" not found`)
    args.showHelp()
}
