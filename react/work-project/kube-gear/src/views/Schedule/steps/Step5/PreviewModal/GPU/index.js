import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.scss';

const GPU = ({ data = {} }) => {
  return (
    <div className={styles.container}>
      <span />
      <span />
      <span />
      <span />
      <div className={styles.content}>
        <p>GPU</p>
        <p>{data.num ? data.num : 0}</p>
        <sub>{data.type ? data.type : ''}</sub>
      </div>
    </div>
  );
};

GPU.propTypes = {
  data: PropTypes.object
};

export default GPU;