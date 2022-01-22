import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { LineChart } from 'components/BaseChart';

import styles from './index.module.scss';

const GpuInfo = ({ data, gpuCount }) => {
  const { t } = useTranslation();
  return (
    <>
      {
        (gpuCount !== 0) && (
          <div
            className={styles.lineGpuInfo}
          >
            {t('GPU')} {gpuCount}
          </div>
        )
      }
      {
        data && data.map((item, index) => (
          <div
            className={styles.lineChartBox}
            key={index}
          >
            <LineChart
              options={{
                title: {
                  text: `${t('GPU')}${t('enSpace')}${t('Utilization')} ${index}`
                },
                series: [{
                  name: `${t('GPU')}${t('enSpace')}${t('Utilization')}`,
                  data: item.gpu
                }]
              }}
            />
            <LineChart
              options={{
                title: {
                  text: `${t('GPU')}${t('enSpace')}${t('memory')}${t('enSpace')}${t('Utilization')} ${index}`
                },
                series: [{
                  name: `${t('GPU')}${t('enSpace')}${t('memory')}${t('enSpace')}${t('Utilization')}`,
                  data: item.memory
                }],
                yAxis: {
                  opposite: false,
                  labels: {
                    format: '{value:.2f} %'
                  }
                }
              }}
            />
          </div>
        ))
      }
    </>
  );
};

GpuInfo.propTypes = {
  data: PropTypes.array,
  gpuCount: PropTypes.string
};

export default GpuInfo;
