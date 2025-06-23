import { ICommand } from '@libs/design/commandPattern/ICommand';

export class LoggerInvoker {
  private command: ICommand | null = null;

  public setCommand(command: ICommand) {
    this.command = command;
  }

  public invoke() {
    this.command?.execute();
  }
}
