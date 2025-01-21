import {
  IErrorPayload,
  IEventPayload,
} from '@mode2/utils/sdk/interface/Analytics';

export interface AnalyticsProviders {
  analyticsInits(): void;

  sendAnalyticsEvent: <T extends IEventPayload>(payload: T) => void;

  sendAnalyticsError: <T extends IErrorPayload>(payload: T) => void;
}
