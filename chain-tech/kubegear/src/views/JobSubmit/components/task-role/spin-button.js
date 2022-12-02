

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { debounce } from 'lodash';

export const SpinButton = ({ onChange, value, ...props }) => {
  const [retryNum, setRetryNum] = useState(0);

  const debouncedOnChange = useMemo(() => debounce(onChange, 200), [onChange]);

  const _onChange = useCallback(e => {
    const value = e.target.value
    if (onChange !== undefined) {
      setRetryNum(value)
      debouncedOnChange(Number(value));
    }
  }, [onChange]);

  useEffect(() => setRetryNum(value), [value])

  return (
    <TextField
      onChange={_onChange}
      type="number"
      value={retryNum}
      variant="outlined"
      {...props}
    />
  );
};

SpinButton.propTypes = {
  sectionOptional: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
