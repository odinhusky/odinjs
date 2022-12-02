import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown as UIDropdown } from 'office-ui-fabric-react/lib';

export const Dropdown = ({ styles, ...props }) => {
  return (
    <UIDropdown
      styles={{
        root: {
          minWidth: 150,
          fontSize: 14
        },
        title: { borderRadius: '3px' },
        ...styles
      }}
      {...props}
    />
  )
}

Dropdown.propTypes = {
  styles: PropTypes.object
};

export default Dropdown
