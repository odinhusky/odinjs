import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.scss';

// ? Utils
import { formatBytes } from 'utils';
import { MB } from 'constant';

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
          <b>{formatBytes(data * MB)}</b>
        </p>
      </div>
    </div>
  );
};

Ram.propTypes = {
  data: PropTypes.number
};

export default Ram;