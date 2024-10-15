import { DehydratedState, QueryClient } from '@tanstack/react-query'
import { Resource, TFunction } from 'i18next'

import Store from '#/Store'

// https://vike.dev/pageContext#typescript
declare global {
    var afterHydration: boolean

    interface ImportMeta {
        readonly env: {
            [x: string]: undefined | string
        }
    }

    namespace Vike {
        interface PageContext {
            Page: () => React.ReactElement

            // server only
            title: string
            description: string
            ogTitle?: string
            ogType?: string
            ogImage?: string
            preloads: undefined | string[][]
            noIndex?: boolean
            client: QueryClient
            t: TFunction

            domain: string
            lng: string
            lngPrefix: string
            urlLogical: string

            initial: {
                store: Store
                title: string
                dehydratedState: DehydratedState
                ns: string[]
                resources: Resource
                ip: string
            }

            /** https://vike.dev/render */
            abortReason?: string
        }
    }
}
