import React, { useContext } from 'react';

// ? context
import HardwareContext from 'views/Hardware/HardwareContext';

// ? Self-packed Components || Functions
import { formatBytes } from 'utils';
import { percentColors } from 'constant';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/Hardware/ImagePage/StorageChart
 * @component StorageChart
 * @description StorageChart
*/
const StorageChart = ({ info }) => {

  // $ init data
  const { t } = useTranslation();
  const { size, available, used } = info;

  // ? context
  const { classes } = useContext(HardwareContext);

  // - methods
  const computeColor = (num) => {
    if (num < 0.6) return percentColors[0]
    if (num < 0.8) return percentColors[1]
    return percentColors[2]
  }

  return (
    <div className={`${classes.hardWareStorageChartChart}`}>
      <p className={`${classes.hardWareStorageChartTitle}`}>{t('storage')}</p>
      <div className={`${classes.hardWareStorageChartChart}`}>
        <span style={{ borderColor: computeColor(used / size), transform: `rotate(${used / size * 180}deg)` }} />
        <b>{formatBytes(available * 1024, 0)}</b>
      </div>
      <div className={`${classes.hardWareStorageChartRange}`}>
        <p className={`${classes.mb_0}`}>0</p>
        <p className={`${classes.mb_0}`}>{formatBytes(size * 1024, 0)}</p>
      </div>
    </div>
  );
};

StorageChart.propTypes = {
  info: PropTypes.object
}

export default StorageChart;