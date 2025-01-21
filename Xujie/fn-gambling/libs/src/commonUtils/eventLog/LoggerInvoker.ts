import { ICommand } from './ICommand';

export class LoggerInvoker {
  private command: ICommand | null = null;

  public setCommand(command: ICommand) {
    this.command = command;
  }

  public invoke() {
    this.command?.execute();
  }
}
