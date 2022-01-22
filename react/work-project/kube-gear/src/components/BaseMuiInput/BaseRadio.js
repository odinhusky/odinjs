import React from 'react';
import PropTypes from 'prop-types';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

/**
 * @author odin
 * @level any/BaseRadio
 * @component BaseRadio
 * @description Combine <FormControlLabel> and <Radio> packaged component
*/
export const BaseRadio = ({ radioProps, ...props  }) => {
  return (
    <FormControlLabel
      control={
        <Radio
          {...radioProps}
        />
      }
      {...props}
    />
  )
}

BaseRadio.propTypes = {
  radioProps: PropTypes.object
}

export default BaseRadio;
