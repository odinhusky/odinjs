import React, { useContext } from 'react';

// ? context
import ClusterReportContext from 'views/ClusterReport/ClusterReportContext';

// ? Self-packed Components || Functions
import { PieChart } from 'components/BaseChart';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * @author elvis
 * @level views/ClusterReport/Cluster/ClusterOverview
 * @component ClusterOverview
 * @description ClusterOverview
*/
const ClusterOverview = ({ data }) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const { classes } = useContext(ClusterReportContext);

  return (
    <div className={`${classes.clusterReportOverViewContainer}`}>
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
