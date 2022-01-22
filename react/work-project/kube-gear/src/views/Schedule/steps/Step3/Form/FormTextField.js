import React, {
  useState,
  useCallback,
  useEffect
} from 'react';

// ? Self-packed Components || Functions
import { BaseTextField } from 'components/BaseMuiInput';
import { debounce } from 'lodash';

// ? styles
import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles';

const useStyles = makeStyles((theme) => {
  return {
    ...commonStyle(theme)
  }
});

// ^ Plugins
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/Schedule/CreateSchedule/Step3/Form/FormTextField
 * @component FormTextField
 * @prop {string} className -- BaseTextField 的 className
 * @prop {string} value -- 文字輸入框的值
 * @prop {function} onChange -- 文字輸入框的 onChange 事件
 * @description Step3 From Component 中，經由排版包裝的 BaseTextFiled
*/
const FormTextField = ({
  onChange,
  value,
  className,
  ...textFieldProps
}) => {
  // = styles
  const classes = useStyles();

  // # states
  const [cachedValue, setCachedValue] = useState('');

  // * hooks
  useEffect(() => {
    setCachedValue(value)
  }, [value]);


  // - methods
  const debouncedOnChange = useCallback(debounce(onChange, 200), [onChange])

  const _onChange = useCallback((e) => {
    const value = e.target.value;
    setCachedValue(value);
    debouncedOnChange(value);
  }, [setCachedValue, debouncedOnChange])

  return (
    <BaseTextField
      className={`${classes.w_full} ${className}`}
      onChange={_onChange}
      value={cachedValue}
      {...textFieldProps}
    />
  );
};

FormTextField.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  containerClass: PropTypes.object,
  value: PropTypes.string
};

export default FormTextField;