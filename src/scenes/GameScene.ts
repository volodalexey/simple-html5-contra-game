import { type Application, Container } from 'pixi.js'
import { type IScene } from './IScene'
import { Game } from '../Game'
import { SceneManager } from './SceneManager'
import { AssetsFactory } from '../AssetsFactory'

interface IGameSceneOptions {
  app: Application
  viewWidth: number
  viewHeight: number
}

export class GameScene extends Container implements IScene {
  public name = 'game'
  public game!: Game

  constructor (options: IGameSceneOptions) {
    super()
    this.setup(options)
  }

  setup (_: IGameSceneOptions): void {
    this.game = new Game({
      pixiApp: SceneManager.app,
      assets: new AssetsFactory()
    })
  }

  handleResize (options: {
    viewWidth: number
    viewHeight: number
  }): void {
    this.game.handleResize(options)
  }

  handleUpdate (deltaMS: number): void {
    this.game.handleUpdate(deltaMS)
  }

  mountedHandler (): void {
    // this.addChild(this.game)
  }
}
