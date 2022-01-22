import React, { useCallback }  from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.scss';
import {
  DirectionalHint,
  TooltipHost,
  Icon
} from 'office-ui-fabric-react';
import { SpinButton as BaseSpinButton } from 'office-ui-fabric-react';
import { debounce, isNil } from 'lodash';

const SpinButton = ({ title, hint, fieldError, onChange, onIncrement, onDecrement, onValidate, min, max, errorMessage, ...props }) => {
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
    <div className={styles.container}>
      <div className={styles.title}>
        <label>{title}</label>
        {
          hint &&
          <TooltipHost
            calloutProps={{
              isBeakVisible: false,
              directionalHint: DirectionalHint.topAutoEdge,
              gapSpace: 8
            }}
            content={hint}
            tooltipProps={React.isValidElement(hint) ? {
              onRenderContent: () => hint
            } : {}}
          >
            <Icon
              iconName="Info"
              styles={{ root: { verticalAlign: 'middle', cursor: 'pointer', margin: '0 5px' } }}
            />
          </TooltipHost>
        }
      </div>
      <div>
        <BaseSpinButton
          {...props}
          min={0}
          onDecrement={debounce(_onDecrement, 10)}
          onIncrement={debounce(_onIncrement, 10)}
          onValidate={debounce(_onValidate, 10)}
          step={1}
          styles={{
            root: { border: fieldError ? 'rgb(168,0,0) 1px solid' : '', borderRadius: 3, width: '100%' },
            spinButtonWrapper: { borderRadius: 3, paddingRight: 10, border: fieldError ? 'none' : '1px solid #A19F9D' }
          }}
        />
        {
          errorMessage &&
          <span style={{ fontSize: 12, color: 'rgb(168, 0, 0)' }}>
            {errorMessage}
          </span>
        }
      </div>
    </div>
  );
};

SpinButton.propTypes = {
  title: PropTypes.string,
  hint: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
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

export default SpinButton;