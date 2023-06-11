import { type IBulletContext } from './entities/Bullets/Bullet'
import { type BulletFactory } from './entities/Bullets/BulletFactory'

interface IWeaponOptions {
  bulletFactory: BulletFactory
}

export enum WeaponType {
  defaultGun = 'defaultGun',
  spreadGun = 'spreadGun',
}

export class Weapon {
  #currentGunStrategy
  #bulletFactory

  #count = 0
  #limit = 6

  #isFire = false

  constructor ({ bulletFactory }: IWeaponOptions) {
    this.#bulletFactory = bulletFactory

    this.#currentGunStrategy = this.#defaultGunStrategy
  }

  handleUpdate (bulletContext: IBulletContext): void {
    if (!this.#isFire) {
      return
    }

    if (this.#count % this.#limit === 0) {
      this.#currentGunStrategy(bulletContext)
    }
    this.#count++
  }

  setWeapon (type: WeaponType): void {
    switch (type) {
      case WeaponType.defaultGun:
        this.#currentGunStrategy = this.#defaultGunStrategy
        break
      case WeaponType.spreadGun:
        this.#currentGunStrategy = this.#spreadGunStrategy
        break
    }
  }

  startFire (): void {
    this.#isFire = true
  }

  stopFire (): void {
    this.#isFire = false
    this.#count = 0
  }

  #defaultGunStrategy (bulletContext: IBulletContext): void {
    this.#limit = 10
    this.#bulletFactory.createBullet(bulletContext)
  }

  #spreadGunStrategy (bulletContext: IBulletContext): void {
    this.#limit = 40
    let angleShift = -20
    for (let i = 0; i < 5; i++) {
      const localBulletContext = {
        x: bulletContext.x,
        y: bulletContext.y,
        angle: bulletContext.angle + angleShift,
        type: bulletContext.type
      }

      this.#bulletFactory.createSpreadGunBullet(localBulletContext)
      angleShift += 10
    }
  }
}
