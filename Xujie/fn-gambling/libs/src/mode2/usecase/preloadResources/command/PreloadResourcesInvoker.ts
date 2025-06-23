import { IInvoker } from '@libs/design/commandPattern/IInvoker';
import { PreloadResourcesCommand } from './PreloadResourcesCommand';

export class PreloadResourcesInvoker
  implements IInvoker<PreloadResourcesCommand>
{
  private commandQueue: PreloadResourcesCommand[] = [];

  constructor() {
    this.commandQueue = [];
  }

  addCommand(command: PreloadResourcesCommand): void {
    this.commandQueue.push(command);
  }

  addUnshiftCommand(command: PreloadResourcesCommand): void {
    this.commandQueue.unshift(command);
  }

  addAllCommand(commands: PreloadResourcesCommand[]): void {
    this.commandQueue.push(...commands);
  }

  addAllCommandToFront(commands: PreloadResourcesCommand[]): void {
    this.commandQueue = [...commands, ...this.commandQueue];
    // this.commandQueue.unshift(...commands);
  }

  executeNext(): void {
    const command = this.commandQueue.shift();
    if (command) {
      command.execute();
    }
  }

  clearAll(): void {
    this.commandQueue = [];
  }
}

export default new PreloadResourcesInvoker();
