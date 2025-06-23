import { ICommand } from '@libs/design/commandPattern/ICommand';

export interface IInvoker<C extends ICommand> {
  addCommand(command: C): void;
  addAllCommand(commands: C[]): void;
  executeNext(flag?: string): void;
  clearAll(): void;
}
