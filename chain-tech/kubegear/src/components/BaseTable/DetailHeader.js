import React from 'react';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';
import { DetailsHeader } from 'office-ui-fabric-react/lib/components/DetailsList/DetailsHeader';
import HeaderTooltip from './HeaderTooltip'

const renderDetailsHeader = detailsHeaderProps => {
  return (
    <Sticky
      isScrollSynced
      stickyPosition={StickyPositionType.Header}
    >
      <DetailsHeader
        {...detailsHeaderProps}
        onRenderColumnHeaderTooltip={HeaderTooltip}
        styles={{
          root: {
            padding: '10px 0'
          }
        }}
      />
    </Sticky>
  );
};

export default renderDetailsHeader