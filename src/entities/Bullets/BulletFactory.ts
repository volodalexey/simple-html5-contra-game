import { Graphics } from 'pixi.js'
import { BulletView } from './BulletView'
import { type Entity } from '../Entity'
import { type World } from '../../World'
import { Bullet, type IBulletContext } from './Bullet'
import { GravitableBullet } from './GravitableBullet'

interface IBulletFactoryOptions {
  worldContainer: World
  entities: Entity[]
}

class BulletSkin extends Graphics {}

export class BulletFactory {
  worldContainer
  #entities

  constructor ({ worldContainer, entities }: IBulletFactoryOptions) {
    this.worldContainer = worldContainer
    this.#entities = entities
  }

  createBullet (bulletContext: IBulletContext): void {
    const skin = new BulletSkin()
    skin.beginFill(0xffffff)
    skin.drawRect(0, 0, 5, 5)

    const view = new BulletView()
    view.addChild(skin)

    this.worldContainer.game.addChild(view)

    const bullet = new Bullet({ view, angle: bulletContext.angle })
    bullet.x = bulletContext.x
    bullet.y = bulletContext.y
    bullet.type = bulletContext.type
    bullet.speed = 10

    this.#entities.push(bullet)
  }

  createSpreadGunBullet (bulletContext: IBulletContext): void {
    const skin = new Graphics()
    skin.beginFill(0xff2222)
    skin.drawCircle(0, 0, 6)
    skin.beginFill(0xdddddd)
    skin.drawCircle(-3, -3, 3)

    const view = new BulletView()
    view.addChild(skin)

    this.worldContainer.game.addChild(view)

    const bullet = new Bullet({ view, angle: bulletContext.angle })
    bullet.x = bulletContext.x
    bullet.y = bulletContext.y
    bullet.type = bulletContext.type
    bullet.speed = 7

    this.#entities.push(bullet)
  }

  createBossBullet (bulletContext: IBulletContext): void {
    const skin = new Graphics()
    skin.beginFill(0xff2222)
    skin.drawCircle(0, 0, 6)
    skin.beginFill(0xdddddd)
    skin.drawCircle(-3, -3, 3)

    const view = new BulletView()
    view.addChild(skin)

    this.worldContainer.game.addChild(view)

    const bullet = new GravitableBullet({ view })
    bullet.x = bulletContext.x
    bullet.y = bulletContext.y
    bullet.type = bulletContext.type
    bullet.speed = Math.random() * -6 - 2

    this.#entities.push(bullet)
  }
}
