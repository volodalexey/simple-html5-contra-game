import { AnimatedSprite, Container, Graphics, type IPointData, Sprite } from 'pixi.js'
import { type AssetsFactory } from '../../AssetsFactory'
import { EntityView } from '../EntityView'

interface IHeroViewOptions {
  assets: AssetsFactory
}

enum HeroViewState {
  stay = 'stay',
  stayUp = 'stayUp',
  run = 'run',
  runShoot = 'runShoot',
  runUp = 'runUp',
  runDown = 'runDown',
  lay = 'lay',
  jump = 'jump',
  fall = 'fall'
}

export class HeroView extends EntityView {
  #bounds = {
    width: 0,
    height: 0
  }

  #stm!: { currentState: HeroViewState, states: Record<HeroViewState, Container> }

  #bulletPointShift: IPointData = {
    x: 0,
    y: 0
  }

  #rootNode!: Container
  #assets

  constructor ({ assets }: IHeroViewOptions) {
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
      currentState: HeroViewState.stay,
      states: {
        stay: this.#getStayImage(),
        stayUp: this.#getStayUpImage(),
        run: this.#getRunImage(),
        runShoot: this.#getRunShootImage(),
        runUp: this.#getRunUpImage(),
        runDown: this.#getRunDownImage(),
        lay: this.#getLayImage(),
        jump: this.#getJumpImage(),
        fall: this.#getFallImage()
      }
    }

    for (const key in this.#stm.states) {
      this.#rootNode.addChild(this.#stm.states[key as HeroViewState])
    }
  }

  get isFliped (): boolean {
    return this.#rootNode.scale.x === -1
  }

  get bulletPointShift (): IPointData {
    return this.#bulletPointShift
  }

  reset (): void {
    this.#rootNode.visible = true
    this.setWidth(this.#bounds.width)
    this.setHeight(this.#bounds.height)
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

  showStay (): void {
    this.#toState(HeroViewState.stay)
    this.#setBulletPointShift(50, 29)

    this.setHitboxWidth(20)
    this.setHitboxHeight(90)
    this.setHitboxShiftX(0)
    this.setHitboxShiftY(0)
  }

  showStayUp (): void {
    this.#toState(HeroViewState.stayUp)
    this.#setBulletPointShift(18, -30)

    this.setHitboxWidth(20)
    this.setHitboxHeight(90)
    this.setHitboxShiftX(0)
    this.setHitboxShiftY(0)
  }

  showRun (): void {
    this.#toState(HeroViewState.run)
    this.#setBulletPointShift(65, 30)

    this.setHitboxWidth(20)
    this.setHitboxHeight(90)
    this.setHitboxShiftX(0)
    this.setHitboxShiftY(0)
  }

  showRunShoot (): void {
    this.#toState(HeroViewState.runShoot)
    this.#setBulletPointShift(50, 29)

    this.setHitboxWidth(20)
    this.setHitboxHeight(90)
    this.setHitboxShiftX(0)
    this.setHitboxShiftY(0)
  }

  showRunUp (): void {
    this.#toState(HeroViewState.runUp)
    this.#setBulletPointShift(40, 0)

    this.setHitboxWidth(20)
    this.setHitboxHeight(90)
    this.setHitboxShiftX(0)
    this.setHitboxShiftY(0)
  }

  showRunDown (): void {
    this.#toState(HeroViewState.runDown)
    this.#setBulletPointShift(47, 50)

    this.setHitboxWidth(20)
    this.setHitboxHeight(90)
    this.setHitboxShiftX(0)
    this.setHitboxShiftY(0)
  }

  showLay (): void {
    this.#toState(HeroViewState.lay)
    this.#setBulletPointShift(50, 70)

    this.setHitboxWidth(90)
    this.setHitboxHeight(20)
    this.setHitboxShiftX(-45)
    this.setHitboxShiftY(70)
  }

  showJump (): void {
    this.#toState(HeroViewState.jump)
    this.#setBulletPointShift(-2, 40)

    this.setHitboxWidth(40)
    this.setHitboxHeight(40)
    this.setHitboxShiftX(-10)
    this.setHitboxShiftY(25)
  }

  showFall (): void {
    this.#toState(HeroViewState.fall)

    this.setHitboxWidth(20)
    this.setHitboxHeight(90)
    this.setHitboxShiftX(0)
    this.setHitboxShiftY(0)
  }

  flip (direction: number): void {
    switch (direction) {
      case 1:
      case -1:
        this.#rootNode.scale.x = direction
    }
  }

  #toState (key: HeroViewState): void {
    if (this.#stm.currentState === key) {
      return
    }
    for (const key in this.#stm.states) {
      this.#stm.states[key as HeroViewState].visible = false
    }
    this.#stm.states[key].visible = true
    this.#stm.currentState = key
  }

  #createNodeStructure (): void {
    const rootNode = new Container()
    this.addChild(rootNode)
    this.#rootNode = rootNode
  }

  #setBulletPointShift (x: number, y: number): void {
    this.#bulletPointShift.x = (x + this.#rootNode.pivot.x * this.#rootNode.scale.x) * this.#rootNode.scale.x
    this.#bulletPointShift.y = y
  }

  #getStayImage (): Sprite {
    const view = new Sprite(this.#assets.getTexture('stay0000'))
    return view
  }

  #getStayUpImage (): Sprite {
    const view = new Sprite(this.#assets.getTexture('stayup0000'))
    view.x += 2
    view.y -= 31
    return view
  }

  #getRunImage (): AnimatedSprite {
    const view = new AnimatedSprite(this.#assets.getAnimationTextures('run'))
    view.animationSpeed = 1 / 10
    view.play()
    view.y -= 3
    return view
  }

  #getRunShootImage (): Container {
    const container = new Container()

    const upperPart = new Sprite(this.#assets.getTexture('stay0000'))
    upperPart.x = 8
    upperPart.y = 2

    const upperPartMask = new Graphics()
    upperPartMask.beginFill(0xffffff)
    upperPartMask.drawRect(0, 0, 100, 45)

    upperPart.mask = upperPartMask

    const bottomPart = new AnimatedSprite(this.#assets.getAnimationTextures('run'))
    bottomPart.animationSpeed = 1 / 10
    bottomPart.play()
    bottomPart.y -= 3

    const bottomPartMask = new Graphics()
    bottomPartMask.beginFill(0xffffff)
    bottomPartMask.drawRect(0, 45, 100, 45)

    bottomPart.mask = bottomPartMask

    container.addChild(upperPart)
    container.addChild(bottomPart)
    container.addChild(upperPartMask)
    container.addChild(bottomPartMask)

    return container
  }

  #getRunUpImage (): AnimatedSprite {
    const view = new AnimatedSprite(this.#assets.getAnimationTextures('runup'))
    view.animationSpeed = 1 / 10
    view.play()
    view.y -= 3
    return view
  }

  #getRunDownImage (): AnimatedSprite {
    const view = new AnimatedSprite(this.#assets.getAnimationTextures('rundown'))
    view.animationSpeed = 1 / 10
    view.play()
    view.y -= 3
    return view
  }

  #getLayImage (): Sprite {
    const view = new Sprite(this.#assets.getTexture('lay0000'))
    view.x -= 25
    view.y += 50
    return view
  }

  #getJumpImage (): AnimatedSprite {
    const view = new AnimatedSprite(this.#assets.getAnimationTextures('jump'))
    view.animationSpeed = 1 / 10
    view.play()
    view.y -= 3
    view.x -= 10
    return view
  }

  #getFallImage (): Sprite {
    const view = new Sprite(this.#assets.getTexture('run0003'))
    return view
  }
}
