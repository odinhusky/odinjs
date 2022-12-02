import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.scss';
import { KB } from 'constant';

const Ram = ({ data = 0 }) => {
  return (
    <div className={styles.container}>
      <span />
      <span />
      <span />
      <span />
      <div className={styles.content}>
        <p>RAM</p>
        <p>
          <b>{(data / KB).toFixed(2)}</b>GB
        </p>
      </div>
    </div>
  );
};

Ram.propTypes = {
  data: PropTypes.number
};

export default Ram;