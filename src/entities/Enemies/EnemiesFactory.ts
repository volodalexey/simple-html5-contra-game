import { type IPointData } from 'pixi.js'
import { type AssetsFactory } from '../../AssetsFactory'
import { type World } from '../../World'
import { type BulletFactory } from '../Bullets/BulletFactory'
import { type Entity } from '../Entity'
import { type Hero } from '../Hero/Hero'
import { Runner } from './Runner/Runner'
import { RunnerView } from './Runner/RunnerView'
import { Turret } from './Turret/Turret'
import { TurretView } from './Turret/TurretView'
import { Boss } from './Boss/Boss'
import { BossView } from './Boss/BossView'
import { BossGun } from './Boss/BossGun'
import { BossGunView } from './Boss/BossGunView'

interface IEnemiesFactoryOptions {
  target: Hero
  bulletFactory: BulletFactory
  worldContainer: World
  entities: Entity[]
  assets: AssetsFactory
}

export class EnemiesFactory {
  #worldContainer
  #target
  #bulletFactory
  #entities
  #assets

  constructor ({ worldContainer, target, bulletFactory, entities, assets }: IEnemiesFactoryOptions) {
    this.#worldContainer = worldContainer
    this.#target = target
    this.#bulletFactory = bulletFactory
    this.#entities = entities
    this.#assets = assets
  }

  createRunner ({ x, y }: IPointData): Runner {
    const view = new RunnerView({ assets: this.#assets })
    this.#worldContainer.game.addChild(view)

    const runner = new Runner({ view, target: this.#target })
    runner.x = x
    runner.y = y

    this.#entities.push(runner)

    return runner
  }

  createTurret ({ x, y }: IPointData): Turret {
    const view = new TurretView({ assets: this.#assets })
    this.#worldContainer.game.addChild(view)

    const turret = new Turret({ view, target: this.#target, bulletFactory: this.#bulletFactory })
    turret.x = x
    turret.y = y

    this.#entities.push(turret)

    return turret
  }

  createBoss ({ x, y }: IPointData): Boss {
    const view = new BossView({ assets: this.#assets })
    this.#worldContainer.game.addChild(view)

    const boss = new Boss({ view })
    boss.x = x - 35
    boss.y = y + 95

    this.#entities.push(boss)

    const gun1 = this.#createBossGun()
    gun1.x = x - 56
    gun1.y = y

    const gun2 = this.#createBossGun()
    gun2.x = x + 34
    gun2.y = y

    return boss
  }

  #createBossGun (): BossGun {
    const view = new BossGunView({ assets: this.#assets })
    this.#worldContainer.game.addChild(view)
    const bossGun = new BossGun({ view, target: this.#target, bulletFactory: this.#bulletFactory })
    this.#entities.push(bossGun)
    return bossGun
  }
}
