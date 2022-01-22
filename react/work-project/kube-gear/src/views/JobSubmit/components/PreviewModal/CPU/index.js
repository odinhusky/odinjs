import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.scss';

const CPU = ({ data }) => {
  return (
    <div className={styles.container}>
      <span className={styles.vertical} />
      <span className={styles.vertical} />
      <span className={styles.vertical} />
      <span className={styles.vertical} />
      <span className={styles.vertical} />
      <span className={styles.vertical} />
      <span className={styles.vertical} />
      <span className={styles.vertical} />
      <span className={styles.vertical} />
      <span className={styles.vertical} />
      <span className={styles.horizontal} />
      <span className={styles.horizontal} />
      <span className={styles.horizontal} />
      <span className={styles.horizontal} />
      <span className={styles.horizontal} />
      <span className={styles.horizontal} />
      <span className={styles.horizontal} />
      <span className={styles.horizontal} />
      <span className={styles.horizontal} />
      <span className={styles.horizontal} />
      <div className={styles.content}>
        <div className={styles.cpu}>
          <p>CPU</p>
          <p>
            <b>{data}</b>
            Cores
          </p>
        </div>
      </div>
    </div>
  );
};

CPU.propTypes = {
  data: PropTypes.number
};

export default CPU;