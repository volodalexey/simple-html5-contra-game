import { type IPointData } from 'pixi.js'
import { Entity } from '../Entity'
import { EntityType } from '../EntityType'
import { type ICollisionBox } from '../EntityView'
import { type Hero } from '../Hero/Hero'
import { type PowerupView } from './PowerupView'
import { type PowerupsFactory } from './PowerupsFactory'

interface IPowerupOptions {
  powerupFactory: PowerupsFactory
  view: PowerupView
  flyY: number
  target: Hero
}

export class Powerup extends Entity<PowerupView> {
  #powerupFactory
  #flyY
  #target

  #velocityX = 4
  #velocityY = 50

  #prevPoint: IPointData = {
    x: 0,
    y: 0
  }

  type = EntityType.powerupBox

  constructor ({ powerupFactory, view, flyY, target }: IPowerupOptions) {
    super(view)

    this.#powerupFactory = powerupFactory
    this.#flyY = flyY
    this.#target = target

    this.isActive = false
    this._view.visible = false
  }

  get prevPoint (): IPointData {
    return this.#prevPoint
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

  override handleUpdate (): void {
    if (!this.isActive) {
      if (this.x - this.#target.x < -512 - this.collisionBox.width) {
        this.isActive = true
        this._view.visible = true
      }
      return
    }

    this.x += this.#velocityX
    this.y = this.#flyY + Math.sin(this.x * 0.02) * this.#velocityY
  }

  stay (platformY: number): void {
    this.#velocityX = 0
    this.#velocityY = 0

    this.y = platformY - this._view.collisionBox.height
  }

  isJumpState (): boolean {
    return false
  }

  override damage (): void {
    if (!this.isActive) {
      return
    }

    this.#powerupFactory.createSpreadGunPowerup({ x: this.x, y: this.y })

    this.#velocityX = 0
    this.#velocityY = 0
    const deadAnimation = this._view.showAndGetDeadAnimation()
    deadAnimation.onComplete = () => {
      this.setDead()
    }
  }
}
