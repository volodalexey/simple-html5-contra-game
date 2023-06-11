import { AnimatedSprite, Sprite } from 'pixi.js'
import { EntityView } from '../EntityView'
import { type AssetsFactory } from '../../AssetsFactory'

interface IPowerupViewOptions {
  assets: AssetsFactory
}

export class PowerupView extends EntityView {
  #view
  #assets

  constructor ({ assets }: IPowerupViewOptions) {
    super()

    this.#view = new Sprite(assets.getTexture('powerup0000'))
    this.addChild(this.#view)

    this.setWidth(50)
    this.setHeight(20)

    this.#assets = assets
  }

  showAndGetDeadAnimation (): AnimatedSprite {
    this.#view.visible = false
    this.setWidth(0)
    this.setHeight(0)

    const explosion = new AnimatedSprite(this.#assets.getAnimationTextures('explosion'))
    explosion.animationSpeed = 1 / 5
    explosion.y = -explosion.height / 2
    explosion.loop = false
    explosion.play()
    this.addChild(explosion)

    return explosion
  }
}
