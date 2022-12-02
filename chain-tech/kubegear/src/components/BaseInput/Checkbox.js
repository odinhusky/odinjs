import React from 'react';
import { Checkbox as UICheckBox } from '@material-ui/core';

export const Checkbox = ({ ...props }) => {
  return (
    <UICheckBox
      color="primary"
      styles={{
        checkbox: { borderRadius: '3px' }
      }}
      {...props}
    />
  )
}

export default Checkbox
