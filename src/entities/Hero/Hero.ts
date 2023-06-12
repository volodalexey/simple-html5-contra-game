import { type IPointData } from 'pixi.js'
import { type IBulletContext } from '../Bullets/Bullet'
import { Entity } from '../Entity'
import { type HeroView } from './HeroView'
import { HeroWeaponUnit } from './HeroWeaponUnit'
import { EntityType } from '../EntityType'
import { type IControlContext } from '../../Game'

interface IHeroOptions {
  view: HeroView
}

enum HeroState {
  stay = 'stay',
  jump = 'jump',
  flydown = 'flydown'
}

export class Hero extends Entity<HeroView> {
  #GRAVITY_FORCE = 0.2
  #SPEED = 3
  #JUMP_FORCE = 9
  #velocityX = 0
  #velocityY = 0

  #movement = {
    x: 0,
    y: 0
  }

  #directionContext = {
    left: 0,
    right: 0
  }

  #prevPoint: IPointData = {
    x: 0,
    y: 0
  }

  #state

  #isLay = false
  #isStayUp = false

  #heroWeaponUnit

  type = EntityType.hero
  isFall = false

  constructor ({ view }: IHeroOptions) {
    super(view)

    this.#heroWeaponUnit = new HeroWeaponUnit({ heroView: this._view })

    this.#state = HeroState.jump
    this._view.showJump()

    this.gravitable = true
    this.isActive = true
  }

  get bulletContext (): IBulletContext {
    return this.#heroWeaponUnit.bulletContext
  }

  get prevPoint (): IPointData {
    return this.#prevPoint
  }

  override handleUpdate (): void {
    this.#prevPoint.x = this.x
    this.#prevPoint.y = this.y

    this.#velocityX = this.#movement.x * this.#SPEED
    this.x += this.#velocityX

    if (this.#velocityY > 0) {
      if (!(this.#state === HeroState.jump || this.#state === HeroState.flydown)) {
        this._view.showFall()
        this.isFall = true
      }
      this.#state = HeroState.flydown
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
      deadAnimation.removeFromParent()
    }
  }

  crash (): void {
    this.#movement.x = 0
    this.#GRAVITY_FORCE = 0
    this.#velocityX = 0
    this.#velocityY = 0
    this.setDead()
  }

  stay (platformY: number): void {
    if (this.#state === HeroState.jump || this.#state === HeroState.flydown) {
      this.#state = HeroState.stay
      this.setView({
        left: this.#movement.x === -1,
        right: this.#movement.x === 1,
        down: this.#isLay,
        up: this.#isStayUp,
        shoot: false,
        jump: false
      })
      this.isFall = false
    }

    this.#state = HeroState.stay
    this.#velocityY = 0

    this.y = platformY - this._view.collisionBox.height
  }

  jump (): void {
    if (this.#state === HeroState.jump || this.#state === HeroState.flydown) {
      return
    }
    this.#state = HeroState.jump
    this.#velocityY -= this.#JUMP_FORCE
    this._view.showJump()
  }

  isJumpState (): boolean {
    return this.#state === HeroState.jump
  }

  throwDown (): void {
    this.#state = HeroState.jump
    this._view.showFall()
    this.isFall = true
  }

  setView (controlContext: IControlContext): void {
    if (controlContext.left && !controlContext.right) {
      this.#movement.x = -1
    } else if (!controlContext.left && controlContext.right) {
      this.#movement.x = 1
    } else {
      this.#movement.x = 0
    }
    this._view.flip(this.#movement.x)
    this.#isLay = controlContext.down
    this.#isStayUp = controlContext.up

    this.#heroWeaponUnit.setBulletAngle({ controlContext, isJump: this.isJumpState() })

    if (this.isJumpState() || this.#state === HeroState.flydown) {
      return
    }

    if (controlContext.left || controlContext.right) {
      if (controlContext.up) {
        this._view.showRunUp()
      } else if (controlContext.down) {
        this._view.showRunDown()
      } else {
        if (controlContext.shoot) {
          this._view.showRunShoot()
        } else {
          this._view.showRun()
        }
      }
    } else {
      if (controlContext.up) {
        this._view.showStayUp()
      } else if (controlContext.down) {
        this._view.showLay()
      } else {
        this._view.showStay()
      }
    }
  }

  reset (): void {
    this.#GRAVITY_FORCE = 0.2
    this._view.reset()
    this.resurrection()
  }
}
