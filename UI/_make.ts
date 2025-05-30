import { TextView } from 'pkgs/troika-three-text'
import globalify from 'sky/utilities/globalify'

declare global {
    namespace UI {
        export interface MakeRoundedRectTextureParams {
            w: number
            h: number
            radius: number
            color: number
            opacity?: number
            strokeColor: number
            strokeWidth: number
            pixelRatio?: number
            rounded?: 'all' | 'top' | 'bottom'
        }
        function makeRoundedRectTexture(params: UI.MakeRoundedRectTextureParams): Three.Texture

        export interface MakeTextParams {
            text: string
            anchorX?: number | string
            anchorY?: number | string
            clipRect?: [number, number, number, number]
            color?: number
            curveRadius?: number
            depthOffset?: number
            direction?: string
            fillOpacity?: number
            font?: string
            fontSize?: number
            fontStyle?: string
            fontWeight?: string
            glyphGeometryDetail?: number
            gpuAccelerateSDF?: boolean
            letterSpacing?: number
            lineHeight?: number | string
            material?: Three.Material
            maxWidth?: number
            outlineBlur?: number | string
            outlineColor?: number
            outlineOffsetX?: number
            outlineOffsetY?: number
            outlineOpacity?: number
            outlineWidth?: number | string
            overflowWrap?: 'normal' | 'break-word'
            sdfGlyphSize?: number
            strokeColor?: number
            strokeOpacity?: number
            strokeWidth?: number | string
            textAlign?: 'left' | 'right' | 'center' | 'justify'
            textIndent?: number
            unicodeFontsUrl?: string
            whiteSpace?: 'normal' | 'nowrap'
        }
        function makeText(params: UI.MakeTextParams): TextView
    }
}

namespace module {
    export function makeRoundedRectTexture(params: UI.MakeRoundedRectTextureParams): Three.Texture {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        ctx.pixelRatio = params.pixelRatio ?? 1
        canvas.width = (params.w + params.strokeWidth) * ctx.pixelRatio
        canvas.height = (params.h + params.strokeWidth) * ctx.pixelRatio
        let drawFn = Canvas.drawRoundedRect

        if (params.rounded === 'top') {
            drawFn = Canvas.drawTopRoundedRect
        }

        if (params.rounded === 'bottom') {
            drawFn = Canvas.drawBottomRoundedRect
        }

        drawFn(ctx, {
            x: params.strokeWidth / 2,
            y: params.strokeWidth / 2,
            w: params.w,
            h: params.h,
            radius: params.radius * ctx.pixelRatio,
            color:
                new Three.Color(params.color).getStyle().slice(0, -1) +
                ',' +
                (params.opacity ?? 1).toString() +
                ')',
            strokeColor: new Three.Color(params.strokeColor).getStyle(),
            strokeWidth: params.strokeWidth,
        })
        const texture = new Three.CanvasTexture(canvas)
        canvas.remove()
        return texture
    }

    export function makeText(params: UI.MakeTextParams): TextView {
        const textView = new TextView()

        const { anchorX, anchorY, color, fontSize, ...otherParams } = params

        textView.anchorX = anchorX ?? 'center'
        textView.anchorY = anchorY ?? 'middle'
        textView.color = color ?? 0x000000
        textView.fontSize = fontSize ?? 16

        Object.keys(otherParams).forEach(k => {
            ;(textView as never)[k] = (otherParams as never)[k]
        })

        return textView
    }
}

globalify.namespace('UI', module)
