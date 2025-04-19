import globalify from 'sky/utilities/globalify'

declare global {
    namespace UI {
        type ContainerParams = UILib.ContainerParams
        type Container = UILib.Container
        const Container: typeof UILib.Container
    }
}

namespace UILib {
    export interface ContainerParams {
        x: number
        y: number
        w?: number
        h?: number
    }
    export class Container extends Sprite {
        add(element: Three.Object3D): this {
            super.add(element)

            const uiRoot = this.effect.context(UI.Root)

            uiRoot.updateZOrder()

            return this
        }

        remove(element: Three.Object3D): this {
            super.remove(element)

            const uiRoot = this.effect.context(UI.Root)

            uiRoot.updateZOrder()

            return this
        }
    }
}

globalify.namespace('UI', UILib)
