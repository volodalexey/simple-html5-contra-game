import { type DisplayObject } from 'pixi.js'

export interface IScene extends DisplayObject {
  name: string
  handleUpdate: (deltaMS: number) => void
  mountedHandler?: () => void
  unmountedHandler?: () => void
  handleResize: (options: {
    viewWidth: number
    viewHeight: number
  }) => void
}
