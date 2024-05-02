import globalify from 'helpers/globalify'
import Vector3 from 'math/Vector3'
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera'

import * as module from './-ThirdPersonCameraController'

globalify({ ThirdPersonCameraController: module.default })

declare global {
    interface ThirdPersonCameraControllerOptions {
        camera: PerspectiveCamera
        target: Vector3
        onUpdate?: () => void
    }
    class ThirdPersonCameraController extends Effect {
        readonly camera: PerspectiveCamera
        readonly target: Vector3
        readonly angles: [number, number]

        constructor(deps: EffectDeps, options: ThirdPersonCameraControllerOptions)
    }
}
