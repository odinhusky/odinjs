export interface ICommand<T = void> {
  execute(): T;
}

export interface ILogPayload<TEntry = ILogEntry> {
  caller: string;
  client: string;
  version: string;
  level: string;
  entry: TEntry; // message
  traceId: string;
  spanId: string;
  stackTrace: null;
}

export interface ILogEntry<TParams = string> {
  event: string;
  params: TParams;
}

export interface ILoggerReceiver<
  TLogPayload = ILogPayload,
  TLogs = Record<string, string>
> {
  saveLog(logData: TLogPayload): Promise<void>;
  getLogs(): Promise<TLogs>;
  clearLog(keys: string[]): void;
  reportLogs(reports: TLogs, callback?: (keys: string[]) => void): void;
}
