import { AddLogCommand } from './AddLogCommand';
import { ILogPayload } from './ICommand';
import { LoggerInvoker } from './LoggerInvoker';
import { LoggerReceiver } from './LoggerReceiver';

export class LoggerClient {
  private invoker: LoggerInvoker;
  private receiver: LoggerReceiver;

  constructor() {
    this.invoker = new LoggerInvoker();
    this.receiver = new LoggerReceiver();
  }

  public logEvent(payload: ILogPayload) {
    console.log('[CollectionLogger] logEvent', payload);
    const command = new AddLogCommand(this.receiver, payload);
    this.invoker.setCommand(command);
    this.invoker.invoke();
  }
}
