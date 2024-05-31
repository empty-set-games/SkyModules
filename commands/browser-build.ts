#!/usr/bin/env -S npx tsx
import path from 'path'

import { b, e, purple, red } from './__coloredConsole'
import __loadSkyConfig, { __getAppConfig } from './__loadSkyConfig'

export namespace browser {
    build()

    export async function build(): Promise<void> {
        const name = process.argv[4]

        if (name == null || name === '') {
            // eslint-disable-next-line no-console
            console.error('missing app name')
            return
        }

        const skyConfig = __loadSkyConfig()

        if (!skyConfig) {
            return
        }

        const skyAppConfig = __getAppConfig(name, skyConfig)

        if (!skyAppConfig) {
            return
        }
    }
}
