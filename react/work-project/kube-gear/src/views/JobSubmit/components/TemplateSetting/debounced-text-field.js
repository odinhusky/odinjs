import React, { useEffect, useState, useCallback, useMemo } from 'react';
import TextField from '@material-ui/core/TextField';

import PropTypes from 'prop-types';
import { debounce } from 'lodash';


export const DebouncedTextField = ({ onChange, value, ...props }) => {
  const [cachedValue, setCachedValue] = useState('');

  useEffect(() =>{
    setCachedValue(value)
  }, [value]);
  const debouncedOnChange = useMemo(() => debounce(onChange, 200), [onChange]);

  const onChangeWrapper = useCallback(
    (e) => {
      const value = e.target.value;
      setCachedValue(value);
      debouncedOnChange(value);
    },
    [setCachedValue, debouncedOnChange],
  );

  return (
    <TextField
      {...props}
      onChange={onChangeWrapper}
      value={cachedValue}
      variant="outlined"
    />
  );
};

DebouncedTextField.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string
};
