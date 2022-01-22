import React from 'react';

const DataLabeling = () => {
  return (
    <iframe
      src={window.ENV.dataLabelingUri}
      style={{
        width: '100%',
        height: '100%',
        border: 'none'
      }}
    />
  );
};

export default DataLabeling;