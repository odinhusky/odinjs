import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { PieChart } from 'components/BaseChart';

import styles from './index.module.scss';

const JobOverview = ({ data }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.overviewContainer}>
      {
        data && data.cpuData &&
      <>
        <div>
          <p>{t('CPU')}</p>
          <PieChart
            options={{
              chart: {
                type: 'pie',
                width: null,
                height: 'auto'
              },
              series: [{
                name: 'CPU',
                data: data.cpuData
              }]
            }}
          />
        </div>
        <div>
          <p>{t('GPU')}</p>
          <PieChart
            options={{
              chart: {
                type: 'pie',
                width: null,
                height: 'auto'
              },
              series: [{
                name: 'GPU',
                data: data.gpuData
              }]
            }}
          />
        </div>
        <div>
          <p>{t('Memory')}</p>
          <PieChart
            options={{
              chart: {
                type: 'pie',
                width: null,
                height: 'auto'
              },
              series: [{
                name: 'RAM',
                data: data.ramData
              }]
            }}
          />
        </div>
      </>
      }
    </div>
  );
};

JobOverview.propTypes = {
  data: PropTypes.object
};

export default JobOverview;