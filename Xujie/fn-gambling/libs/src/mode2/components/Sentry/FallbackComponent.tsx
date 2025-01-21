import React from 'react';

const FallbackComponent = (errData: {
  error: unknown;
  componentStack: string;
  eventId: string;
  resetError(): void;
}) => {
  console.error('Sentry ErrorBoundary==>', errData);
  return (
    <div className="bg-[#000000] text-white">
      {errData.componentStack}

      {/*{JSON.stringify(errData, null, 2)}*/}
    </div>
  );
};
export default FallbackComponent;
