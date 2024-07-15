#!/usr/bin/env -S npx tsx
import path from 'path'

import args from 'args'

import __loadSkyConfig, { __getAppConfig } from './__loadSkyConfig'
import __run from './__run'
import __sdkPath from './__sdkPath'

args.option('port', 'The port on which the app will be running', 3000)
args.option('open', 'Expose', false)
args.option('host', '', false)

const flags = args.parse(process.argv, {
    name: 'sky web dev',
    mainColor: 'magenta',
    subColor: 'grey',
    mri: {},
})

export namespace web {
    dev()

    export async function dev(): Promise<void> {
        const name = process.argv[4]

        if (name == null || name === '') {
            // eslint-disable-next-line no-console
            console.error('missing app name')
            // eslint-disable-next-line
            return
        }

        const skyConfig = await __loadSkyConfig()

        if (!skyConfig) {
            return
        }

        const skyAppConfig = __getAppConfig(name, skyConfig)

        if (!skyAppConfig) {
            return
        }

        const env = {
            ...process.env,
            NODE_ENV: 'development',
            COMMAND: 'dev',
            SKY_CONFIG: JSON.stringify(skyConfig),
            SKY_APP_CONFIG: JSON.stringify(skyAppConfig),
            PORT: JSON.stringify(flags.port),
            OPEN: JSON.stringify(flags.open),
        }

        __run(
            `node --loader ${path.resolve(
                __sdkPath,
                'node_modules/ts-node/esm.mjs'
            )} --no-warnings ${__sdkPath}/commands/__web.ts`,
            {
                env,
            }
        )
    }
}
