import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.module.scss';
import { KB } from 'constant';

const Shm = ({ data = 0 }) => {
  return (
    <div className={classnames(styles.container, styles.shm)}>
      <span />
      <span />
      <span />
      <div className={styles.content}>
        <p>SHM</p>
        <p>
          <b>{(data / KB).toFixed(2)}</b>GB
        </p>
      </div>
    </div>
  );
};

Shm.propTypes = {
  data: PropTypes.number
};

export default Shm;