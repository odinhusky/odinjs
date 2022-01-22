import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { mergeStyles } from 'office-ui-fabric-react';

import { LineChart } from 'components/BaseChart';
import SpeedBox from '../../../../components/SpeedBox';

import styles from './index.module.scss';
import { isEmpty } from 'lodash';

const Job = ({ data }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.lineChartBox}>
      {
        data.cpu &&
        <LineChart
          options={{
            title: {
              text: t('CPU')
            },
            series: [{
              name: t('CPU'),
              data: data.cpu
            }]
          }}
        />
      }
      {
        data.memory &&
        <LineChart
          options={{
            title: {
              text: t('Memory')
            },
            series: [{
              name: t('memory'),
              data: data.memory
            }],
            tooltip: {
              valueDecimals: 2,
              useHTML: true,
              formatter: function () {
                // The first returned item is the header, subsequent items are the
                // points
                return ['<b>' + moment(this.x).format('MM/DD HH:mm') + '</b>'].concat(
                  this.points ?
                    this.points.map(function (point) {
                      return `${point.series.name}: ${point.y.toFixed(2)} MB`;
                    }) : []
                );
              }
            },
            yAxis: {
              opposite: false,
              labels: {
                format: '{value} MB'
              }
            }
          }}
        />
      }
      {
        data.gpu &&
        <>
          <LineChart
            options={{
              title: {
                text: t('GPU')
              },
              series: [{
                name: t('GPU'),
                data: data.gpu
              }]
            }}
          />
          <LineChart
            options={{
              title: {
                text: `${t('GPU')}${t('enSpace')}${t('memory')}`
              },
              series: [{
                name: `${t('GPU')}${t('enSpace')}${t('memory')}`,
                data: data.gpuMemory
              }],
              yAxis: {
                opposite: false,
                labels: {
                  formatter() {
                    return this.value.toFixed(0) + '%'
                  }
                }
              }
            }}
          />
        </>
      }
      <SpeedBox
        className={mergeStyles({ paddingTop: 20 })}
        data={[data.networkIn, data.networkOut]}
        dataName={[t('download'), t('Upload')]}
        title={t('network')}
        unit={'MB/s'}
      />
      <SpeedBox
        className={mergeStyles({ paddingTop: 20 })}
        data={[data.diskIn, data.diskOut]}
        dataName={[t('read'), t('written')]}
        title={t('disk')}
        unit={'MB/s'}
      />
      {
        !isEmpty(data.taskGPU) &&
        <>
          <LineChart
            options={{
              title: {
                text: t('everyTaskGPUUseRate')
              },
              series: data.taskGPU && data.taskGPU.map(task => ({
                name: `${t('GPU')} ${task.minorNumber} by ${task.roleName}-${task.taskIndex}`,
                data: task.value
              })),
              tooltip: {
                valueDecimals: 2,
                useHTML: true,
                formatter: function () {
                  return ['<b>' + moment(this.x).format('MM/DD HH:mm') + '</b>'].concat(
                    this.points ?
                      this.points.map(function (point) {
                        return `${point.series.name}: ${point.y.toFixed(2)} %`;
                      }) : []
                  );
                }
              }
            }}
          />
          <LineChart
            options={{
              title: {
                text: t('everyTaskGPUMemoryUsed')
              },
              series: data.taskGPU && data.taskGPU.map(task => ({
                name: `${t('GPU')} ${task.minorNumber} by ${task.roleName}-${task.taskIndex}`,
                data: task.value
              })),
              tooltip: {
                valueDecimals: 2,
                useHTML: true,
                formatter: function () {
                  return ['<b>' + moment(this.x).format('MM/DD HH:mm') + '</b>'].concat(
                    this.points ?
                      this.points.map(function (point) {
                        return `${point.series.name}: ${point.y.toFixed(2)} %`;
                      }) : []
                  );
                }
              }
            }}
          />
        </>
      }
    </div>
  );
};

Job.propTypes = {
  data: PropTypes.object
};

export default Job;
