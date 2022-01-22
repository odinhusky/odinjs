import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export const withLoading = (WrapperComponent) => ({ isLoading, ...props }) => {
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: ' center', height: '100%' }}>
        <CircularProgress />
      </div>
    )
  } else {
    return <WrapperComponent {...props} />
  }
}
