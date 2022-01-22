import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import styles from './index.module.scss';
import { percentColors } from 'constant';
import { GB } from 'constant';

const StorageChart = ({ info }) => {
  const { t } = useTranslation();
  let max = 0;
  let used = 0;

  if (info.storage) {
    const { total, free } = info.storage;

    max = total / GB;
    used = (total - free) / GB;
  }

  const computeColor = (num) => {
    if (num < 0.6) return percentColors[0]
    if (num < 0.8) return percentColors[1]
    return percentColors[2]
  }

  return (
    <div className={styles.container}>
      <p className={styles.title}>{t('storage')}</p>
      <div className={styles.chart}>
        <span style={{ borderColor: computeColor(used / max), transform: `rotate(${used / max * 180}deg)` }} />
        <b>{used.toFixed(0)}GB</b>
      </div>
      <div className={styles.range}>
        <p className={styles.min}>0</p>
        <p className={styles.max}>{max.toFixed(0)}</p>
      </div>
    </div>
  );
};

StorageChart.propTypes = {
  info: PropTypes.object
}

export default StorageChart;