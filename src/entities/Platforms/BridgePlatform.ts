import { AnimatedSprite } from 'pixi.js'
import { type AssetsFactory } from '../../AssetsFactory'
import { type Hero } from '../Hero/Hero'
import { Platform } from './Platform'
import { type PlatformView } from './PlatformView'

interface IBridgePlatformOptions {
  view: PlatformView
  assets: AssetsFactory
}

export class BridgePlatform extends Platform {
  #target!: Hero
  #assets

  constructor ({ view, assets }: IBridgePlatformOptions) {
    super({ view })

    this.#assets = assets
  }

  setTarget (target: Hero): void {
    this.#target = target
  }

  override handleUpdate (): void {
    if (this.#target != null) {
      if (this.x - this.#target.x < -50 && this.isActive) {
        this.isActive = false
        const deadAnimation = this.#showAndGetDeadAnimation()
        deadAnimation.onComplete = () => {
          this.setDead()
        }
      }
    }
  }

  #showAndGetDeadAnimation (): AnimatedSprite {
    const explosion = new AnimatedSprite(this.#assets.getAnimationTextures('explosion'))
    explosion.animationSpeed = 1 / 5
    explosion.scale.x = 1.5
    explosion.scale.y = 1.5
    explosion.x -= 10
    explosion.loop = false
    explosion.play()
    this._view.addChild(explosion)

    return explosion
  }
}
