import { Container, type FederatedPointerEvent, Graphics, type DisplayObject } from 'pixi.js'
import { logMoveInterface } from './utils/logger'

interface IPointerWrapperOptions<T extends DisplayObject = DisplayObject> {
  target: T
  moveThreshold?: number
  upThreshold?: number
  rightThreshold?: number
  downThreshold?: number
  leftThreshold?: number
}

interface IPointerContext {
  up: boolean
  upRight: boolean
  right: boolean
  downRight: boolean
  down: boolean
  downLeft: boolean
  left: boolean
  upLeft: boolean
  isPressed: boolean
}

class PointerWrapper<T extends DisplayObject = DisplayObject> {
  #target
  #pointerDownId = -1
  #pointerDownX = -1
  #pointerDownY = -1
  #moveThreshold
  #upThreshold
  #rightThreshold
  #downThreshold
  #leftThreshold
  #context = {
    up: false,
    upRight: false,
    right: false,
    downRight: false,
    down: false,
    downLeft: false,
    left: false,
    upLeft: false,
    isPressed: false
  }

  constructor ({
    target,
    moveThreshold = 0,
    upThreshold = 0, rightThreshold = 0, downThreshold = 0, leftThreshold = 0
  }: IPointerWrapperOptions<T>) {
    this.#target = target
    this.#moveThreshold = moveThreshold
    this.#upThreshold = upThreshold
    this.#rightThreshold = rightThreshold
    this.#downThreshold = downThreshold
    this.#leftThreshold = leftThreshold
    this.addEventListeners()
  }

  get target (): T {
    return this.#target
  }

  addEventListeners (): void {
    this.#target.eventMode = 'static'
    this.#target.on('pointerdown', this.onPointerDown)
    this.#target.on('pointermove', this.onPointerMove)
    this.#target.on('pointerup', this.onPointerUp)
    this.#target.on('pointerleave', this.onPointerLeave)
  }

  onPointerDown = (e: FederatedPointerEvent): void => {
    this.#pointerDownId = e.pointerId
    this.#pointerDownX = e.globalX
    this.#pointerDownY = e.globalY
    this.#context.isPressed = true
  }

  onPointerMove = (e: FederatedPointerEvent): void => {
    if (e.pointerId === this.#pointerDownId) {
      const diffY = e.globalY - this.#pointerDownY
      const diffX = e.globalX - this.#pointerDownX
      const distance = Math.hypot(diffY, diffX)
      if (distance >= this.#moveThreshold) {
        logMoveInterface(`distance=${distance} mt=${this.#moveThreshold} diffX=${diffX} diffY=${diffY}`)
        this.#context.up = -diffY >= this.#upThreshold
        this.#context.right = diffX >= this.#rightThreshold
        this.#context.down = diffY >= this.#downThreshold
        this.#context.left = -diffX >= this.#leftThreshold
        this.#context.upRight = this.#context.up && this.#context.right
        this.#context.downRight = this.#context.down && this.#context.right
        this.#context.downLeft = this.#context.down && this.#context.left
        this.#context.upLeft = this.#context.up && this.#context.left
      } else {
        this.clearDirectionContext()
      }
    }
  }

  onPointerUp = (e: FederatedPointerEvent): void => {
    if (e.pointerId === this.#pointerDownId) {
      this.clear()
    }
  }

  onPointerLeave = (e: FederatedPointerEvent): void => {
    if (e.pointerId === this.#pointerDownId) {
      this.clear()
    }
  }

  get context (): IPointerContext {
    return this.#context
  }

  clear (): void {
    this.#pointerDownId = this.#pointerDownX = this.#pointerDownY = -1
    this.clearDirectionContext()
    this.#context.isPressed = false
  }

  clearDirectionContext (): void {
    this.#context.up = this.#context.upRight = this.#context.right = this.#context.downRight =
      this.#context.down = this.#context.downLeft = this.#context.left = this.#context.upLeft = false
  }
}

enum Layout {
  bottomLeft = 'bottomLeft',
  bottomRight = 'bottomRight',
  topLeft = 'topLeft',
  topRight = 'topRight',
}

class DirectionStick extends Graphics {}
class JumpButton extends Graphics {}
class ShootButton extends Graphics {}

export class MoveInterface extends Container {
  directionStick = new PointerWrapper({
    target: new DirectionStick(),
    upThreshold: 30,
    rightThreshold: 20,
    downThreshold: 30,
    leftThreshold: 20
  })

  jumpButton = new PointerWrapper({ target: new JumpButton() })
  shootButton = new PointerWrapper({ target: new ShootButton() })
  layout = Layout.bottomLeft
  static options = {
    offset: {
      x: 40,
      y: 40
    },
    padding: {
      x: 20
    },
    direction: {
      colorIdle: 0x00ff00,
      alphaIdle: 0.3,
      colorPressed: 0x00ff00,
      alphaPressed: 0.5,
      radius: 40,
      scalePressed: 3
    },
    jump: {
      colorIdle: 0x0000ff,
      alphaIdle: 0.3,
      colorPressed: 0x0000ff,
      alphaPressed: 0.5,
      radius: 30
    },
    shoot: {
      colorIdle: 0xff0000,
      alphaIdle: 0.3,
      colorPressed: 0xff0000,
      alphaPressed: 0.5,
      radius: 30
    }
  }

  constructor () {
    super()
    this.setup()
    this.draw()
  }

  setup (): void {
    this.addChild(this.directionStick.target)
    this.addChild(this.jumpButton.target)
    this.addChild(this.shootButton.target)
  }

  draw (): void {
    const { direction, jump, shoot } = MoveInterface.options
    const directionGr = this.directionStick.target
    directionGr.beginFill(0xffffff)
    directionGr.drawCircle(0, 0, direction.radius)
    directionGr.endFill()
    directionGr.cacheAsBitmap = true
    const jumpGr = this.jumpButton.target
    jumpGr.beginFill(0xffffff)
    jumpGr.drawCircle(0, 0, jump.radius)
    jumpGr.endFill()
    jumpGr.cacheAsBitmap = true
    const shootGr = this.shootButton.target
    shootGr.beginFill(0xffffff)
    shootGr.drawCircle(0, 0, shoot.radius)
    shootGr.endFill()
    shootGr.cacheAsBitmap = true
  }

  handleUpdate (): void {
    const { direction, jump, shoot } = MoveInterface.options
    const { context: directionCtx, target: directionTarget } = this.directionStick
    directionTarget.tint = directionCtx.isPressed ? direction.colorPressed : direction.colorIdle
    directionTarget.alpha = directionCtx.isPressed ? direction.alphaPressed : direction.alphaIdle
    directionTarget.scale.set(directionCtx.isPressed ? direction.scalePressed : 1)
    const { context: jumpCtx, target: jumpTarget } = this.jumpButton
    jumpTarget.tint = jumpCtx.isPressed ? jump.colorPressed : jump.colorIdle
    jumpTarget.alpha = jumpCtx.isPressed ? jump.alphaPressed : jump.alphaIdle
    const { context: shootCtx, target: shootTarget } = this.shootButton
    shootTarget.tint = shootCtx.isPressed ? shoot.colorPressed : shoot.colorIdle
    shootTarget.alpha = shootCtx.isPressed ? shoot.alphaPressed : shoot.alphaIdle
  }

  handleResize ({ viewWidth, viewHeight }: {
    viewWidth: number
    viewHeight: number
  }): void {
    const { offset, padding } = MoveInterface.options
    const { target: directionTarget } = this.directionStick
    const { target: jumpTarget } = this.jumpButton
    const { target: shootTarget } = this.shootButton
    const bounds = { top: offset.y, right: viewWidth - offset.x, bottom: viewHeight - offset.y, left: offset.x }
    switch (this.layout) {
      case Layout.bottomLeft:
        directionTarget.position.set(bounds.left + directionTarget.width / 2, bounds.bottom - directionTarget.height / 2)
        shootTarget.position.set(bounds.right - shootTarget.width / 2, bounds.bottom - shootTarget.height / 2)
        jumpTarget.position.set(shootTarget.position.x - padding.x - jumpTarget.width, bounds.bottom - jumpTarget.height / 2)
        break
      case Layout.bottomRight:
        shootTarget.position.set(bounds.left + shootTarget.width / 2, bounds.bottom - shootTarget.height / 2)
        jumpTarget.position.set(shootTarget.position.x + shootTarget.width + padding.x, bounds.bottom - jumpTarget.height / 2)
        directionTarget.position.set(bounds.right - directionTarget.width / 2, bounds.bottom - directionTarget.height / 2)
        break
      case Layout.topLeft:
        directionTarget.position.set(bounds.left + directionTarget.width / 2, bounds.top + directionTarget.height / 2)
        shootTarget.position.set(bounds.right - shootTarget.width / 2, bounds.top + shootTarget.height / 2)
        jumpTarget.position.set(shootTarget.position.x - padding.x - jumpTarget.width, bounds.top + jumpTarget.height / 2)
        break
      case Layout.topRight:
        shootTarget.position.set(bounds.left + shootTarget.width / 2, bounds.top + shootTarget.height / 2)
        jumpTarget.position.set(shootTarget.position.x + shootTarget.width + padding.x, bounds.top + jumpTarget.height / 2)
        directionTarget.position.set(bounds.right - directionTarget.width / 2, bounds.top + directionTarget.height / 2)
        break
    }
  }
}
