import React, { useCallback } from 'react';
import { SpinButton, Stack } from 'office-ui-fabric-react';
import PropTypes from 'prop-types';
import { debounce, isNil } from 'lodash';
import { TooltipIcon } from '../controls/tooltip-icon';

export const CSpinButton = props => {
  const { fieldError, onChange, onIncrement, onDecrement, onValidate, min, max, label, tooltip, errorMessage } = props;

  const _onChange = useCallback((value, operateFunc, defaultReturnValue) => {
    let newValue = defaultReturnValue;
    if (!isNil(min)) {
      newValue = Math.max(min, newValue);
    }
    if (!isNil(max)) {
      newValue = Math.min(max, newValue);
    }
    if (operateFunc !== undefined) {
      newValue = operateFunc(value);
    }
    if (onChange === undefined) {
      return newValue;
    }
    return onChange(newValue);
  }, [onChange]);

  const _onIncrement = value => _onChange(value, onIncrement, +value + 1);
  const _onDecrement = value => _onChange(value, onDecrement, +value - 1);
  const _onValidate = value => _onChange(value, onValidate, value);

  return (
    <Stack
      gap="s1"
      horizontal
      verticalAlign="baseline"
    >
      {label && (
        <div style={{ display: 'flex', whiteSpace: 'nowrap' }}>{label}</div>
      )}
      {tooltip && (
        <TooltipIcon content={tooltip} />
      )}
      <div>
        <SpinButton
          {...props}
          focus
          label={null}
          onDecrement={debounce(_onDecrement)}
          onIncrement={debounce(_onIncrement)}
          onValidate={debounce(_onValidate)}
          styles={{ root: { border: fieldError ? 'rgb(168,0,0) 1px solid' : '', borderRadius: 3 }, spinButtonWrapper: { borderRadius: 3, paddingRight: 10, border: fieldError ? 'none' : '1px solid' } }}
        />
        {
          errorMessage &&
          <span style={{ fontSize: 12, color: 'rgb(168, 0, 0)' }}>
            {errorMessage}
          </span>
        }
      </div>
    </Stack>
  );
};

CSpinButton.defaultProps = {
  min: 0
};

CSpinButton.propTypes = {
  label: PropTypes.string,
  tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  min: PropTypes.number,
  max: PropTypes.number,
  fieldError: PropTypes.string,
  onChange: PropTypes.func,
  onIncrement: PropTypes.func,
  onDecrement: PropTypes.func,
  onValidate: PropTypes.func,
  className: PropTypes.string,
  errorMessage: PropTypes.string
};
