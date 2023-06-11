import { type IPointData } from 'pixi.js'

interface IRect { x: number, y: number, width: number, height: number }

export abstract class Physics {
  static getOrientCollisionResult ({ aaRect, bbRect, aaPrevPoint }: { aaRect: IRect, bbRect: IRect, aaPrevPoint: IPointData }): {
    horizontal: boolean
    vertical: boolean
  } {
    const collisionResult = {
      horizontal: false,
      vertical: false
    }

    if (!this.isCheckAABB({ entity: aaRect, area: bbRect })) {
      return collisionResult
    }

    aaRect.y = aaPrevPoint.y
    if (!this.isCheckAABB({ entity: aaRect, area: bbRect })) {
      collisionResult.vertical = true
      return collisionResult
    }

    collisionResult.horizontal = true
    return collisionResult
  }

  static isCheckAABB ({ entity, area }: { entity: IRect, area: IRect }): boolean {
    return (entity.x < area.x + area.width &&
            entity.x + entity.width > area.x &&
            entity.y < area.y + area.height &&
            entity.y + entity.height > area.y)
  }
}
