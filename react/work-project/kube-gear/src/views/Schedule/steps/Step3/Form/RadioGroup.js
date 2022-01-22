import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.scss';
import {
  DirectionalHint,
  TooltipHost,
  Icon
} from 'office-ui-fabric-react';
import { ChoiceGroup  } from 'components/BaseInput';

const RadioGroup = ({ title, hint, options, ...props })  => {
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
      <ChoiceGroup
        {...props}
        className={styles.radioGroup}
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
            display: 'flex',
            justifyContent: 'space-between'
          }
        }}
      />
    </div>
  );
};

RadioGroup.propTypes = {
  title: PropTypes.string,
  hint: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  options: PropTypes.array
};

export default RadioGroup;