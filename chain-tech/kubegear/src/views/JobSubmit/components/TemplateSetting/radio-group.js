import React from 'react';
import PropTypes from 'prop-types';
import { BasicSection } from '../basic-section';
// import { FormShortSection } from '../form-page';
import { ChoiceGroup  } from 'components/BaseInput';

const RadioGroup = ({ options, ...props })  => {
  const { sectionLabel, sectionOptional, sectionTooltip } = props;

  const textField = (
    <ChoiceGroup
      {...props}
      onRender
      options={options.map(opt => ({
        styles: {
          root: {
            marginRight: 15
          },
          labelWrapper: {
            fontWeight: 'normal'
          }
        },
        ...opt
      }))}
      styles={{
        flexContainer: {
          width: '210px',
          display: 'flex',
          justifyContent: 'space-between'
        },
        root: {
          selectors: {
            '& .ms-ChoiceField-field': {
              fontWeight: '400'
            }
          }
        }
      }}
    />
  )

  return (
    <>
      <BasicSection
        optional={sectionOptional}
        sectionLabel={sectionLabel}
        sectionTooltip={sectionTooltip}
      >
        {textField}
      </BasicSection>
    </>
  );
};

RadioGroup.propTypes = {
  title: PropTypes.string,
  hint: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  options: PropTypes.array,
  sectionLabel: PropTypes.string.isRequired,
  sectionTooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  sectionOptional: PropTypes.bool
};

export default RadioGroup;