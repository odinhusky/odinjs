import React from 'react';
import PropTypes from 'prop-types';
import BaseMuiDropdown from 'components/BaseMuiDropdown';

export const MuiDropdownAdapter = ({ input, meta, onChange, ...rest }) => {
  return (
    <BaseMuiDropdown
      {...input}
      {...rest}
      errorMessage={meta.touched ? meta.error : ''}
      onChange={(value) => {
        if (value.length !== 0) {
          input.onChange(value[0]);
        }
        if (onChange !== undefined) onChange();
      }}
      selectedItems={input.value}
    />
  )
}

MuiDropdownAdapter.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  options: PropTypes.array,
  defaultSelectedKey: PropTypes.string,
  onChange: PropTypes.func
}

export default MuiDropdownAdapter;
