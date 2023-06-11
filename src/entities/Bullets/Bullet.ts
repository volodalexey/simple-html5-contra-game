import { Entity } from '../Entity'
import { type EntityType } from '../EntityType'
import { type BulletView } from './BulletView'

export interface IBulletOptions {
  view: BulletView
  angle: number
}

export interface IBulletContext {
  x: number
  y: number
  angle: number
  type: EntityType
}

export class Bullet extends Entity {
  #angle

  speed = 10
  declare type: EntityType

  constructor ({ view, angle }: IBulletOptions) {
    super(view)

    this.#angle = angle * Math.PI / 180
  }

  override handleUpdate (): void {
    this.x += this.speed * Math.cos(this.#angle)
    this.y += this.speed * Math.sin(this.#angle)
  }
}
