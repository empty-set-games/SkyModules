import globalify from 'sky/utilities/globalify'

import * as pkg from '.'

globalify({ Sprite: pkg.default })

declare global {
    type Sprite = pkg.default
    const Sprite: typeof pkg.default
}
