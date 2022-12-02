import React, { useContext } from 'react';

// ? context
import ClusterReportContext from 'views/ClusterReport/ClusterReportContext';

// ? Self-packed Components || Functions
import { PieChart } from 'components/BaseChart';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/ClusterReport/Job/JobOverview
 * @component JobOverview
 * @description JobOverview
*/
const JobOverview = ({ data }) => {

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