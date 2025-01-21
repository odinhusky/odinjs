import { Root, createRoot } from 'react-dom/client';

class Modal {
  private deps: JSX.Element[] = [];
  private root: Root | null = null;
  private container: HTMLElement = document.createElement('div');

  constructor() {
    this.container.id = 'modal';
    document.body.appendChild(this.container);
  }

  show({ content }: { content: JSX.Element }) {
    if (this.root) {
      this.deps.push(content);
      return;
    }
    this.root = createRoot(this.container);
    this.root.render(content);
    return this;
  }

  hide() {
    if (!this.root) return;
    setTimeout(() => {
      this.root?.unmount();
      this.root = null;
      const nexModalContent = this.deps.shift();
      nexModalContent && this.show({ content: nexModalContent });
    }, 0);
  }

  hideAll() {
    this.deps = [];
    this.hide();
  }
}

export default new Modal();
