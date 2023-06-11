import { type IPointData } from 'pixi.js'
import { type AssetsFactory } from '../../AssetsFactory.js'
import { type World } from '../../World.js'
import { type Entity } from '../Entity.js'
import { type Hero } from '../Hero/Hero.js'
import { PowerupView } from './PowerupView.js'
import { Powerup } from './Powerup.js'
import { SpreadgunPowerupView } from './SpreadgunPowerupView.js'
import { SpreadgunPowerup } from './SpreadgunPowerup.js'

interface IPowerupsFactoryOptions {
  worldContainer: World
  assets: AssetsFactory
  entities: Entity[]
  target: Hero
}

export class PowerupsFactory {
  #entities
  #assets
  #worldContainer
  #target

  constructor ({ entities, assets, worldContainer, target }: IPowerupsFactoryOptions) {
    this.#entities = entities
    this.#assets = assets
    this.#worldContainer = worldContainer
    this.#target = target
  }

  createPowerup ({ x, y }: IPointData): void {
    const view = new PowerupView({ assets: this.#assets })

    const powerup = new Powerup({ powerupFactory: this, view, flyY: y, target: this.#target })

    view.x = x

    this.#worldContainer.addChild(view)
    this.#entities.push(powerup)
  }

  createSpreadGunPowerup ({ x, y }: IPointData): void {
    const view = new SpreadgunPowerupView({ assets: this.#assets })
    const powerup = new SpreadgunPowerup({ view })

    powerup.x = x
    powerup.y = y

    this.#worldContainer.addChild(view)
    this.#entities.push(powerup)
  }
}
