import React, {
  // useState,
  // useEffect,
  useContext
} from 'react';

// # API

// ? context
import EntryContext from '../../EntryContext';

// ^ Material-ui Componets(Functions)

// ? Self-packed Components || Functions
import WeeklyUtilRate from '../WeeklyUtilRate'
import OnlineNum from '../OnlineNum'
import JobStatus from '../JobStatus'
import WeeklyUtilHour from '../WeeklyUtilHour'
import ClusterStatus from '../ClusterStatus'

/**
 * @author odin
 * @level views/Entry
 * @component Entry
 * @description Entry page
*/
const AdminPanels = () => {

  // % context
  const {
    classes
  } = useContext(EntryContext);

  return (
    <>
      {/* 左半部 */}
      <section className={classes.entryContentLeft}>
        {/* Layer 1 */}
        <div className={`${classes.d_flex} ${classes.leftLayer1}`}>
          {/* 本週使用率概況 */}
          <WeeklyUtilRate />

          {/* 在線人數 */}
          <OnlineNum />
        </div>

        {/* Layer 2 */}
        <div className={`${classes.d_flex} ${classes.leftLayer2}`}>
          {/* 作業狀態 */}
          <JobStatus />

          {/* 本週使用時長 */}
          <WeeklyUtilHour />
        </div>
      </section>

      {/* 右半部 */}
      <section className={classes.entryContentRight}>
        {/* 集群狀態 */}
        <ClusterStatus />
      </section>
    </>
  );
};

export default AdminPanels;

AdminPanels.propTypes = {
  // jobStatusList: PropTypes.array.isRequired
  // jobList: PropTypes.array.isRequired
}
