import { ReactNode } from 'react';
import { PostHogAnalytics } from '@mode2/utils/sdk/strategy/analytics/PostHogAnalytics';
import { PostHogProvider } from 'posthog-js/react';
import React from 'react';

export const PostHogAnalyticsWrapper = (props: { children: ReactNode }) => {
  if (PostHogAnalytics.extra.isSupportPostHogAnalytics()) {
    return (
      <PostHogProvider
        apiKey={PostHogAnalytics.extra.getApiKey()}
        options={{
          api_host: PostHogAnalytics.extra.getApiHost(),
        }}
      >
        {props.children}
      </PostHogProvider>
    );
  } else {
    return props.children;
  }
};

export default PostHogAnalyticsWrapper
