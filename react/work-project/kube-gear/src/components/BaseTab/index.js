import React from 'react';
import PropTypes from 'prop-types';
import { Pivot, PivotLinkSize, PivotItem } from 'office-ui-fabric-react';

const BaseTab = ({ children, withBorder = true, items = [], ...props }) => {
  const pivotStyle = {
    root: {
      borderBottom: withBorder ? '2px solid #eee' : 'none'
    },
    link: {
      paddingRight: 8,
      paddingLeft: 8,
      width: 'auto',
      height: 38
    },
    linkIsSelected: {
      marginRight: 8,
      paddingRight: 8,
      paddingLeft: 8,
      width: 'auto',
      selectors: {
        ':before': {
          transition: ' left 0.267s cubic-bezier(0.1, 0.25, 0.75, 0.9) 0s, right 0.267s cubic-bezier(0.1, 0.25, 0.75, 0.9) 0s'
        },
        ':hover:before': {
          left: 0,
          right: 0,
          transition: ' left 0.267s cubic-bezier(0.1, 0.25, 0.75, 0.9) 0s, right 0.267s cubic-bezier(0.1, 0.25, 0.75, 0.9) 0s'
        }
      }
    },
    linkContent: {
      margin: 'auto'
    }
  };
  return (
    <Pivot
      linkSize={PivotLinkSize.large}
      styles={pivotStyle}
      {...props}
    >
      {
        items && items.map(item => (
          <PivotItem
            headerText={item.text}
            itemKey={item.key}
            key={item.key}
            styles={item.styles}
          />
        ))
      }
      {children}
    </Pivot>
  );
};

BaseTab.propTypes = {
  children: PropTypes.node,
  withBorder: PropTypes.bool,
  items: PropTypes.array
};

export default BaseTab;
