#!/usr/bin/env -S pnpm exec tsx
import fs from 'fs'
import path from 'path'

import { magenta, bright, reset } from 'sky/utilities/console'

import __loadSkyConfig, { SkyApp, SkyConfig, SkyModule } from './__loadSkyConfig'
import __sdkPath from './__skyPath'

initTsConfigs()

const modules = JSON.parse(fs.readFileSync('.dev/modules.json', 'utf-8'))

async function initTsConfigs(): Promise<void> {
    const skyConfig = await __loadSkyConfig()

    if (!skyConfig) {
        return
    }

    Object.keys(skyConfig.modules).map(name => {
        if (skyConfig.modules[name].path.startsWith('node_modules')) {
            return
        }

        if (skyConfig.modules[name].path.startsWith('../')) {
            return
        }

        initTsConfig(skyConfig.modules[name], true, skyConfig)
    })
    Object.keys(skyConfig.examples).map(name =>
        initTsConfig(skyConfig.examples[name], false, skyConfig)
    )
    Object.keys(skyConfig.apps).map(name => initTsConfig(skyConfig.apps[name], false, skyConfig))
}

function initTsConfig(module: SkyModule | SkyApp, isModule: boolean, skyConfig: SkyConfig): void {
    const modulesAndAppsPaths = [
        ...[
            ...new Set(
                Object.keys(skyConfig.modules).map(name =>
                    path.relative(module.path, path.join(skyConfig.modules[name].path, 'pkgs'))
                )
            ).values(),
        ].map(pkgsPath => ({
            name: 'pkgs',
            path: pkgsPath,
        })),
        ...Object.keys(skyConfig.modules).map(name => ({
            name,
            path: path.relative(module.path, skyConfig.modules[name].path),
        })),
        {
            name: '#',
            path: isModule
                ? path.relative(module.path, path.join(__sdkPath, '_commands/assets/web-initial'))
                : '.',
        },
        ...Object.keys(skyConfig.apps).map(name => ({
            name,
            path: path.relative(module.path, skyConfig.apps[name].path),
        })),
    ]

    if ((module as SkyApp).public) {
        modulesAndAppsPaths.push({
            name: 'public',
            path: path.relative(module.path, (module as SkyApp).public),
        })
    }

    const tsConfig = {
        compilerOptions: {
            strict: true,
            lib: ['ES2021', 'DOM'],
            jsx: 'react-jsx',
            module: 'ES2022',
            target: 'ES2017',
            moduleResolution: 'bundler',
            esModuleInterop: true,
            resolveJsonModule: true,
            experimentalDecorators: true,
            typeRoots: Object.keys(skyConfig.modules).map(name =>
                path.relative(
                    module.path,
                    path.join(skyConfig.modules[name].path, 'node_modules/@types')
                )
            ),
            baseUrl: '.',
            paths: {} as Record<string, string[]>,
        },

        include: [
            path.relative(module.path, 'sky.config.ts'),
            path.relative(module.path, 'deploy.ts'),
            ...modulesAndAppsPaths.map(({ path }) => (path === '' ? '.' : `${path}`)),
            ...Object.keys(modules).map(k => path.relative(module.path, modules[k])),
        ],

        exclude: [
            ...Object.keys(skyConfig.modules).map(name =>
                path.relative(module.path, path.join(skyConfig.modules[name].path, 'node_modules'))
            ),
            path.relative(module.path, path.join(process.cwd(), 'node_modules')),
        ],
    }

    modulesAndAppsPaths.forEach(({ name, path }) => {
        tsConfig.compilerOptions.paths[`${name}/*`] ??= []
        tsConfig.compilerOptions.paths[`${name}/*`].push(path === '' ? './*' : `${path}/*`)
    })

    process.stdout.write(
        `${magenta}${bright}Rewrite config ${path.join(module.path, 'tsconfig.json')}${reset}`
    )
    fs.writeFileSync(
        path.resolve(module.path, 'tsconfig.json'),
        JSON.stringify(tsConfig, null, '    ')
    )
    process.stdout.write(` 👌\n`)
}
