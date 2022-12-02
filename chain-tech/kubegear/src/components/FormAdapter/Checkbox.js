import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'components/BaseInput';

export const CheckboxAdapter = ({ input, meta, ...rest }) => {
  return (
    <Checkbox
      {...input}
      {...rest}
      errorMessage={meta.touched ? meta.error : ''}
      onChange={(event, value) => input.onChange (value)}
    />
  );
};

CheckboxAdapter.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object
}

export default CheckboxAdapter;