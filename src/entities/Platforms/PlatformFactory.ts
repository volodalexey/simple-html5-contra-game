import { Graphics, Sprite, type IPointData, type Container } from 'pixi.js'
import { type AssetsFactory } from '../../AssetsFactory.js'
import { type World } from '../../World.js'
import { PlatformView } from './PlatformView.js'
import { Platform } from './Platform.js'
import { EntityType } from '../EntityType.js'
import { BridgePlatform } from './BridgePlatform.js'

interface IPlatformFactoryOptions {
  worldContainer: World
  assets: AssetsFactory
}

export class PlatformFactory {
  #platformWidth = 128
  #platformHeight = 24

  #worldContainer
  #assets

  constructor ({ worldContainer, assets }: IPlatformFactoryOptions) {
    this.#worldContainer = worldContainer
    this.#assets = assets
  }

  createPlatform ({ x, y }: IPointData): Platform {
    const skin = this.#getGroundPlatform()
    const view = new PlatformView({ width: this.#platformWidth, height: this.#platformHeight })
    view.addChild(skin)

    const platform = new Platform({ view })
    platform.x = x
    platform.y = y
    this.#worldContainer.background.addChild(view)

    return platform
  }

  createBox ({ x, y }: IPointData): Platform {
    const skin = this.#getGroundPlatform()
    const view = new PlatformView({ width: this.#platformWidth, height: this.#platformHeight })
    view.addChild(skin)

    const platform = new Platform({ view })
    platform.x = x
    platform.y = y
    platform.type = EntityType.box
    this.#worldContainer.background.addChild(view)

    return platform
  }

  createStepBox ({ x, y }: IPointData): Platform {
    const box = this.createBox({ x, y })
    box.isStep = true

    return box
  }

  createWater ({ x, y }: IPointData): Platform {
    const skin = new Graphics()
    skin.beginFill(0x0072ec)
    skin.drawRect(0, -this.#platformHeight, this.#platformWidth, this.#platformHeight)
    skin.lineTo(this.#platformWidth, this.#platformHeight)

    const waterTop = new Sprite(this.#assets.getTexture('water0000'))
    waterTop.y = -this.#platformHeight

    const view = new PlatformView({ width: this.#platformWidth, height: this.#platformHeight })
    view.addChild(skin)
    view.addChild(waterTop)

    const platform = new Platform({ view })
    platform.x = x
    platform.y = y
    platform.type = EntityType.box
    this.#worldContainer.foreground.addChild(view)

    return platform
  }

  createBossWall ({ x, y }: IPointData): Platform {
    const skin = new Sprite(this.#assets.getTexture('boss0000'))
    skin.scale.x = 1.5
    skin.scale.y = 1.5

    const view = new PlatformView({ width: this.#platformWidth * 3, height: 768 })
    view.addChild(skin)

    const platform = new Platform({ view })
    platform.x = x - 64
    platform.y = y - 45
    platform.type = EntityType.box
    this.#worldContainer.background.addChild(view)

    return platform
  }

  createBridge ({ x, y }: IPointData): BridgePlatform {
    const skin = new Sprite(this.#assets.getTexture('bridge0000'))
    const view = new PlatformView({ width: this.#platformWidth, height: this.#platformHeight })
    view.addChild(skin)

    const platform = new BridgePlatform({ view, assets: this.#assets })
    platform.x = x
    platform.y = y
    this.#worldContainer.background.addChild(view)

    return platform
  }

  createJungle ({ x, y }: IPointData): void {
    const jungleTop = new Sprite(this.#assets.getTexture('jungletop0000'))
    for (let i = 1; i <= 5; i++) {
      const jungleBottom = this.#createJungleBottom(jungleTop)
      jungleBottom.y = jungleTop.height * i - 2 * i
    }
    jungleTop.x = x
    jungleTop.y = y

    this.#worldContainer.background.addChild(jungleTop)
  }

  #createJungleBottom (jungleTop: Container): Sprite {
    const jungleBottom = new Sprite(this.#assets.getTexture('junglebottom0000'))
    jungleTop.addChild(jungleBottom)

    return jungleBottom
  }

  #getGroundPlatform (): Sprite {
    const grass = new Sprite(this.#assets.getTexture('platform0000'))
    const ground = new Sprite(this.#assets.getTexture('ground0000'))
    ground.y = grass.height - 1
    const ground2 = new Sprite(this.#assets.getTexture('ground0000'))
    ground2.y = grass.height * 2 - 2
    const ground3 = new Sprite(this.#assets.getTexture('ground0000'))
    ground3.y = grass.height * 3 - 4

    grass.addChild(ground)
    grass.addChild(ground2)
    grass.addChild(ground3)

    return grass
  }
}
