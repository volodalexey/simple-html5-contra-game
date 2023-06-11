import { Container, Graphics, Sprite } from 'pixi.js'
import { type AssetsFactory } from './AssetsFactory'

interface IStaticBackgroundOptions {
  screenSize: {
    width: number
    height: number
  }
  assets: AssetsFactory
}

class Star extends Graphics {}
class Mountain extends Sprite {}

export class StaticBackground extends Container {
  constructor ({ screenSize, assets }: IStaticBackgroundOptions) {
    super()

    this.#createMountains({ assets, x: 600, y: 250, scale: 1.3 })
    this.#createMountains({ assets, x: 820, y: 230, scale: 1.6 })

    for (let i = 0; i < 300; i++) {
      const star = this.#createStar()
      star.x = Math.random() * screenSize.width
      star.y = Math.random() * screenSize.height
    }

    const water = new Graphics()
    water.beginFill(0x0072ec)
    water.drawRect(0, screenSize.height / 2 + 130, screenSize.width, screenSize.height)
    this.addChild(water)
  }

  #createStar (): Star {
    const star = new Star()
    star.beginFill(0xdddddd)
    star.drawRect(0, 0, 2, 2)
    this.addChild(star)

    return star
  }

  #createMountains ({ assets, x, y, scale }: { assets: AssetsFactory, x: number, y: number, scale: number }): Mountain {
    const mountain = new Mountain(assets.getTexture('mounts0000'))
    mountain.scale.x = scale
    mountain.scale.y = scale
    mountain.x = x
    mountain.y = y
    this.addChild(mountain)

    return mountain
  }
}
