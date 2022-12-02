import React, { useContext } from 'react';

// ? context
import ClusterReportContext from 'views/ClusterReport/ClusterReportContext';

// ? Self-packed Components || Functions
import { LineChart } from 'components/BaseChart';
import SpeedBox from '../SpeedBox';

// ^ Plugins
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

/**
 * @author elvis
 * @level views/ClusterReport/User/UseRateOverview
 * @component UseRateOverview
 * @description UseRateOverview
*/
const UseRateOverview = ({ data }) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const { classes } = useContext(ClusterReportContext);

  return (
    <>
      <div className={`${classes.clusterReportLineChartBox}`}>
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
                  format: '{value:.2f} GB'
                }
              },
              tooltip: {
                useHTML:true,
                formatter() {
                  return `${moment(this.x).format('MM/DD HH:mm')} <br/>
                    ${this.series.name}: ${this.y.toFixed(0)} GB`
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
