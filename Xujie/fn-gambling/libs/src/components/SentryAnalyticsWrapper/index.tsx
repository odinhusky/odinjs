import { ReactNode } from 'react';
import { SentryAnalytics } from '@mode2/utils/sdk/strategy/analytics/SentryAnalytics';
import * as Sentry from '@mode2/components/Sentry';
import React from 'react';

export const SentryAnalyticsWrapper = (props: { children: ReactNode }) => {
  if (SentryAnalytics.extra.isSupportSentryAnalytics()) {
    return (
      <Sentry.ErrorBoundary showDialog={import.meta.env.DEV}>
        {props.children}
      </Sentry.ErrorBoundary>
    );
  } else {
    return props.children;
  }
};

export default SentryAnalyticsWrapper;
