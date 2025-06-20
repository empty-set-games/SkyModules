import { DependencyList } from 'react'
import globalify from 'sky/utilities/globalify'

import * as lib from '.'

globalify({ useTimeout: lib.default })

declare global {
    function useTimeout(callback: Function, interval: Time, deps?: DependencyList): void
}
