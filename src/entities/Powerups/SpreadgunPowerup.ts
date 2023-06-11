import { type IPointData } from 'pixi.js'
import { Entity } from '../Entity'
import { EntityType } from '../EntityType'
import { type SpreadgunPowerupView } from './SpreadgunPowerupView'
import { WeaponType } from '../../Weapon'

interface ISpreadgunPowerupOptions {
  view: SpreadgunPowerupView
}

export class SpreadgunPowerup extends Entity<SpreadgunPowerupView> {
  #GRAVITY_FORCE = 0.2
  #velocityX = 4
  #velocityY = -5

  type = EntityType.spreadgunPowerup
  powerupType = WeaponType.spreadGun

  #prevPoint: IPointData = {
    x: 0,
    y: 0
  }

  constructor ({ view }: ISpreadgunPowerupOptions) {
    super(view)

    this.gravitable = true
  }

  get prevPoint (): IPointData {
    return this.#prevPoint
  }

  override handleUpdate (): void {
    this.#prevPoint.x = this.x
    this.#prevPoint.y = this.y

    this.#velocityX -= 0.05
    if (this.#velocityX < 0) {
      this.#velocityX = 0
    }
    this.x += this.#velocityX

    this.#velocityY += this.#GRAVITY_FORCE
    this.y += this.#velocityY
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
    this.setDead()
  }
}
