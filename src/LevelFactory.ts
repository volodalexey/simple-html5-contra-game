import { type IPointData } from 'pixi.js'
import { type EnemiesFactory } from './entities/Enemies/EnemiesFactory'
import { type Entity } from './entities/Entity'
import { type Hero } from './entities/Hero/Hero'
import { type Platform } from './entities/Platforms/Platform'
import { type PlatformFactory } from './entities/Platforms/PlatformFactory'
import { type PowerupsFactory } from './entities/Powerups/PowerupsFactory'
import { type Boss } from './entities/Enemies/Boss/Boss'

interface ILevelFactoryOptions {
  platforms: Platform[]
  platformFactory: PlatformFactory
  entities: Entity[]
  enemyFactory: EnemiesFactory
  target: Hero
  powerupFactory: PowerupsFactory
}

export class LevelFactory {
  #platforms
  #platformsFactory
  #enemyFactory
  #entities
  #target
  #powerupFactory

  #blockSize = 128

  constructor ({ platforms, entities, platformFactory, enemyFactory, target, powerupFactory }: ILevelFactoryOptions) {
    this.#platforms = platforms
    this.#entities = entities
    this.#platformsFactory = platformFactory
    this.#enemyFactory = enemyFactory
    this.#target = target
    this.#powerupFactory = powerupFactory
  }

  createLevel (): Boss {
    this.#createDecoration()
    this.#createPlatforms()
    this.#createGround()
    this.#createWater()
    const boss = this.#createBossWall()

    this.#createEnemies()
    this.#createPowerups()

    this.#createInteractive()
    return boss
  }

  #createDecoration (): void {
    for (let i = 22; i < 52; i++) {
      this.#platformsFactory.createJungle({ x: this.#blockSize * i, y: 0 })
    }
  }

  #createPlatforms (): void {
    let xIndexes = [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34]
    this.#create({ xIndexes, y: 276, createFunc: this.#platformsFactory.createPlatform })

    xIndexes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20, 21, 22, 23, 24, 25, 34, 35, 36, 45, 46, 47, 48]
    this.#create({ xIndexes, y: 384, createFunc: this.#platformsFactory.createPlatform })

    xIndexes = [5, 6, 7, 13, 14, 31, 32, 49]
    this.#create({ xIndexes, y: 492, createFunc: this.#platformsFactory.createPlatform })

    xIndexes = [46, 47, 48]
    this.#create({ xIndexes, y: 578, createFunc: this.#platformsFactory.createPlatform })

    xIndexes = [8, 11, 28, 29, 30]
    this.#create({ xIndexes, y: 600, createFunc: this.#platformsFactory.createPlatform })

    xIndexes = [50]
    this.#create({ xIndexes, y: 624, createFunc: this.#platformsFactory.createPlatform })
  }

  #createGround (): void {
    let xIndexes = [9, 10, 25, 26, 27, 32, 33, 34]
    this.#create({ xIndexes, y: 720, createFunc: this.#platformsFactory.createStepBox })

    xIndexes = [36, 37, 39, 40]
    this.#create({ xIndexes, y: 600, createFunc: this.#platformsFactory.createBox })

    xIndexes = [42, 43]
    this.#create({ xIndexes, y: 492, createFunc: this.#platformsFactory.createBox })

    xIndexes = [35, 45, 46, 47, 48, 49, 50, 51, 52]
    this.#create({ xIndexes, y: 720, createFunc: this.#platformsFactory.createBox })
  }

  #createWater (): void {
    const xIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 28, 29, 30, 31]
    this.#create({ xIndexes, y: 768, createFunc: this.#platformsFactory.createWater })
  }

  #createBossWall (): Boss {
    const xIndexes = [52]
    this.#create({ xIndexes, y: 170, createFunc: this.#platformsFactory.createBossWall })

    return this.#enemyFactory.createBoss({ x: this.#blockSize * 52, y: 440 })
  }

  #createInteractive (): void {
    const xIndexes = [16, 17, 18, 19]
    this.#createBridges(xIndexes)
  }

  #createBridges (xIndexes: number[]): void {
    for (const i of xIndexes) {
      const bridge = this.#platformsFactory.createBridge({ x: this.#blockSize * i, y: 384 })
      bridge.setTarget(this.#target)
      this.#platforms.push(bridge)
      this.#entities.push(bridge)
    }
  }

  #create ({ xIndexes, y, createFunc }: { xIndexes: number[], y: number, createFunc: ({ x, y }: IPointData) => Platform }): void {
    for (const i of xIndexes) {
      this.#platforms.push(createFunc.call(this.#platformsFactory, { x: this.#blockSize * i, y }))
    }
  }

  #createEnemies (): void {
    this.#enemyFactory.createRunner({ x: this.#blockSize * 9, y: 290 })
    this.#enemyFactory.createRunner({ x: this.#blockSize * 10, y: 290 })
    this.#enemyFactory.createRunner({ x: this.#blockSize * 11, y: 290 })

    this.#enemyFactory.createRunner({ x: this.#blockSize * 13, y: 290 })
    this.#enemyFactory.createRunner({ x: this.#blockSize * 13 + 50, y: 290 })
    this.#enemyFactory.createRunner({ x: this.#blockSize * 13 + 100, y: 290 })

    this.#enemyFactory.createRunner({ x: this.#blockSize * 16, y: 290 })

    this.#enemyFactory.createRunner({ x: this.#blockSize * 20, y: 290 })
    this.#enemyFactory.createRunner({ x: this.#blockSize * 21, y: 290 })

    this.#enemyFactory.createRunner({ x: this.#blockSize * 29, y: 290 })
    this.#enemyFactory.createRunner({ x: this.#blockSize * 30, y: 290 })

    let runner = this.#enemyFactory.createRunner({ x: this.#blockSize * 40, y: 400 })
    runner.jumpBehaviorFactor = 1
    runner = this.#enemyFactory.createRunner({ x: this.#blockSize * 42, y: 400 })
    runner.jumpBehaviorFactor = 1

    this.#enemyFactory.createTurret({ x: this.#blockSize * 10, y: 670 })
    this.#enemyFactory.createTurret({ x: this.#blockSize * 22 + 50, y: 500 })
    this.#enemyFactory.createTurret({ x: this.#blockSize * 29 + 64, y: 550 })
    this.#enemyFactory.createTurret({ x: this.#blockSize * 35 + 64, y: 550 })
    this.#enemyFactory.createTurret({ x: this.#blockSize * 45 + 64, y: 670 })
    this.#enemyFactory.createTurret({ x: this.#blockSize * 48 + 64, y: 670 })
  }

  #createPowerups (): void {
    this.#powerupFactory.createPowerup({ x: this.#blockSize * 5, y: 150 })
    this.#powerupFactory.createPowerup({ x: this.#blockSize * 15, y: 150 })
    this.#powerupFactory.createPowerup({ x: this.#blockSize * 25, y: 150 })
  }
}
