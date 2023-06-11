export enum KeyName {
  KeyS = 'KeyS',
  KeyA = 'KeyA',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown'
}

interface IKeyState {
  isDown: boolean
  executeUp?: () => void
  executeDown?: () => void
}

export interface IButtonContext {
  arrowLeft: boolean
  arrowRight: boolean
  arrowUp: boolean
  arrowDown: boolean
  shoot: boolean
}

export class KeyboardProcessor {
  #keyMap: Record<KeyName, IKeyState> = {
    KeyS: {
      isDown: false
    },
    KeyA: {
      isDown: false
    },
    ArrowLeft: {
      isDown: false
    },
    ArrowRight: {
      isDown: false
    },
    ArrowUp: {
      isDown: false
    },
    ArrowDown: {
      isDown: false
    }
  }

  constructor () {
    this.setupEventListeners()
  }

  setupEventListeners (): void {
    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)
  }

  getButton (keyName: KeyName): IKeyState {
    return this.#keyMap[keyName]
  }

  onKeyDown = (e: KeyboardEvent): void => {
    const button = this.#keyMap[e.code as KeyName]
    if (button != null) {
      button.isDown = true
      button.executeDown?.()
    }
  }

  onKeyUp = (e: KeyboardEvent): void => {
    const button = this.#keyMap[e.code as KeyName]
    if (button != null) {
      button.isDown = false
      button.executeUp?.()
    }
  }

  isButtonPressed (keyName: KeyName): boolean {
    return this.#keyMap[keyName].isDown
  }

  getArrowButtonContext (): IButtonContext {
    const buttonContext = {
      arrowLeft: this.isButtonPressed(KeyName.ArrowLeft),
      arrowRight: this.isButtonPressed(KeyName.ArrowRight),
      arrowUp: this.isButtonPressed(KeyName.ArrowUp),
      arrowDown: this.isButtonPressed(KeyName.ArrowDown),
      shoot: this.isButtonPressed(KeyName.KeyA)
    }
    return buttonContext
  }
}
