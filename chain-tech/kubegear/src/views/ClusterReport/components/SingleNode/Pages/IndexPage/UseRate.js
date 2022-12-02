import React, { useContext } from 'react';

// ? context
import ClusterReportContext from 'views/ClusterReport/ClusterReportContext';

// ? Self-packed Components || Functions
import { LineChart } from 'components/BaseChart';
import SpeedBox from '../../../SpeedBox';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import moment from 'moment'

/**
 * @author odin
 * @level views/ClusterReport/SingleNode/SingleNodeTab/UseRate
 * @component UseRate
 * @description UseRate
*/
const UseRate = ({ data }) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const { classes } = useContext(ClusterReportContext);

  return (
    <>
      {
        data &&
        <>
          <div className={`${classes.clusterReportLineChartBox}`}>
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
                },
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
                    format: '{value:.2f} GB'
                  }
                }
              }}
            />
            {
              !isEmpty(data.gpu) &&
              <>
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
              </>
            }
          </div>
          <SpeedBox
            className={`${classes.pt_20}`}
            data={[data.diskRead, data.diskWritten]}
            dataName={[t('read'), t('written')]}
            title={t('disk')}
            unit={'MB/s'}
          />
          <SpeedBox
            className={`${classes.pt_20}`}
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

UseRate.propTypes = {
  data: PropTypes.object
};

export default UseRate;
