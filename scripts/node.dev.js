/* eslint-disable @typescript-eslint/explicit-function-return-type */
const child_process = require('child_process')
const fs = require('fs')
const path = require('path')

const name = process.argv[2]

let existsTsx = fs.existsSync(path.resolve(name, 'index.tsx'))
let existsTs = fs.existsSync(path.resolve(name, 'index.ts'))
if (!existsTsx && !existsTs) {
    // eslint-disable-next-line no-console
    console.error('missing app name')
    return
}

run(existsTsx ? path.resolve(name, 'index.tsx') : path.resolve(name, 'index.ts'))

function run(scriptPath) {
    child_process.execSync(
        `node --no-warnings --watch --expose-gc --es-module-specifier-resolution=node --loader '${path.resolve(
            __dirname,
            '-tsconfig-paths-bootstrap.mjs'
        )}' \
            ${path.relative(process.cwd(), scriptPath)}`,
        {
            stdio: 'inherit',
            stdout: 'inherit',
            stdin: 'inherit',
            env: {
                TS_NODE_TRANSPILE_ONLY: true,
            },
        }
    )
}
