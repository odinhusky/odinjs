import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { LineChart } from 'components/BaseChart';

import styles from './index.module.scss';
import SpeedBox from '../SpeedBox';

import { isEmpty } from 'lodash';
import moment from 'moment';

const UseRateOverview = ({ data }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className={styles.lineChartBox}>
        {
          data.cpu &&
          <LineChart
            options={{
              title: {
                text: t('CPU')
              },
              series: [{
                name: 'CPU',
                data: data.cpu,
                showInLegend: true
              }],
              legend: {
                enable: true
              }
            }}
          />
        }
        {
          data.cpuMemory &&
          <LineChart
            options={{
              title: {
                text: t('Memory')
              },
              series: [
                {
                  name: t('memory'),
                  data: data.cpuMemory
                }
              ],
              legend: {
                enable: true
              },
              yAxis: {
                opposite: false,
                labels: {
                  format: '{value} MB'
                }
              },
              tooltip: {
                useHTML:true,
                formatter() {
                  return `${moment(this.x).format('MM/DD HH:mm')} <br/>
                    ${this.series.name}: ${this.y.toFixed(0)} MB`
                },
                split: false
              }
            }}
          />
        }
        {
          data.gpu &&
          <LineChart
            options={{
              title: {
                text: `${t('GPU')}`
              },
              series: [
                {
                  name: `${t('GPU')}`,
                  data: data.gpu
                }
              ]
            }}
          />
        }
        {
          data.gpuMemory &&
          <LineChart
            options={{
              title: {
                text: `${t('GPU')}${t('enSpace')}${t('memory')}`
              },
              series: [
                {
                  name: `${t('GPU')}${t('enSpace')}${t('memory')}`,
                  data: data.gpuMemory
                }
              ],
              yAxis: {
                opposite: false,
                labels: {
                  format: '{value:.2f} %'
                }
              }
            }}
          />
        }
      </div>
      {
        (!isEmpty(data.diskOut) || !isEmpty(data.diskIn)) &&
        <SpeedBox
          data={[data.diskOut, data.diskIn]}
          dataName={[t('read'), t('written')]}
          title={t('disk')}
          unit={'MB/s'}
        />
      }
      {
        (!isEmpty(data.networkIn) || !isEmpty(data.networkOut)) &&
        <SpeedBox
          data={[data.networkIn, data.networkOut]}
          dataName={[t('download'), t('Upload')]}
          title={t('network')}
          unit={'MB/s'}
        />
      }
    </>
  );
};

UseRateOverview.propTypes = {
  data: PropTypes.object
};

export default UseRateOverview;
