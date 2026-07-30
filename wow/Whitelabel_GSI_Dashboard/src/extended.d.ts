export {}

declare global {
  interface HTMLElement {
    _vDraggableCollisionDestroy?: () => void
  }

  interface Window {
    instgrm?: {
      Embeds: {
        process(): void
      }
    }
    tinymce: any
  }
}
