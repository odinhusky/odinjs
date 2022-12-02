import React from 'react';
import PropTypes from 'prop-types';
import { BaseTextField } from 'components/BaseMuiInput';

export const MuiTextFieldAdapter = ({ input, meta, ...rest }) => {
  return (
    <BaseTextField
      {...input}
      {...rest}
      error={meta.error && meta.touched}
      helperText={meta.touched ? meta.error : undefined}
      onChange={(e) => {
        const value = e.target.value;
        input.onChange(value)
      }}
    />
  );
};

MuiTextFieldAdapter.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object
}

export default MuiTextFieldAdapter;