import { Container } from 'pixi.js'

export interface ICollisionBox {
  x: number
  y: number
  width: number
  height: number
}

export interface IHitBox {
  x: number
  y: number
  width: number
  height: number
  shiftX: number
  shiftY: number
}

export class EntityView extends Container {
  #collisionBox: ICollisionBox = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }

  #hitBox: IHitBox = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    shiftX: 0,
    shiftY: 0
  }

  setWidth (width: number): void {
    this.#collisionBox.width = width
    this.#hitBox.width = width
  }

  setHeight (height: number): void {
    this.#collisionBox.height = height
    this.#hitBox.height = height
  }

  get collisionBox (): ICollisionBox {
    this.#collisionBox.x = this.x
    this.#collisionBox.y = this.y
    return this.#collisionBox
  }

  get hitBox (): IHitBox {
    this.#hitBox.x = this.x + this.#hitBox.shiftX
    this.#hitBox.y = this.y + this.#hitBox.shiftY
    return this.#hitBox
  }

  setHitboxWidth (width: number): void {
    this.#hitBox.width = width
  }

  setHitboxHeight (height: number): void {
    this.#hitBox.height = height
  }

  setHitboxShiftX (shiftX: number): void {
    this.#hitBox.shiftX = shiftX
  }

  setHitboxShiftY (shiftY: number): void {
    this.#hitBox.shiftY = shiftY
  }
}
