import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.scss';

const Disk = ({ data }) => {
  return (
    <div className={styles.container}>
      <span />
      <span />
      <span />
      <span />
      <div className={styles.content}>
        <p>DISK</p>
        <p>
          <b>{data}</b>
          GB
        </p>
      </div>
    </div>
  );
};

Disk.propTypes = {
  data: PropTypes.number
};

export default Disk;