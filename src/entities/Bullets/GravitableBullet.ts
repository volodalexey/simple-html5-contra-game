import { type IPointData } from 'pixi.js'
import { type ICollisionBox } from '../EntityView'
import { Bullet, type IBulletOptions } from './Bullet'

interface IGravitableBulletOptions extends Omit<IBulletOptions, 'angle'> {}

export class GravitableBullet extends Bullet {
  isForbiddenHorizontalCollision

  #prevPoint: IPointData = {
    x: 0,
    y: 0
  }

  #velocityY = 0
  #GRAVITY_FORCE = 0.2

  constructor (options: IGravitableBulletOptions) {
    super({ ...options, angle: 0 })

    this.gravitable = true
    this.isForbiddenHorizontalCollision = true
  }

  get collisionBox (): ICollisionBox {
    return this._view.collisionBox
  }

  get x (): number {
    return this._view.x
  }

  set x (value) {
    this._view.x = value
  }

  get y (): number {
    return this._view.y
  }

  set y (value) {
    this._view.y = value
  }

  get prevPoint (): IPointData {
    return this.#prevPoint
  }

  override handleUpdate (): void {
    this.#prevPoint.x = this.x
    this.#prevPoint.y = this.y

    this.x += this.speed

    this.#velocityY += this.#GRAVITY_FORCE
    this.y += this.#velocityY
  }

  stay (): void {
    this.setDead()
  }

  isJumpState (): boolean {
    return false
  }
}
