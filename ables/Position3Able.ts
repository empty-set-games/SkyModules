import 'features/ecs/global'
import Vector3 from 'math/Vector3'

export default class Move3Able extends Component {
    position: Vector3

    constructor(entity: Entity, x?: number, y?: number, z?: number) {
        super(entity)

        this.position = new Vector3(x, y, z)
    }
}
