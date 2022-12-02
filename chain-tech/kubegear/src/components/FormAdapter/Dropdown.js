import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown as UIDropdown } from 'office-ui-fabric-react/lib';

export const DropdownAdapter = ({ 
  input, 
  meta,
  onChange,
  ...rest 
}) => {
  return (
    <UIDropdown 
      {...input}
      {...rest}
      errorMessage={meta.touched ? meta.error : ''}
      onChange={(event, option) => {
        input.onChange(option.key);
        if (onChange !== undefined) onChange();
      }}
    />
  )
}

DropdownAdapter.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  options: PropTypes.array,
  defaultSelectedKey: PropTypes.string,
  onChange: PropTypes.func
}
