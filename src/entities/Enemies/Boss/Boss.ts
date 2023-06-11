import { Entity } from '../../Entity'
import { EntityType } from '../../EntityType'
import { type BossView } from './BossView'

interface IBossOptions {
  view: BossView
}

export class Boss extends Entity<BossView> {
  #health = 5

  type = EntityType.enemy

  constructor ({ view }: IBossOptions) {
    super(view)

    this.isActive = true
  }

  override handleUpdate (): void {}

  override damage (): void {
    this.#health--

    if (this.#health < 1) {
      this.isActive = false

      const deadAnimation = this._view.showAndGetDeadAnimation()
      deadAnimation.onComplete = () => {
        this._view.showAdditionalExplosions()
        deadAnimation.removeFromParent()
      }
    }
  }
}
