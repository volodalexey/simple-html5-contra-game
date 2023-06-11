import { type IPointData } from 'pixi.js'
import { Entity } from '../../Entity'
import { type ICollisionBox } from '../../EntityView'
import { type Hero } from '../../Hero/Hero'
import { type RunnerView } from './RunnerView'
import { type IButtonContext } from '../../../KeyboardProcessor'
import { EntityType } from '../../EntityType'

interface IRunnerOptions {
  view: RunnerView
  target: Hero
}

enum RunnerState {
  stay = 'stay',
  jump = 'jump',
  flydown = 'flydown'
}

export class Runner extends Entity<RunnerView> {
  #GRAVITY_FORCE = 0.2
  #SPEED = 3
  #JUMP_FORCE = 9
  #velocityX = 0
  #velocityY = 0

  #movement = {
    x: 0,
    y: 0
  }

  #prevPoint: IPointData = {
    x: 0,
    y: 0
  }

  #target
  #state

  type = EntityType.enemy

  jumpBehaviorFactor = 0.4

  constructor ({ view, target }: IRunnerOptions) {
    super(view)

    this.#target = target

    this.#state = RunnerState.jump
    this._view.showJump()

    this.#movement.x = -1

    this.gravitable = true
    this.isActive = false
  }

  get collisionBox (): ICollisionBox {
    return this._view.collisionBox
  }

  get x (): number {
    return this._view.x
  }

  set x (value) {
    this._view.x = value
  }

  get y (): number {
    return this._view.y
  }

  set y (value) {
    this._view.y = value
  }

  get prevPoint (): IPointData {
    return this.#prevPoint
  }

  override handleUpdate (): void {
    if (!this.isActive) {
      if (this.x - this.#target.x < 512 + this.collisionBox.width * 2) {
        this.isActive = true
      }
      return
    }

    this.#prevPoint.x = this.x
    this.#prevPoint.y = this.y

    this.#velocityX = this.#movement.x * this.#SPEED
    this.x += this.#velocityX

    if (this.#velocityY > 0) {
      if (!(this.#state === RunnerState.jump || this.#state === RunnerState.flydown)) {
        if (Math.random() > this.jumpBehaviorFactor) {
          this._view.showFall()
        } else {
          this.jump()
        }
      }
      if (this.#velocityY > 0) {
        this.#state = RunnerState.flydown
      }
    }

    this.#velocityY += this.#GRAVITY_FORCE
    this.y += this.#velocityY
  }

  override damage (): void {
    this.#movement.x = 0
    this.#GRAVITY_FORCE = 0
    this.#velocityX = 0
    this.#velocityY = 0

    const deadAnimation = this._view.showAndGetDeadAnimation()
    deadAnimation.onComplete = () => {
      this.setDead()
    }
  }

  stay (platformY: number): void {
    if (this.#state === RunnerState.jump || this.#state === RunnerState.flydown) {
      this.#state = RunnerState.stay
      this.setView({
        arrowLeft: this.#movement.x === -1,
        arrowRight: this.#movement.x === 1,
        arrowDown: false,
        arrowUp: false,
        shoot: false
      })
    }

    this.#state = RunnerState.stay
    this.#velocityY = 0

    this.y = platformY - this._view.collisionBox.height
  }

  jump (): void {
    if (this.#state === RunnerState.jump || this.#state === RunnerState.flydown) {
      return
    }
    this.#state = RunnerState.jump
    this.#velocityY -= this.#JUMP_FORCE
    this._view.showJump()
  }

  isJumpState (): boolean {
    return this.#state === RunnerState.jump
  }

  setView (buttonContext: IButtonContext): void {
    this._view.flip(this.#movement.x)

    if (this.isJumpState() || this.#state === RunnerState.flydown) {
      return
    }

    if (buttonContext.arrowLeft || buttonContext.arrowRight) {
      this._view.showRun()
    }
  }

  removeFromParent (): void {
    if (this._view.parent != null) {
      this._view.removeFromParent()
    }
  }
}
