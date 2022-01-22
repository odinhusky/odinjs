import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

/**
 * @author odin
 * @level any/BaseCheckbox
 * @component BaseCheckbox
 * @description Combine <FormControlLabel> and <Checkbox> packaged component
*/
export const BaseCheckbox = ({ checkboxProps, ...props }) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          {...checkboxProps}
        />
      }
      {...props}
    />
  )
}

BaseCheckbox.propTypes = {
  checkboxProps: PropTypes.object
}

export default BaseCheckbox;
