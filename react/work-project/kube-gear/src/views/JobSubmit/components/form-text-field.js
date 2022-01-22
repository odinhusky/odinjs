import React, { useCallback } from 'react';

// ? Self-packed Components || Functions
import { BasicSection } from './basic-section';
import { DebouncedTextField } from './controls/debounced-text-field';

// import { FormShortSection } from './form-page';
// import { isEmpty } from 'lodash';

// const TEXT_FILED_REGX = /^[A-Za-z0-9\-._~]+$/;

// ^ Plugins
import PropTypes from 'prop-types';


export const FormTextField = React.memo(props => {
  const { sectionLabel, onChange, sectionOptional, sectionTooltip, value, classNameObj, breakpoint } = props;

  // const _onGetErrorMessage = value => {
  //   const match = TEXT_FILED_REGX.exec(value);
  //   if (isEmpty(match)) {
  //     return '输入错误';
  //   }
  //   return '';
  // };

  const onChangeWrapper = useCallback(
    (value) => {
      onChange(value);
    },
    [onChange],
  );

  return (
    <BasicSection
      childrenGrid={breakpoint ? 12 : 3}
      classNameObj={classNameObj}
      optional={sectionOptional}
      sectionLabel={sectionLabel}
      sectionTooltip={sectionTooltip}
      titleGrid={breakpoint ? 12 : 3}
      titleOptions={breakpoint ? { justify: 'flex-start' } : { justify: 'flex-end', alignItems: 'center' }}
    >
      <DebouncedTextField
        {...props}
        onChange={onChangeWrapper}
        // onGetErrorMessage={_onGetErrorMessage}
        value={value}
      />
    </BasicSection>
  );
});

FormTextField.propTypes = {
  sectionLabel: PropTypes.string.isRequired,
  sectionTooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  onChange: PropTypes.func,
  value: PropTypes.string,
  sectionOptional: PropTypes.bool,
  classNameObj: PropTypes.object,
  breakpoint: PropTypes.bool
};
