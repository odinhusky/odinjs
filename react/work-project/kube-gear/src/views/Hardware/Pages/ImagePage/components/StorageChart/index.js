import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import styles from './index.module.scss';
import { formatBytes } from 'utils';
import { percentColors } from 'constant';

const StorageChart = ({ info }) => {
  const { t } = useTranslation();
  const { size, available, used } = info;

  const computeColor = (num) => {
    if (num < 0.6) return percentColors[0]
    if (num < 0.8) return percentColors[1]
    return percentColors[2]
  }

  return (
    <div className={styles.container}>
      <p className={styles.title}>{t('storage')}</p>
      <div className={styles.chart}>
        <span style={{ borderColor: computeColor(used / size), transform: `rotate(${used / size * 180}deg)` }} />
        <b>{formatBytes(available * 1024, 0)}</b>
      </div>
      <div className={styles.range}>
        <p className={styles.min}>0</p>
        <p className={styles.max}>{formatBytes(size * 1024, 0)}</p>
      </div>
    </div>
  );
};

StorageChart.propTypes = {
  info: PropTypes.object
}

export default StorageChart;