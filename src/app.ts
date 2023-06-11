import { SceneManager } from './scenes/SceneManager'
import { LoaderScene } from './scenes/LoaderScene'
import { GameScene } from './scenes/GameScene'

async function run (): Promise<void> {
  const loader: HTMLElement | null = document.querySelector('.loader')
  if (loader != null) {
    loader.parentElement?.removeChild(loader)
  }
  await SceneManager.initialize()
  const loaderScene = new LoaderScene({
    viewWidth: SceneManager.width,
    viewHeight: SceneManager.height
  })
  await SceneManager.changeScene({ name: 'loader', newScene: loaderScene })
  await loaderScene.initializeLoader()
  await SceneManager.changeScene({
    name: 'game',
    newScene: new GameScene({
      app: SceneManager.app,
      viewWidth: SceneManager.width,
      viewHeight: SceneManager.height
    })
  })
}

run().catch((err) => {
  console.error(err)
  const errorMessageDiv: HTMLElement | null = document.querySelector('.error-message')
  if (errorMessageDiv != null) {
    errorMessageDiv.classList.remove('hidden')
    errorMessageDiv.innerText = ((Boolean(err)) && (Boolean(err.message))) ? err.message : err
  }
  const errorStackDiv: HTMLElement | null = document.querySelector('.error-stack')
  if (errorStackDiv != null) {
    errorStackDiv.classList.remove('hidden')
    errorStackDiv.innerText = ((Boolean(err)) && (Boolean(err.stack))) ? err.stack : ''
  }
  const canvas: HTMLCanvasElement | null = document.querySelector('canvas')
  if (canvas != null) {
    canvas.parentElement?.removeChild(canvas)
  }
})
