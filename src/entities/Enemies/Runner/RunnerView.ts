import { AnimatedSprite, Container, Sprite } from 'pixi.js'
import { EntityView } from '../../EntityView'
import { type AssetsFactory } from '../../../AssetsFactory'

interface IRunnerViewOptions {
  assets: AssetsFactory
}

enum RunnerViewState {
  run = 'run',
  jump = 'jump',
  fall = 'fall'
}

export class RunnerView extends EntityView {
  #bounds = {
    width: 0,
    height: 0
  }

  #stm!: { currentState: RunnerViewState, states: Record<RunnerViewState, Container> }

  #rootNode!: Container
  #assets

  constructor ({ assets }: IRunnerViewOptions) {
    super()
    this.#assets = assets

    this.#createNodeStructure()

    this.#rootNode.pivot.x = 10
    this.#rootNode.x = 10
    this.#bounds.width = 20
    this.#bounds.height = 90
    this.setWidth(this.#bounds.width)
    this.setHeight(this.#bounds.height)

    this.#stm = {
      currentState: RunnerViewState.run,
      states: {
        run: this.#getRunImage(),
        jump: this.#getJumpImage(),
        fall: this.#getFallImage()
      }
    }

    for (const key in this.#stm.states) {
      this.#rootNode.addChild(this.#stm.states[key as RunnerViewState])
    }
  }

  get isFliped (): boolean {
    return this.#rootNode.scale.x === -1
  }

  showRun (): void {
    this.#toState(RunnerViewState.run)
  }

  showJump (): void {
    this.#toState(RunnerViewState.jump)
  }

  showFall (): void {
    this.#toState(RunnerViewState.fall)
  }

  flip (direction: number): void {
    switch (direction) {
      case 1:
      case -1:
        this.#rootNode.scale.x = direction
    }
  }

  showAndGetDeadAnimation (): AnimatedSprite {
    this.#rootNode.visible = false
    this.setWidth(0)
    this.setHeight(0)

    const explosion = new AnimatedSprite(this.#assets.getAnimationTextures('explosion'))
    explosion.animationSpeed = 1 / 5
    explosion.x = -explosion.width / 2
    explosion.loop = false
    explosion.play()
    this.addChild(explosion)

    return explosion
  }

  #toState (key: RunnerViewState): void {
    if (this.#stm.currentState === key) {
      return
    }
    for (const key in this.#stm.states) {
      this.#stm.states[key as RunnerViewState].visible = false
    }
    this.#stm.states[key].visible = true
    this.#stm.currentState = key
  }

  #createNodeStructure (): void {
    const rootNode = new Container()
    this.addChild(rootNode)
    this.#rootNode = rootNode
  }

  #getRunImage (): AnimatedSprite {
    const view = new AnimatedSprite(this.#assets.getAnimationTextures('runnerrun'))
    view.animationSpeed = 1 / 10
    view.play()
    view.y += 2
    return view
  }

  #getJumpImage (): Sprite {
    const view = new Sprite(this.#assets.getTexture('runnerjump0000'))
    return view
  }

  #getFallImage (): Sprite {
    const view = new Sprite(this.#assets.getTexture('runnerjump0000'))
    return view
  }
}
