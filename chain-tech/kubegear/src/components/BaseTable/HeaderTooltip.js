import React from 'react';

const renderCustomHeaderTooltip = (tooltipHostProps, defaultRender) => {
  return (
    <div
      style={{
        fontSize: '16px',
        fontWeight: 'bold'
      }}
    >
      {
        defaultRender({
          ...tooltipHostProps,
          selectAllVisibility: 2
        })
      }
    </div>
  );
};

export default renderCustomHeaderTooltip