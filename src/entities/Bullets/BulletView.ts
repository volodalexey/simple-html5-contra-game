import { EntityView } from '../EntityView'

export class BulletView extends EntityView {
  #collisionBox = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }

  constructor () {
    super()

    this.#collisionBox.width = 5
    this.#collisionBox.height = 5
  }
}
