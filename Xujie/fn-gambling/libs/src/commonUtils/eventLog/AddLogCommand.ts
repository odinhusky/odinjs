import { LOG_MAX_LIMIT } from '../../mode2/@types/eventLogType';
import { ICommand, ILoggerReceiver, ILogPayload } from './ICommand';

export class AddLogCommand implements ICommand<void> {
  private receiver: ILoggerReceiver;
  private payload: ILogPayload;

  constructor(receiver: ILoggerReceiver, payload: ILogPayload) {
    this.receiver = receiver;
    this.payload = payload;
  }

  public execute(): void {
    this.receiver.saveLog(this.payload).then(() => {
      this.checkLogCount();
    });
  }

  private async checkLogCount() {
    const logs = await this.receiver.getLogs();
    if (Object.keys(logs).length >= LOG_MAX_LIMIT) {
      this.receiver.reportLogs(logs);
    }
  }
}
