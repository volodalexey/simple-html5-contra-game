import { type IPointData } from 'pixi.js'
import { type AssetsFactory } from '../../AssetsFactory'
import { type World } from '../../World'
import { Hero } from './Hero'
import { HeroView } from './HeroView'

interface IHeroFactoryOptions {
  worldContainer: World
  assets: AssetsFactory
}

export class HeroFactory {
  #worldContainer
  #assets

  constructor ({ worldContainer, assets }: IHeroFactoryOptions) {
    this.#worldContainer = worldContainer
    this.#assets = assets
  }

  create ({ x, y }: IPointData): Hero {
    const heroView = new HeroView({ assets: this.#assets })
    this.#worldContainer.game.addChild(heroView)

    const hero = new Hero({ view: heroView })
    hero.x = x
    hero.y = y

    return hero
  }
}
