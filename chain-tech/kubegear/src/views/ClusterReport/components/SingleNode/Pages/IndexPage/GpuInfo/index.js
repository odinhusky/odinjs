import React, { useContext } from 'react';

// ? context
import ClusterReportContext from 'views/ClusterReport/ClusterReportContext';

// ? Self-packed Components || Functions
import { LineChart } from 'components/BaseChart';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/ClusterReport/SingleNode/SingleNodeTab/GpuInfo
 * @component GpuInfo
 * @description GpuInfo
*/
const GpuInfo = ({ data, gpuCount }) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const { classes } = useContext(ClusterReportContext);

  return (
    <>
      {
        (gpuCount !== 0) && (
          <div
            className={`${classes.clusterReportLineGpuInfo}`}
          >
            {t('GPU')} {gpuCount}
          </div>
        )
      }
      {
        data && data.map((item, index) => (
          <div
            className={`${classes.clusterReportLineChartBox}`}
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
                }],
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
