import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { LineChart } from 'components/BaseChart';

import moment from 'moment';

import styles from './index.module.scss';

const ClusterOverview = ({ data }) => {
  const { t } = useTranslation();
  const [taskNet, setTaskNet] = useState([]);
  const [taskBlock, setTaskBlock] = useState([]);

  const Gbps = 1000000000;
  const Mbps = 1000000;
  const Kbps = 1000;

  const taskNetConcat = (taskNetIn, taskNetOut) => {
    const taskNetInWithI18n = taskNetIn.map(item => {
      item.name = `${t('download')}${t('speed')}-${item.name}`
      return item
    })
    const taskNetOutWithI18n = taskNetOut.map(item => {
      item.name = `${t('Upload')}${t('speed')}-${item.name}`
      return item
    })
    setTaskNet(taskNetInWithI18n.concat(taskNetOutWithI18n));
  }

  const taskBlockConcat = (taskBlockIn, taskBlockOut) => {
    const taskBlockInWithI18n = taskBlockIn.map(item => {
      item.name = `${t('written')}${t('speed')}-${item.name}`
      return item
    })
    const taskBlockOutWithI18n = taskBlockOut.map(item => {
      item.name = `${t('read')}${t('speed')}-${item.name}`
      return item
    })
    setTaskBlock(taskBlockInWithI18n.concat(taskBlockOutWithI18n))
  }

  useEffect(() => {
    const taskNetIn = data.taskNetIn !== undefined ? data.taskNetIn : [];
    const taskNetOut = data.taskNetOut !== undefined ? data.taskNetOut : [];
    if ( taskNetIn.length > 0 && taskNetOut.length > 0) {
      taskNetConcat(taskNetIn, taskNetOut)
    }

    const taskBlockIn = data.taskBlockIn !== undefined ? data.taskBlockIn : [];
    const taskBlockOut = data.taskBlockOut !== undefined ? data.taskBlockOut : [];
    if ( taskBlockIn.length > 0 && taskBlockOut.length > 0) {
      taskBlockConcat(taskBlockIn, taskBlockOut)
    }
  }, [data])

  return (
    <>
      {
        data !== {} &&
        <>
          <div className={styles.lineChartBox}>
            <LineChart
              options={{
                title: {
                  text: t('CPU')
                },
                series: data.cpu,
                legend: {
                  enabled: true
                }
              }}
            />
            <LineChart
              options={{
                title: {
                  text: t('memory')
                },
                series: data.taskMemoryTotal,
                legend: {
                  enabled: true
                },
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
            <LineChart
              options={{
                title: {
                  text: `${t('task')}${t('enSpace')}${t('network')}${t('enSpace')}${t('use')}`
                },
                series: taskNet,
                legend: {
                  enabled: true,
                  maxHeight: 100
                },
                tooltip: {
                  valueDecimals: 2,
                  useHTML: true,
                  formatter: function () {
                    return ['<b>' + moment(this.x).format('MM/DD HH:mm') + '</b>'].concat(
                      this.points ?
                        this.points.map(function (point) {
                          return `${point.series.name}: ${point.y.toFixed(2)}`;
                        }) : []
                    );
                  }
                },
                yAxis: {
                  opposite: false,
                  labels: {
                    formatter: function() {
                      if (this.value >= Gbps) {
                        return (this.value / Gbps) + ' gbps';
                      } else if (this.value >= Mbps) {
                        return (this.value / Mbps) + ' mbps';
                      } else if (this.value >= Kbps) {
                        return (this.value / Kbps) + ' kbps';
                      } else {
                        return (this.value) + ' bps';
                      }
                    }
                  }
                }
              }}
            />
            <LineChart
              options={{
                title: {
                  text: `${t('task')}${t('enSpace')}${t('disk')}${t('enSpace')}${t('use')}`
                },
                series: taskBlock,
                legend: {
                  enabled: true,
                  maxHeight: 100
                },
                yAxis: {
                  opposite: false,
                  labels: {
                    formatter: function() {
                      if (this.value >= Gbps) {
                        return (this.value / Gbps) + ' gbps';
                      } else if (this.value >= Mbps) {
                        return (this.value / Mbps) + ' mbps';
                      } else if (this.value >= Kbps) {
                        return (this.value / Kbps) + ' kbps';
                      } else {
                        return (this.value) + ' bps';
                      }
                    }
                  }
                }
              }}
            />
            {
              (data.gpu !== undefined && data.gpu.length > 0) &&
              <LineChart
                options={{
                  title: {
                    text: `${t('GPU')}`
                  },
                  series: data.gpu,
                  legend: {
                    enabled: true
                  }
                }}
              />
            }
            {
              (data.gpu !== undefined && data.gpuMemory.length > 0) &&
              <LineChart
                options={{
                  title: {
                    text: `${t('GPU')}${t('enSpace')}${t('memory')}`
                  },
                  series: data.gpuMemory,
                  legend: {
                    enabled: true
                  },
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
          {/* <SpeedBox
            className={mergeStyles({ paddingTop: 20 })}
            data={[data.networkReceive, data.networkTransmit]}
            dataName={[t('download'), t('Upload')]}
            title={t('network')}
            unit={'MB/s'}
          /> */}
        </>
      }
    </>
  );
};

ClusterOverview.propTypes = {
  data: PropTypes.object
};

export default ClusterOverview;
