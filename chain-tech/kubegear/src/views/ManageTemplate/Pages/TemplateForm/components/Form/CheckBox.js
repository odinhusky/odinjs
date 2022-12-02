import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.scss';
import {
  DirectionalHint,
  TooltipHost,
  Icon
} from 'office-ui-fabric-react';
import { Checkbox as BaseCheckBox } from 'components/BaseInput';

const Checkbox = ({ title, hint, errorMessage, ...props }) => {
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
        <BaseCheckBox
          {...props}
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

Checkbox.propTypes = {
  title: PropTypes.string,
  hint: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  errorMessage: PropTypes.string
};

export default Checkbox;