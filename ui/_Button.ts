import './_UI'
import { TextView } from 'pkgs/troika-three-text'
import Sprite from 'sky/views/Sprite'
import 'sky/Canvas/global'

declare global {
    namespace UI {
        type ButtonParams = lib.ButtonParams

        type Button = lib.Button
        const Button: typeof lib.Button
    }
}

namespace lib {
    export interface ButtonParams {
        texture?: Three.Texture
        text: string
        x: number
        y: number
        w?: number
        h?: number
        click: () => void
    }
    export class Button extends Sprite {
        w!: number
        h!: number
        click: () => void
        promise: Promise<Button>

        constructor(deps: EffectDeps, params: ButtonParams) {
            super(deps)

            this.view.position.x = params.x
            this.view.position.y = params.y

            this.__textView = UI.makeText({
                text: params.text,
                color: 0xffffff,
                fontSize: 20,
                fontWeight: 'normal',
                fillOpacity: 1,
                strokeColor: 0xffffff,
                strokeWidth: 0,
                strokeOpacity: 0,
                outlineBlur: 0,
                outlineColor: 0x000000,
                outlineWidth: 0,
                outlineOpacity: 1,
            })

            this.__hoverTextView = UI.makeText({
                text: params.text,
                color: 0x000000,
                fontSize: 20,
                fontWeight: 'normal',
                fillOpacity: 1,
                strokeColor: 0x000000,
                strokeWidth: 0,
                strokeOpacity: 1,
                outlineBlur: 0,
                outlineColor: 0x000000,
                outlineWidth: 0,
                outlineOpacity: 1,
            })

            this.__pressTextView = UI.makeText({
                text: params.text,
                color: 0xffffff,
                fontSize: 20,
                fontWeight: 'normal',
                fillOpacity: 1,
                strokeColor: 0x000000,
                strokeWidth: 0,
                strokeOpacity: 1,
                outlineBlur: 0,
                outlineColor: 0x000000,
                outlineWidth: 0,
                outlineOpacity: 1,
            })

            this.click = params.click

            this.promise = until(async (): Promise<Button> => {
                await Promise.all([
                    new Promise<void>(resolve => {
                        this.__textView.sync(resolve)
                    }),

                    new Promise<void>(resolve => {
                        this.__hoverTextView.sync(resolve)
                    }),

                    new Promise<void>(resolve => {
                        this.__pressTextView.sync(resolve)
                    }),
                ])

                this.w =
                    params.w ?? Math.floor(this.__textView.geometry.boundingBox?.max.x! + 32) * 2
                this.h =
                    params.h ?? Math.floor(this.__textView.geometry.boundingBox?.max.y! + 2) * 2

                this.__texture = UI.makeTexture({
                    w: this.w,
                    h: this.h,
                    radius: 16,
                    color: 0x000000,
                    opacity: 0,
                    strokeColor: 0xffffff,
                    strokeWidth: 2,
                })

                this.__hoverTexture = UI.makeTexture({
                    w: this.w,
                    h: this.h,
                    radius: 16,
                    color: 0xffffff,
                    opacity: 1,
                    strokeColor: 0xffffff,
                    strokeWidth: 2,
                })

                this.__pressTexture = UI.makeTexture({
                    w: this.w,
                    h: this.h,
                    radius: 16,
                    color: 0x000000,
                    opacity: 0.5,
                    strokeColor: 0xffffff,
                    strokeWidth: 2,
                })

                const geometry = new Three.PlaneGeometry(this.w, this.h, 1, 1)
                const material = (this.__material = new Three.MeshBasicMaterial({
                    map: (params && params.texture) ?? this.__texture,
                    transparent: true,
                }))
                const plane = (this.__plane = new Three.Mesh(geometry, material))
                plane.renderOrder = -1
                this.view.renderOrder = 100
                plane.position.x = this.w / 2
                plane.position.y = this.h / 2

                this.__textView!.position.x = this.w / 2
                this.__textView!.position.y = this.h / 2
                this.__hoverTextView!.position.x = this.w / 2
                this.__hoverTextView!.position.y = this.h / 2
                this.__pressTextView!.position.x = this.w / 2
                this.__pressTextView!.position.y = this.h / 2

                this.view.add(plane)
                this.view.add(this.__textView)

                this.__updateState()

                return this
            })
        }

        globalMouseMove(ev: MouseMoveEvent): void {
            if (ev.isCaptured) {
                this.__hovered = false
                this.__updateState()
                return
            }

            this.__hovered = this.__checkPoint(new Vector2(ev.x, ev.y))

            this.__updateState()

            if (this.__hovered) {
                ev.isCaptured = true
            }
        }

        globalMouseDown(ev: MouseDownEvent): void {
            if (ev.isCaptured) {
                return
            }

            if (this.__hovered) {
                this.__waitClick = true

                ev.isCaptured = true
            }

            this.__updateState()
        }

        globalMouseUp(ev: MouseUpEvent): void {
            if (ev.isCaptured) {
                return
            }

            if (this.__hovered && this.__waitClick) {
                this.click()

                ev.isCaptured = true
            }

            this.__waitClick = false

            this.__updateState()
        }

        __updateState(): void {
            if (!this.__material) {
                return
            }

            if (this.__hovered) {
                if (this.__waitClick) {
                    this.__material.map = this.__pressTexture
                    this.view.remove(this.__textView)
                    this.view.remove(this.__hoverTextView)
                    this.view.add(this.__pressTextView)
                } else {
                    this.__material.map = this.__hoverTexture
                    this.view.remove(this.__textView)
                    this.view.add(this.__hoverTextView)
                    this.view.remove(this.__pressTextView)
                }
            } else {
                this.__material.map = this.__texture
                this.__plane.material = this.__material
                this.view.add(this.__textView)
                this.view.remove(this.__hoverTextView)
                this.view.remove(this.__pressTextView)
            }
        }

        __checkPoint(point: Vector2): boolean {
            if (point.x >= 0 && point.x <= this.w) {
                if (point.y >= 0 && point.y <= this.h) {
                    return true
                }
            }

            return false
        }

        __updateZOrder(ev: UpdateZOrderEvent): void {
            this.__plane.renderOrder = ev.z
            ++ev.z
            this.__textView.renderOrder = ev.z
            this.__hoverTextView.renderOrder = ev.z
            this.__pressTextView.renderOrder = ev.z
            ++ev.z
        }

        __plane!: Three.Mesh
        __material!: Three.MeshBasicMaterial
        __hovered: boolean = false
        __waitClick: boolean = false

        __texture!: Three.Texture
        __hoverTexture!: Three.Texture
        __pressTexture!: Three.Texture

        __textView: TextView
        __hoverTextView: TextView
        __pressTextView: TextView
    }
}

Object.assign(UI, lib)
