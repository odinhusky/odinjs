import React from 'react';


const K8s = () => {
  return (
    <iframe
      src={window.ENV.k8sDashboardUri}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        border: 'none'
      }}
    />
  );
};

export default K8s;
