import React, { useEffect, useState, useCallback, useMemo } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';
import { debounce } from 'lodash';

const useStyles = makeStyles(() => ({
  width100: {
    width: '100%'
  },
  height40: {
    '& > div': {
      height: 40
    }
  }
}))

export const DebouncedTextField = ({ onChange, value, ...props }) => {
  const classes = useStyles();
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
      className={`${classes.width100} ${classes.height40}`}
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
