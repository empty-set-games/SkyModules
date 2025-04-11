import Vector2 from 'sky/math/Vector2'
import Vector3 from 'sky/math/Vector3'
import { Camera } from 'sky/pkgs/three'
import 'sky/renderers/Sky.Renderer'

export interface MouseControllerOptions {
    onUpdate?: () => void
}
export default class MouseController {
    readonly effect: Effect

    mouse = new Vector2()
    onUpdate?: () => void

    constructor(deps: EffectDeps, options?: MouseControllerOptions) {
        this.effect = new Effect(deps)

        if (options) {
            const { onUpdate } = options

            this.onUpdate = onUpdate
        }
    }

    onRendererContext(): void {
        new WindowEventListener(
            'mousemove',
            ev => {
                this.__mouse = new Vector2(ev.clientX, ev.clientY)
                this.__updateMouse()
            },
            [this.effect]
        )
        new WindowEventListener(
            'resize',
            () => {
                this.__updateMouse()
            },
            [this.effect]
        )
    }

    getCameraProjectionXY(options: { camera: Camera; z: number }): Vector2 {
        const { camera, z } = options
        const vec = new Vector3(this.mouse.x, this.mouse.y, z)
        vec.unproject(camera)
        vec.sub(camera.position).normalize()
        const distance = -camera.position.z / vec.z
        const position = new Vector3().copy(camera.position).add(vec.multiplyScalar(distance))
        return new Vector2().copy(position)
    }

    __updateMouse(): void {
        const renderer = this.effect.context(Sky.Renderer)
        const [w, h] = renderer.size()
        this.mouse.set((this.__mouse.x / w) * 2 - 1, -(this.__mouse.y / h) * 2 + 1)
        this.onUpdate && this.onUpdate()
    }

    private __mouse!: Vector2
}
