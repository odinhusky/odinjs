import React, {
  useEffect,
  useState,
  useCallback,
  useMemo
} from 'react';

// ^ Material-ui Componets(Functions)
import TextField from '@material-ui/core/TextField';

// ? Self-packed Components || Functions
import { countRestrictRange } from 'common/commonMethods'

// % style
import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles'

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme)
}))

// ^ Plugins
import { debounce } from 'lodash';
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level any/DebounceRestrictRangeNumberInput
 * @prop {Function} onChange -- onChange event
 * @prop {number || string} value -- This Number input binding input data
 * @prop {object} textInputProps -- Textinput related props
 * @prop {string} classNameProps -- Textinput className
 * @prop {number} min -- Restricted min number, default 1
 * @prop {number} max -- Restricted max number
 * @component DebounceRestrictRangeNumberInput
 * @description Debounce Number input can be restricted in range from ${min} to ${max}
*/
export const DebounceRestrictRangeNumberInput = ({
  onChange,
  value,
  textInputProps,
  classNameProps,
  min = 1,
  max = 9007199254740991
}) => {
  // = styles
  const classes = useStyles();

  // # states
  const [cachedValue, setCachedValue] = useState('');

  // * hook
  useEffect(() =>{
    setCachedValue(value)
  }, [value]);

  const debouncedOnChange = useMemo(() => debounce(onChange, 200), [onChange]);

  const onChangeWrapper = useCallback(
    (e) => {
      const valueNum = +e.target.value

      const restrictedValue = countRestrictRange(min, max, valueNum)

      setCachedValue(restrictedValue);
      debouncedOnChange(restrictedValue);

    },
    [setCachedValue, debouncedOnChange],
  );

  return (
    <TextField
      className={`${classes.w_full} ${classNameProps}`}
      type="number"
      {...textInputProps}
      onChange={onChangeWrapper}
      value={cachedValue}
      variant="outlined"
    />
  );
};

DebounceRestrictRangeNumberInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  textInputProps: PropTypes.object,
  classNameProps: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number
};

export default DebounceRestrictRangeNumberInput
