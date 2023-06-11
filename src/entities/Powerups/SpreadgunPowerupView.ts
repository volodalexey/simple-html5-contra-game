import { Sprite } from 'pixi.js'
import { EntityView } from '../EntityView'
import { type AssetsFactory } from '../../AssetsFactory'

interface ISpreadgunPowerupViewOptions {
  assets: AssetsFactory
}

export class SpreadgunPowerupView extends EntityView {
  #collisionBox = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }

  constructor ({ assets }: ISpreadgunPowerupViewOptions) {
    super()

    const view = new Sprite(assets.getTexture('spreadgun0000'))
    this.addChild(view)

    this.#collisionBox.width = 50
    this.#collisionBox.height = 20
  }
}
