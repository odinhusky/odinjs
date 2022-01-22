import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { LineChart } from 'components/BaseChart';

import moment from 'moment'

import styles from './index.module.scss';
import SpeedBox from '../SpeedBox';
import { mergeStyles } from 'office-ui-fabric-react';

const ClusterOverview = ({ data }) => {
  const { t } = useTranslation();
  return (
    <>
      {
        data &&
        <>
          <div className={styles.lineChartBox}>
            <LineChart
              options={{
                title: {
                  text: t('CPU')
                },
                series: [{
                  name: 'CPU',
                  data: data.cpu
                }]
              }}
            />
            <LineChart
              options={{
                title: {
                  text: t('Memory')
                },
                series: [
                  {
                    name: t('total2'),
                    data: data.memoryTotal
                  },
                  {
                    name: t('used'),
                    data: data.memoryUsed
                  },
                  {
                    name: 'Buffer',
                    data: data.memoryBuffer
                  }
                ],
                tooltip: {
                  valueDecimals: 2,
                  valueSuffix: '%',
                  useHTML: true,
                  formatter: function () {
                    // The first returned item is the header, subsequent items are the
                    // points
                    return ['<b>' + moment(this.x).format('MM/DD HH:mm') + '</b>'].concat(
                      this.points ?
                        this.points.map(function (point) {
                          return `${point.series.name}: ${point.y.toFixed(2)} GB`;
                        }) : []
                    );
                  }
                },
                yAxis: {
                  opposite: false,
                  labels: {
                    format: '{value} GB'
                  }
                }
              }}
            />
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
                ],
                yAxis: {
                  opposite: false,
                  labels: {
                    format: '{value:.2f} %'
                  }
                }
              }}
            />
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
          </div>
          <SpeedBox
            className={mergeStyles({ paddingTop: 20 })}
            data={[data.diskRead, data.diskWritten]}
            dataName={[t('read'), t('written')]}
            title={t('disk')}
            unit={'MB/s'}
          />
          <SpeedBox
            className={mergeStyles({ paddingTop: 20 })}
            data={[data.networkReceive, data.networkTransmit]}
            dataName={[t('download'), t('Upload')]}
            title={t('network')}
            unit={'MB/s'}
          />
        </>
      }
    </>
  );
};

ClusterOverview.propTypes = {
  data: PropTypes.object
};

export default ClusterOverview;
