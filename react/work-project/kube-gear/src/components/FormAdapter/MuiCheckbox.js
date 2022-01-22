import React from 'react';
import PropTypes from 'prop-types';
import { BaseCheckbox } from 'components/BaseMuiInput';

export const MuiCheckboxAdapter = ({ input, meta, ...rest }) => {
  return (
    <BaseCheckbox
      {...input}
      {...rest}
      checkboxProps={{
        onChange: (event, value) => input.onChange (value)
      }}
      errorMessage={meta.touched ? meta.error : ''}
    />
  );
};

MuiCheckboxAdapter.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object
}

export default MuiCheckboxAdapter;
