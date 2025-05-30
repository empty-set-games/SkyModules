import globalify from 'sky/utilities/globalify'

declare global {
    namespace Canvas {
        function drawText(ctx: CanvasRenderingContext2D, text: string): void
    }
}

namespace module {
    export function drawText(ctx: CanvasRenderingContext2D, text: string): TextMetrics {
        return ctx.measureText(text)
    }
}

globalify.namespace('Canvas', module)
