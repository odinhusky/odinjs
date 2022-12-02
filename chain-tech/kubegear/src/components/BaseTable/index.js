import React from 'react';
import { ShimmeredDetailsList } from 'office-ui-fabric-react/lib/ShimmeredDetailsList';
import { SelectionMode, DetailsListLayoutMode, ConstrainMode } from 'office-ui-fabric-react/lib/DetailsList';
import DetailsHeader from './DetailHeader';
import { DetailsRow } from 'office-ui-fabric-react/lib/DetailsList';

const BaseTable = ({ ...props }) => {
  return (
    <ShimmeredDetailsList
      constrainMode={ConstrainMode.unconstrained}
      layoutMode={DetailsListLayoutMode.justified}
      onRenderDetailsHeader={DetailsHeader}
      onRenderRow={props => {
        return (
          <DetailsRow
            styles={{ 
              root: {
                fontSize: '14px',
                color: '#333'
              },
              cell: {
                display: 'flex',
                alignItems: 'center'
              },
              checkCell: {
                display: 'flex',
                alignItems: 'center'
              }
            }}
            {...props}
          />
        )
      }}
      selectionMode={SelectionMode.none}
      shimmerLines={10}
      styles={{
        cell: {
          display: 'flex',
          alignItems: 'center'
        }
      }}
      {...props}
    />
  )
}

export default BaseTable;