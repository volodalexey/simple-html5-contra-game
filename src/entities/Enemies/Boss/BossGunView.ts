import { AnimatedSprite, Sprite } from 'pixi.js'
import { type AssetsFactory } from '../../../AssetsFactory'
import { EntityView, type IHitBox, type ICollisionBox } from '../../EntityView'

interface IBossGunViewOptions {
  assets: AssetsFactory
}

export class BossGunView extends EntityView {
  #assets
  #view

  constructor ({ assets }: IBossGunViewOptions) {
    super()

    this.#assets = assets

    const view = new Sprite(this.#assets.getTexture('bossgun0000'))
    view.scale.x = 1.4
    view.scale.y = 1.4

    this.addChild(view)

    this.#view = view

    this.setWidth(38)
    this.setHeight(18)
  }

  override get collisionBox (): ICollisionBox {
    const _collisionBox = super.collisionBox
    _collisionBox.x = this.x - _collisionBox.width / 2
    _collisionBox.y = this.y - _collisionBox.height / 2
    return _collisionBox
  }

  override get hitBox (): IHitBox {
    const _hitBox = super.hitBox
    _hitBox.x = this.x - _hitBox.width / 2
    _hitBox.y = this.y - _hitBox.height / 2
    return _hitBox
  }

  showAndGetDeadAnimation (): AnimatedSprite {
    this.#view.visible = false
    this.setWidth(0)
    this.setHeight(0)

    const explosion = new AnimatedSprite(this.#assets.getAnimationTextures('explosion'))
    explosion.animationSpeed = 1 / 5
    explosion.scale.x = 2
    explosion.scale.y = 2
    explosion.x = -explosion.width / 2
    explosion.y = -explosion.height / 2
    explosion.loop = false
    explosion.play()
    this.addChild(explosion)

    return explosion
  }
}
