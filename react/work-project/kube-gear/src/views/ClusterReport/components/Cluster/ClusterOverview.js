import React from 'react';
import PropTypes from 'prop-types';
import { PieChart } from 'components/BaseChart';
import { useTranslation } from 'react-i18next';

import styles from './index.module.scss'

const ClusterOverview = ({ data }) => {
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
              series: [{
                name: 'CPU',
                data: data.cpuData
              }],
              chart: {
                type: 'pie'
              }
            }}
          />
        </div>
        <div>
          <p>{t('GPU')}</p>
          <PieChart
            options={{
              series: [{
                name: 'GPU',
                data: data.gpuData
              }],
              chart: {
                type: 'pie'
              }
            }}
          />
        </div>
        <div>
          <p>{t('Memory')}</p>
          <PieChart
            options={{
              series: [{
                name: 'RAM',
                data: data.ramData
              }],
              chart: {
                type: 'pie'
              }
            }}
          />
        </div>
      </>
      }
    </div>
  );
};

ClusterOverview.propTypes = {
  data: PropTypes.object
};

export default ClusterOverview;
