import { type World } from './World'
import { type Hero } from './entities/Hero/Hero'

interface ICameraOptions {
  target: Hero
  world: World
  isBackScrollX: boolean
  screenSize: {
    width: number
    height: number
  }
}

export class Camera {
  #target
  #world
  #isBackScrollX
  #centerScreenPointX
  #rightBorderWorldPointX
  #lastTargetX = 0

  constructor ({ target, world, isBackScrollX, screenSize }: ICameraOptions) {
    this.#target = target
    this.#world = world
    this.#isBackScrollX = isBackScrollX

    this.#centerScreenPointX = screenSize.width / 2
    this.#rightBorderWorldPointX = this.#world.width - this.#centerScreenPointX
  }

  handleUpdate (): void {
    if (this.#target.x > this.#centerScreenPointX &&
            this.#target.x < this.#rightBorderWorldPointX &&
            (this.#isBackScrollX || this.#target.x > this.#lastTargetX)) {
      this.#world.x = this.#centerScreenPointX - this.#target.x
      this.#lastTargetX = this.#target.x
    }
  }
}
