import { type Application, TextStyle, Text } from 'pixi.js'
import { type AssetsFactory } from './AssetsFactory'
import { World } from './World'
import { type Entity } from './entities/Entity'
import { StaticBackground } from './StaticBackground'
import { BulletFactory } from './entities/Bullets/BulletFactory'
import { HeroFactory } from './entities/Hero/HeroFactory'
import { EnemiesFactory } from './entities/Enemies/EnemiesFactory'
import { PlatformFactory } from './entities/Platforms/PlatformFactory'
import { PowerupsFactory } from './entities/Powerups/PowerupsFactory'
import { type Platform } from './entities/Platforms/Platform'
import { LevelFactory } from './LevelFactory'
import { KeyName, KeyboardProcessor } from './KeyboardProcessor'
import { EntityType } from './entities/EntityType'
import { Camera } from './Camera'
import { Weapon, WeaponType } from './Weapon'
import { Physics } from './Physics'
import { type SpreadgunPowerup } from './entities/Powerups/SpreadgunPowerup'
import { type Hero } from './entities/Hero/Hero'
import { type Runner } from './entities/Enemies/Runner/Runner'
import { type Powerup } from './entities/Powerups/Powerup'

interface IGameOptions {
  pixiApp: Application
  assets: AssetsFactory
}

type CharacterEntity = Hero | Runner | Powerup | SpreadgunPowerup

export class Game {
  #pixiApp
  #hero
  #boss
  #platforms: Platform[] = []
  #entities: Entity[] = []
  #camera
  #bulletFactory
  #worldContainer
  #weapon
  #isEndGame = false

  keyboardProcessor
  constructor ({ pixiApp, assets }: IGameOptions) {
    this.#pixiApp = pixiApp

    this.#worldContainer = new World()
    this.#pixiApp.stage.addChild(new StaticBackground({ screenSize: this.#pixiApp.screen, assets }))
    this.#pixiApp.stage.addChild(this.#worldContainer)

    this.#bulletFactory = new BulletFactory({ worldContainer: this.#worldContainer, entities: this.#entities })

    const heroFactory = new HeroFactory({ worldContainer: this.#worldContainer, assets })
    this.#hero = heroFactory.create({ x: 160, y: 100 })

    this.#entities.push(this.#hero)

    const enemyFactory = new EnemiesFactory({
      worldContainer: this.#worldContainer,
      target: this.#hero,
      bulletFactory: this.#bulletFactory,
      entities: this.#entities,
      assets
    })

    const platformFactory = new PlatformFactory({ worldContainer: this.#worldContainer, assets })

    const powerupFactory = new PowerupsFactory({
      entities: this.#entities, assets, worldContainer: this.#worldContainer, target: this.#hero
    })

    const levelFactory = new LevelFactory({
      platforms: this.#platforms,
      entities: this.#entities,
      platformFactory,
      enemyFactory,
      target: this.#hero,
      powerupFactory
    })
    this.#boss = levelFactory.createLevel()

    this.keyboardProcessor = new KeyboardProcessor()
    this.setKeys()

    this.#camera = new Camera({
      target: this.#hero,
      world: this.#worldContainer,
      screenSize: this.#pixiApp.screen,
      isBackScrollX: false
    })

    this.#weapon = new Weapon({ bulletFactory: this.#bulletFactory })
    this.#weapon.setWeapon(WeaponType.defaultGun)
  }

  handleResize ({ viewWidth, viewHeight }: {
    viewWidth: number
    viewHeight: number
  }): void {}

  handleUpdate (deltaMS: number): void {
    for (let i = 0; i < this.#entities.length; i++) {
      const entity = this.#entities[i]
      entity.handleUpdate()

      if (entity.type === EntityType.hero || entity.type === EntityType.enemy ||
        entity.type === EntityType.powerupBox || entity.type === EntityType.spreadgunPowerup) {
        this.#checkDamage(entity as CharacterEntity)
        this.#checkPlatforms(entity as CharacterEntity)
      }

      this.#checkEntityStatus(entity, i)
    }

    this.#camera.handleUpdate()
    this.#weapon.handleUpdate(this.#hero.bulletContext)

    this.#checkGameStatus()
  }

  #checkGameStatus (): void {
    if (this.#isEndGame) {
      return
    }

    const isBossDead = !this.#boss.isActive
    if (isBossDead) {
      const enemies = this.#entities.filter(e => e.type === EntityType.enemy && e !== this.#boss)
      enemies.forEach(e => { e.setDead() })
      this.#isEndGame = true
      this.#showEndGame()
    }

    const isHeroDead = !this.#entities.some(e => e.type === EntityType.hero) && this.#hero.isDead
    if (isHeroDead) {
      this.#entities.push(this.#hero)
      this.#worldContainer.game.addChild(this.#hero._view)
      this.#hero.reset()
      this.#hero.x = -this.#worldContainer.x + 160
      this.#hero.y = 100
      this.#weapon.setWeapon(WeaponType.defaultGun)
    }
  }

  #showEndGame (): void {
    const style = new TextStyle({
      fontFamily: 'Impact',
      fontSize: 50,
      fill: [0xffffff, 0xdd0000],
      stroke: 0x000000,
      strokeThickness: 5,
      letterSpacing: 30
    })

    const text = new Text('STAGE CLEAR', style)
    text.x = this.#pixiApp.screen.width / 2 - text.width / 2
    text.y = this.#pixiApp.screen.height / 2 - text.height / 2

    this.#pixiApp.stage.addChild(text)
  }

  #checkDamage (entity: CharacterEntity): void {
    const damagers = this.#entities.filter(damager => ((entity.type === EntityType.enemy || entity.type === EntityType.powerupBox) && damager.type === EntityType.heroBullet) ||
                                                    (entity.type === EntityType.hero && (damager.type === EntityType.enemyBullet || damager.type === EntityType.enemy)))

    for (const damager of damagers) {
      if (Physics.isCheckAABB({ entity: damager.hitBox, area: entity.hitBox })) {
        entity.damage()
        if (damager.type !== EntityType.enemy) {
          damager.setDead()
        }

        break
      }
    }

    const powerups = this.#entities.filter((powerup): powerup is SpreadgunPowerup => powerup.type === EntityType.spreadgunPowerup && entity.type === EntityType.hero)
    for (const powerup of powerups) {
      if (Physics.isCheckAABB({ entity: powerup.hitBox, area: entity.hitBox })) {
        powerup.damage()
        this.#weapon.setWeapon(powerup.powerupType)
        break
      }
    }
  }

  #checkPlatforms (character: CharacterEntity): void {
    if (character.isDead || !character.gravitable) {
      return
    }

    for (const platform of this.#platforms) {
      if ((character.isJumpState() && platform.type !== EntityType.box) || !platform.isActive) {
        continue
      }
      this.checkPlatfromCollision(character, platform)
    }

    if (character.type === EntityType.hero && character.x < -this.#worldContainer.x) {
      (character as Hero).x = (character as Hero).prevPoint.x
    }
  }

  checkPlatfromCollision (character: CharacterEntity, platform: Platform): void {
    const prevPoint = character.prevPoint
    const collisionResult = Physics.getOrientCollisionResult({
      aaRect: character.collisionBox,
      bbRect: platform.collisionBox,
      aaPrevPoint: prevPoint
    })

    if (collisionResult.vertical) {
      character.y = prevPoint.y
      character.stay(platform.y)
    }
    if (collisionResult.horizontal && platform.type === EntityType.box) {
    // if (collisionResult.horizontal && platform.type === EntityType.box && !character.isForbiddenHorizontalCollision) {
      if (platform.isStep) {
        character.stay(platform.y)
      } else {
        character.x = prevPoint.x
      }
    }
  }

  setKeys (): void {
    const keyA = this.keyboardProcessor.getButton(KeyName.KeyA)
    keyA.executeDown = () => {
      if (!this.#hero.isDead && !this.#hero.isFall) {
        const bullets = this.#entities.filter(bullet => bullet.type === this.#hero.bulletContext.type)
        if (bullets.length > 10) {
          return
        }
        this.#weapon.startFire()
        this.#hero.setView(this.keyboardProcessor.getArrowButtonContext())
      }
    }
    keyA.executeUp = () => {
      if (!this.#hero.isDead && !this.#hero.isFall) {
        this.#weapon.stopFire()
        this.#hero.setView(this.keyboardProcessor.getArrowButtonContext())
      }
    }

    this.keyboardProcessor.getButton(KeyName.KeyS).executeDown = () => {
      if (this.keyboardProcessor.isButtonPressed(KeyName.ArrowDown) &&
            !(this.keyboardProcessor.isButtonPressed(KeyName.ArrowLeft) || this.keyboardProcessor.isButtonPressed(KeyName.ArrowRight))) {
        this.#hero.throwDown()
      } else {
        this.#hero.jump()
      }
    }

    const arrowLeft = this.keyboardProcessor.getButton(KeyName.ArrowLeft)
    arrowLeft.executeDown = () => {
      this.#hero.startLeftMove()
      this.#hero.setView(this.keyboardProcessor.getArrowButtonContext())
    }
    arrowLeft.executeUp = () => {
      this.#hero.stopLeftMove()
      this.#hero.setView(this.keyboardProcessor.getArrowButtonContext())
    }

    const arrowRight = this.keyboardProcessor.getButton(KeyName.ArrowRight)
    arrowRight.executeDown = () => {
      this.#hero.startRightMove()
      this.#hero.setView(this.keyboardProcessor.getArrowButtonContext())
    }
    arrowRight.executeUp = () => {
      this.#hero.stopRightMove()
      this.#hero.setView(this.keyboardProcessor.getArrowButtonContext())
    }

    const arrowUp = this.keyboardProcessor.getButton(KeyName.ArrowUp)
    arrowUp.executeDown = () => {
      this.#hero.setView(this.keyboardProcessor.getArrowButtonContext())
    }
    arrowUp.executeUp = () => {
      this.#hero.setView(this.keyboardProcessor.getArrowButtonContext())
    }

    const arrowDown = this.keyboardProcessor.getButton(KeyName.ArrowDown)
    arrowDown.executeDown = () => {
      this.#hero.setView(this.keyboardProcessor.getArrowButtonContext())
    }
    arrowDown.executeUp = () => {
      this.#hero.setView(this.keyboardProcessor.getArrowButtonContext())
    }
  }

  #checkEntityStatus (entity: Entity, index: number): void {
    if (entity.isDead || this.#isScreenOut(entity)) {
      entity.removeFromStage()
      this.#entities.splice(index, 1)
    }
  }

  #isScreenOut (entity: Entity): boolean {
    if (entity.type === EntityType.heroBullet || entity.type === EntityType.enemyBullet) {
      return (entity.x > (this.#pixiApp.screen.width - this.#worldContainer.x) ||
            entity.x < (-this.#worldContainer.x) ||
            entity.y > this.#pixiApp.screen.height ||
            entity.y < 0)
    } else if (entity.type === EntityType.enemy || entity.type === EntityType.hero) {
      return entity.x < (-this.#worldContainer.x) || entity.y > this.#pixiApp.screen.height
    }
    return false
  }
}
