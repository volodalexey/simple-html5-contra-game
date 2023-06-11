import { AnimatedSprite, Sprite } from 'pixi.js'
import { EntityView, type ICollisionBox, type IHitBox } from '../../EntityView'
import { type AssetsFactory } from '../../../AssetsFactory'

interface ITurretViewOptions {
  assets: AssetsFactory
}

export class TurretView extends EntityView {
  #gunView

  #assets

  constructor ({ assets }: ITurretViewOptions) {
    super()

    this.#assets = assets

    const view = new Sprite(this.#assets.getTexture('tourelle0000'))
    view.scale.x = 1.4
    view.scale.y = 1.4
    view.x -= view.width / 2
    view.y -= view.height / 2

    this.addChild(view)

    this.#gunView = new Sprite(this.#assets.getTexture('tourellegun0000'))
    this.#gunView.pivot.x = 22
    this.#gunView.pivot.y = 19
    this.#gunView.x = view.width / 2 - 17
    this.#gunView.y = view.width / 2 - 15

    this.setWidth(128)
    this.setHeight(128)

    view.addChild(this.#gunView)
  }

  get gunRotation (): number {
    return this.#gunView.rotation
  }

  set gunRotation (value) {
    this.#gunView.rotation = value
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
    this.#gunView.visible = false
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
