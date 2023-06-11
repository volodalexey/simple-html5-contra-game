import { Container } from 'pixi.js'

export class BackgroundContainer extends Container {}
export class GameContainer extends Container {}
export class ForegroundContainer extends Container {}

export class World extends Container {
  #background
  #game
  #foreground

  constructor () {
    super()

    this.#background = new BackgroundContainer()
    this.addChild(this.#background)

    this.#game = new GameContainer()
    this.addChild(this.#game)

    this.#foreground = new ForegroundContainer()
    this.addChild(this.#foreground)
  }

  get background (): BackgroundContainer {
    return this.#background
  }

  get game (): GameContainer {
    return this.#game
  }

  get foreground (): ForegroundContainer {
    return this.#foreground
  }
}
