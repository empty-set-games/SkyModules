import globalify from 'sky/utilities/globalify'

import * as pkg from '.'

globalify({ until: pkg.default })

declare global {
    function until<T, A extends unknown[]>(
        callback: (...args: A) => Promise<T>,
        ...args: A
    ): Promise<T>
}
