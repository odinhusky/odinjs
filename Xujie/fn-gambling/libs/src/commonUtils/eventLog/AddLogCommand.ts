import { ILoggerReceiver, ILogPayload } from './ICommand';
import { ICommand } from '@libs/design/commandPattern/ICommand';

export class AddLogCommand implements ICommand {
  private receiver: ILoggerReceiver;
  private payload: ILogPayload;

  constructor(receiver: ILoggerReceiver, payload: ILogPayload) {
    this.receiver = receiver;
    this.payload = payload;
  }

  public execute(): void {
    this.receiver.saveLog(this.payload);
  }
}
