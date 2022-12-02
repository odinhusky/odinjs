import React, { useContext } from 'react';

// ? context
import ClusterReportContext from 'views/ClusterReport/ClusterReportContext';

// ? Self-packed Components || Functions
import { PieChart } from 'components/BaseChart';

// ^ Plugins
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/ClusterReport/UserOverview
 * @component UserOverview
 * @description UserOverview content component
*/
const UserOverview = ({ data }) => {

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
              series: [{
                name: 'RAM',
                data: data.ramData
              }],
              chart: {
                type: 'pie',
                width: null,
                height: 'auto'
              }
            }}
          />
        </div>
      </>
      }
    </div>
  );
};

UserOverview.propTypes = {
  data: PropTypes.object
};

export default UserOverview;
