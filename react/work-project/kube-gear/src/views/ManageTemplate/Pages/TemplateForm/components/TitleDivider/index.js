import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.scss';
import TooltipIcon from '../TooltipIcon';

const TitleDivider = ({ title, hint }) => {
  return (
    <div className={styles.divider}>
      <p className={styles.title}>{title}</p>
      {
        hint &&
        <TooltipIcon content={hint} />
      }
      <span />
    </div>
  );
};

TitleDivider.propTypes = {
  title: PropTypes.string,
  hint: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string
  ])
};

export default TitleDivider;