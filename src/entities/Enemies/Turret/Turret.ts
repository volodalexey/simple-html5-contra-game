import { type BulletFactory } from '../../Bullets/BulletFactory'
import { Entity } from '../../Entity'
import { EntityType } from '../../EntityType'
import { type Hero } from '../../Hero/Hero'
import { type TurretView } from './TurretView'

interface ITurretOptions {
  view: TurretView
  target: Hero
  bulletFactory: BulletFactory
}

export class Turret extends Entity<TurretView> {
  #target
  #bulletFactory
  #timeCounter = 0
  #health = 5

  type = EntityType.enemy

  constructor ({ view, target, bulletFactory }: ITurretOptions) {
    super(view)

    this.#target = target
    this.#bulletFactory = bulletFactory

    this.isActive = false
  }

  override handleUpdate (): void {
    if (this.#target.isDead) {
      return
    }

    if (!this.isActive) {
      if (this.x - this.#target.x < 512 + this.collisionBox.width * 2) {
        this.isActive = true
      }
      return
    }

    const angle = Math.atan2(this.#target.y - this.y, this.#target.x - this.x)
    this._view.gunRotation = angle

    this.#fire(angle)
  }

  override damage (): void {
    this.#health--

    if (this.#health < 1) {
      this.#timeCounter = 0
      const deadAnimation = this._view.showAndGetDeadAnimation()
      deadAnimation.onComplete = () => {
        this.setDead()
      }
    }
  }

  #fire (angle: number): void {
    this.#timeCounter++

    if (this.#timeCounter < 50) {
      return
    }

    this.#bulletFactory.createBullet({
      x: this.x,
      y: this.y,
      angle: angle / Math.PI * 180,
      type: EntityType.enemyBullet
    })

    this.#timeCounter = 0
  }
}
