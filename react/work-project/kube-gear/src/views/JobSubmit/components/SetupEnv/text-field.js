import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { BasicSection } from '../basic-section';
// import { FormShortSection } from '../form-page';
import { DebouncedTextField } from '../controls/debounced-text-field';

export const SetupEnvTextField = React.memo(props => {
  const { sectionLabel, onChange, sectionOptional, sectionTooltip, value } = props;

  const onChangeWrapper = useCallback(
    (value) => {
      onChange(value);
    },
    [onChange],
  );

  const textField = (
    <DebouncedTextField
      {...props}
      onChange={onChangeWrapper}
      value={value}
    />
  );

  return (
    <BasicSection
      optional={sectionOptional}
      sectionLabel={sectionLabel}
      sectionTooltip={sectionTooltip}
    >
      {textField}
    </BasicSection>
  );
});

SetupEnvTextField.propTypes = {
  sectionLabel: PropTypes.string.isRequired,
  sectionTooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  onChange: PropTypes.func,
  value: PropTypes.string,
  sectionOptional: PropTypes.bool
};
