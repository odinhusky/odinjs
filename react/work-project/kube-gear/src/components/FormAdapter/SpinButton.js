import React from 'react';
import PropTypes from 'prop-types';
import { SpinButton } from 'office-ui-fabric-react';
import { isNil } from 'lodash';

export const SpinButtonAdapter = ({ input, meta, ...rest }) => {
  return (
    <SpinButton
      {...input}
      {...rest}
      errorMessage={meta.touched ? meta.error : ''}
      onDecrement={value => {
        if (!isNil(rest.min)) {
          input.onChange (Math.max(+value - 1, rest.min))
        } else {
          input.onChange (+value - 1)
        }
      }}
      onIncrement={value => {
        if (!isNil(rest.max)) {
          input.onChange (Math.min(rest.max, +value + 1))
        } else {
          input.onChange (+value + 1)
        }
      }}
      onValidate={(value) => {
        let x = parseInt(value);
        if (isNaN(value)) {
          x = 0
        }
        if (!isNil(rest.min)) {
          x = (Math.max(x, rest.min))
        } 
        if (!isNil(rest.max)) {
          x = (Math.min(rest.max, x))
        } 
        input.onChange (x)
      }}
    />
  );
};

SpinButtonAdapter.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  onChange: PropTypes.func
}

export default SpinButtonAdapter;