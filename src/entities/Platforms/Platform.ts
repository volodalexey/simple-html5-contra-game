import { Entity } from '../Entity'
import { type PlatformView } from './PlatformView'

interface IPlatformOptions {
  view: PlatformView
}

export class Platform extends Entity<PlatformView> {
  isStep = false
  constructor ({ view }: IPlatformOptions) {
    super(view)

    this.isActive = true
  }
}
