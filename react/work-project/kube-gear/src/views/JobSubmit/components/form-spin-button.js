

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { BasicSection } from './basic-section';
import { debounce } from 'lodash';

export const FormSpinButton = ({
  sectionLabel,
  sectionOptional,
  sectionProps,
  onChange,
  value,
  ...props
}) => {
  const isTablet = useMediaQuery('(max-width: 1280px)');
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
    <BasicSection
      childrenGrid={isTablet ? 12 : 3}
      sectionLabel={sectionLabel}
      sectionOptional={sectionOptional}
      titleGrid={isTablet ? 12 : 3}
      titleOptions={isTablet ? { justify: 'flex-start' } : { justify: 'flex-end', alignItems: 'center' }}
      {...sectionProps}
    >
      <TextField
        onChange={_onChange}
        type="number"
        value={retryNum}
        variant="outlined"
        {...props}
      />
    </BasicSection>
  );
};

FormSpinButton.propTypes = {
  sectionLabel: PropTypes.string.isRequired,
  sectionOptional: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  sectionProps: PropTypes.object
};
