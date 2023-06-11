import { AnimatedSprite } from 'pixi.js'
import { type AssetsFactory } from '../../../AssetsFactory'
import { EntityView } from '../../EntityView'

interface IBossViewOptions {
  assets: AssetsFactory
}

export class BossView extends EntityView {
  #view
  #assets

  constructor ({ assets }: IBossViewOptions) {
    super()

    this.#assets = assets

    const view = new AnimatedSprite(assets.getAnimationTextures('bossdoor'))
    view.animationSpeed = 1 / 10
    view.scale.x = 1.4
    view.scale.y = 1.4
    view.play()

    this.addChild(view)
    this.#view = view

    this.setWidth(64)
    this.setHeight(82)
  }

  showAndGetDeadAnimation (): AnimatedSprite {
    this.#view.visible = false
    this.setWidth(0)
    this.setHeight(0)

    const explosion1 = this.#createExplosion()
    const explosion2 = this.#createExplosion()
    explosion2.y = -explosion1.height

    return explosion1
  }

  showAdditionalExplosions (): void {
    const explosion1 = this.#createExplosion()
    const explosion2 = this.#createExplosion()
    const explosion3 = this.#createExplosion()
    const explosion4 = this.#createExplosion()

    explosion1.x = 30

    explosion2.x = 120
    explosion2.y = 60

    explosion3.x = 200

    explosion4.x = -40
    explosion4.y = 40
  }

  #createExplosion (): AnimatedSprite {
    const explosion = new AnimatedSprite(this.#assets.getAnimationTextures('explosion'))
    explosion.animationSpeed = 1 / 5
    explosion.scale.x = 2
    explosion.scale.y = 2
    explosion.loop = false
    explosion.play()
    this.addChild(explosion)

    explosion.onComplete = () => {
      explosion.removeFromParent()
    }

    return explosion
  }
}
