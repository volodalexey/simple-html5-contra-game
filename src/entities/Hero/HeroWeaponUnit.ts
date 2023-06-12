import { type IControlContext } from '../../Game'
import { type IBulletContext } from '../Bullets/Bullet'
import { EntityType } from '../EntityType'
import { type HeroView } from './HeroView'

interface HeroWeaponUnitOptions {
  heroView: HeroView
}

export class HeroWeaponUnit {
  #bulletAngle!: number
  #bulletContext: IBulletContext = {
    x: 0,
    y: 0,
    angle: 0,
    type: EntityType.heroBullet
  }

  #heroView

  constructor ({ heroView }: HeroWeaponUnitOptions) {
    this.#heroView = heroView
  }

  get bulletContext (): IBulletContext {
    this.#bulletContext.x = this.#heroView.x + this.#heroView.bulletPointShift.x
    this.#bulletContext.y = this.#heroView.y + this.#heroView.bulletPointShift.y
    this.#bulletContext.angle = this.#heroView.isFliped
      ? this.#bulletAngle * -1 + 180
      : this.#bulletAngle

    return this.#bulletContext
  }

  setBulletAngle ({ controlContext, isJump }: { controlContext: IControlContext, isJump: boolean }): void {
    if (controlContext.left || controlContext.right) {
      if (controlContext.up) {
        this.#bulletAngle = -45
      } else if (controlContext.down) {
        this.#bulletAngle = 45
      } else {
        this.#bulletAngle = 0
      }
    } else {
      if (controlContext.up) {
        this.#bulletAngle = -90
      } else if (controlContext.down && isJump) {
        this.#bulletAngle = 90
      } else {
        this.#bulletAngle = 0
      }
    }
  }
}
