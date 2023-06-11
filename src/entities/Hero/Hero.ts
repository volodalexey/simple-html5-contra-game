import { type IPointData } from 'pixi.js'
import { type IBulletContext } from '../Bullets/Bullet'
import { Entity } from '../Entity'
import { type HeroView } from './HeroView'
import { HeroWeaponUnit } from './HeroWeaponUnit'
import { type IButtonContext } from '../../KeyboardProcessor'
import { EntityType } from '../EntityType'

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

  stay (platformY: number): void {
    if (this.#state === HeroState.jump || this.#state === HeroState.flydown) {
      this.#state = HeroState.stay
      this.setView({
        arrowLeft: this.#movement.x === -1,
        arrowRight: this.#movement.x === 1,
        arrowDown: this.#isLay,
        arrowUp: this.#isStayUp,
        shoot: false
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

  startLeftMove (): void {
    this.#directionContext.left = -1

    if (this.#directionContext.right > 0) {
      this.#movement.x = 0
      return
    }

    this.#movement.x = -1
  }

  startRightMove (): void {
    this.#directionContext.right = 1

    if (this.#directionContext.left < 0) {
      this.#movement.x = 0
      return
    }

    this.#movement.x = 1
  }

  stopLeftMove (): void {
    this.#directionContext.left = 0
    this.#movement.x = this.#directionContext.right
  }

  stopRightMove (): void {
    this.#directionContext.right = 0
    this.#movement.x = this.#directionContext.left
  }

  setView (buttonContext: IButtonContext): void {
    this._view.flip(this.#movement.x)
    this.#isLay = buttonContext.arrowDown
    this.#isStayUp = buttonContext.arrowUp

    this.#heroWeaponUnit.setBulletAngle({ buttonContext, isJump: this.isJumpState() })

    if (this.isJumpState() || this.#state === HeroState.flydown) {
      return
    }

    if (buttonContext.arrowLeft || buttonContext.arrowRight) {
      if (buttonContext.arrowUp) {
        this._view.showRunUp()
      } else if (buttonContext.arrowDown) {
        this._view.showRunDown()
      } else {
        if (buttonContext.shoot) {
          this._view.showRunShoot()
        } else {
          this._view.showRun()
        }
      }
    } else {
      if (buttonContext.arrowUp) {
        this._view.showStayUp()
      } else if (buttonContext.arrowDown) {
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
