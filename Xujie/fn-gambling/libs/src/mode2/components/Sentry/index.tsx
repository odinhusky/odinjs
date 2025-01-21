import React from 'react';
import * as Sentry from '@sentry/react';
import FallbackComponent from './FallbackComponent';
import dayjs from 'dayjs';
import { errorHandlerLoggerEvent } from '@mode2/usecase/useLoggerClient';

export const ErrorBoundary = (props: {
  children?: React.ReactNode | (() => React.ReactNode);
  showDialog?: boolean | undefined;
}) => {
  return (
    <Sentry.ErrorBoundary
      key={`${dayjs().unix()}`}
      fallback={FallbackComponent}
      onError={(error, componentStack) => {
        errorHandlerLoggerEvent(error, `${componentStack}`);
      }}
      showDialog
      {...props}
    />
  );
};
