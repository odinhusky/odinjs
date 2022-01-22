import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.scss';
import {
  DirectionalHint,
  TooltipHost,
  Icon
} from 'office-ui-fabric-react';
import { Dropdown as BaseDropdown } from 'components/BaseInput';

const Dropdown = ({ title, hint, ...props }) => {
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
      <BaseDropdown
        className={styles.select}
        {...props}
      />
    </div>
  );
};

Dropdown.propTypes = {
  title: PropTypes.string,
  hint: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ])
};

export default Dropdown;