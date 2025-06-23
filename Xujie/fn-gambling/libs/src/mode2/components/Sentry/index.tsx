import React from 'react';
// import * as Sentry from '@sentry/react';

export const ErrorBoundary = (props: {
  children?: React.ReactNode | (() => React.ReactNode);
  showDialog?: boolean | undefined;
}) => {
  return <>{props.children}</>;

  // return (
  //   <Sentry.ErrorBoundary
  //     key={`${dayjs().unix()}`}
  //     fallback={FallbackComponent}
  //     onError={(error, componentStack) => {
  //       errorHandlerLoggerEvent(error, `${componentStack}`);
  //     }}
  //     showDialog
  //     {...props}
  //   />
  // );
};
