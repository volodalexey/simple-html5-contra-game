import { Assets, type Texture } from 'pixi.js'

export class AssetsFactory {
  #spritesheet

  constructor () {
    this.#spritesheet = Assets.get('spritesheet')
  }

  getTexture (textureName: string): Texture {
    return this.#spritesheet.textures[textureName]
  }

  getAnimationTextures (animationName: string): Texture[] {
    return this.#spritesheet.animations[animationName]
  }
}
