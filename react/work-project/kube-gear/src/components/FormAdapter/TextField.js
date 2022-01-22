import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'components/BaseInput';

export const TextFieldAdapter = ({ input, meta, ...rest }) => {
  return (
    <TextField
      {...input}
      {...rest}
      errorMessage={meta.touched ? meta.error : ''}
      onChange={(event, value) => input.onChange (value)}
    />
  );
};

TextFieldAdapter.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object
}

export default TextFieldAdapter;