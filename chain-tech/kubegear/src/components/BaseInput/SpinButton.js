import React from 'react';
import PropTypes from 'prop-types';
import { SpinButton as UISpinButton } from 'office-ui-fabric-react';
import { isNil } from 'lodash';

export const SpinButton = ({ onChange, ...rest }) => {
  return (
    <UISpinButton
      onDecrement={value => {
        if (!isNil(rest.min)) {
          onChange (Math.max(+value - 1, rest.min))
        } else {
          onChange (+value - 1)
        }
      }}
      onIncrement={value => {
        if (!isNil(rest.max)) {
          onChange (Math.min(rest.max, +value + 1))
        } else {
          onChange (+value + 1)
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
        onChange (x)
      }}
      styles={{
        root: {
          width: 100,
          fontSize: 14,
          borderRadius: '3px'
        },
        spinButtonWrapper: { borderRadius: '3px', paddingRight: 5 }
      }}
      {...rest}
    />
  );
};

SpinButton.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  onChange: PropTypes.func
}

export default SpinButton;