import { type BulletFactory } from '../../Bullets/BulletFactory'
import { Entity } from '../../Entity'
import { EntityType } from '../../EntityType'
import { type Hero } from '../../Hero/Hero'
import { type BossGunView } from './BossGunView'

interface IBossGunOptions {
  view: BossGunView
  target: Hero
  bulletFactory: BulletFactory
}

export class BossGun extends Entity<BossGunView> {
  #target
  #bulletFactory
  #timeCounter = 0
  #health = 5

  type = EntityType.enemy

  constructor ({ view, target, bulletFactory }: IBossGunOptions) {
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

    this.#fire()
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

  #fire (): void {
    this.#timeCounter++

    if (this.#timeCounter < 50 && Math.random() > 0.01) {
      return
    }

    this.#bulletFactory.createBossBullet({
      x: this.x,
      y: this.y,
      angle: 180,
      type: EntityType.enemyBullet
    })

    this.#timeCounter = 0
  }
}
