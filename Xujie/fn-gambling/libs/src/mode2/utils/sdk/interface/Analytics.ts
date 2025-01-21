export interface IEventPayload {
  event: string;
}

export interface IErrorPayload {}

export interface AnalyticsExtra {}
export interface Analytics<
  T extends IEventPayload,
  E extends IErrorPayload,
  Extra extends AnalyticsExtra
> {
  init(): void;

  sendEvent: (payload: T) => void;

  sendError: (payload: E) => void;

  // 额外的属性或方法
  extra: Extra;
}
