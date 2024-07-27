import { DependencyList } from 'react'
import globalify from 'sky/helpers/globalify'

import * as lib from '.'

globalify({ useInterval: lib.default })

declare global {
    function useInterval(callback: Function, interval: number, deps?: DependencyList): void
}
