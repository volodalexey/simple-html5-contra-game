import { type EntityType } from './EntityType'
import { type ICollisionBox, type EntityView, type IHitBox } from './EntityView'

export class Entity<T extends EntityView = EntityView> {
  _view

  #isDead!: boolean
  #isActive!: boolean
  #gravitable = false
  type!: EntityType

  constructor (view: T) {
    this._view = view
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

  get gravitable (): boolean {
    return this.#gravitable
  }

  set gravitable (value) {
    this.#gravitable = value
  }

  get collisionBox (): ICollisionBox {
    return this._view.collisionBox
  }

  get hitBox (): IHitBox {
    return this._view.hitBox
  }

  get isActive (): boolean {
    return this.#isActive
  }

  set isActive (value) {
    this.#isActive = value
  }

  get isDead (): boolean {
    return this.#isDead
  }

  setDead (): void {
    this.#isDead = true
  }

  resurrection (): void {
    this.#isDead = false
  }

  removeFromStage (): void {
    if (this._view.parent != null) {
      this._view.removeFromParent()
    }
  }

  handleUpdate (): void {}

  damage (): void {}
}
