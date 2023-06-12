import { logKeyCode } from './utils/logger'

export enum KeyName {
  KeyW = 'KeyW',
  KeyD = 'KeyD',
  KeyS = 'KeyS',
  KeyA = 'KeyA',
  ArrowUp = 'ArrowUp',
  ArrowRight = 'ArrowRight',
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  ShiftLeft = 'ShiftLeft',
  ShiftRight = 'ShiftRight',
  ControlLeft = 'ControlLeft',
  ControlRight = 'ControlRight',
  Space = 'Space',
  Enter = 'Enter',
}

interface IKeyState {
  isDown: boolean
  executeUp?: () => void
  executeDown?: () => void
}

export class KeyboardProcessor {
  #keyMap: Record<KeyName, IKeyState> = {
    KeyW: {
      isDown: false
    },
    KeyD: {
      isDown: false
    },
    KeyS: {
      isDown: false
    },
    KeyA: {
      isDown: false
    },
    ArrowUp: {
      isDown: false
    },
    ArrowRight: {
      isDown: false
    },
    ArrowDown: {
      isDown: false
    },
    ArrowLeft: {
      isDown: false
    },
    ShiftLeft: {
      isDown: false
    },
    ShiftRight: {
      isDown: false
    },
    ControlLeft: {
      isDown: false
    },
    ControlRight: {
      isDown: false
    },
    Space: {
      isDown: false
    },
    Enter: {
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
    logKeyCode(`Down ${e.code}`)
    const button = this.#keyMap[e.code as KeyName]
    if (button != null) {
      button.isDown = true
      button.executeDown?.()
    }
  }

  onKeyUp = (e: KeyboardEvent): void => {
    logKeyCode(`Up ${e.code}`)
    const button = this.#keyMap[e.code as KeyName]
    if (button != null) {
      button.isDown = false
      button.executeUp?.()
    }
  }

  isButtonPressed (keyName: KeyName): boolean {
    return this.#keyMap[keyName].isDown
  }
}
