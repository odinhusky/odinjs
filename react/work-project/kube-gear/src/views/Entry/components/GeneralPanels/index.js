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
import RunningJobs from '../RunningJobs'
import UploadFiles from '../UploadFiles'
import QuickStart from '../QuickStart'
import ClusterStatus from '../ClusterStatus'

// ^ Plugins
// import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/Entry
 * @component Entry
 * @description Entry page
*/
const GeneralPanels = () => {

  // % context
  const { classes } = useContext(EntryContext);

  return (
    <>
      {/* 左半部 */}
      <section className={classes.entryContentGeneralLeft}>
        {/* Layer 1 */}
        <div className={`${classes.d_flex} ${classes.leftLayer1} ${classes.generalCtrlLayer1}`}>
          {/* 進行中的作業 */}
          <RunningJobs />

          {/* 上傳文件 */}
          <UploadFiles />

        </div>

        {/* Layer 2 */}
        <div className={`${classes.d_flex} ${classes.leftLayer2} ${classes.generalCtrlLayer2}`}>
          <QuickStart />
        </div>
      </section>

      {/* 右半部 */}
      <section className={classes.entryContentGeneralRight}>
        {/* 集群狀態 */}
        <ClusterStatus />
      </section>
    </>
  );
};

export default GeneralPanels;

GeneralPanels.propTypes = {
  // history: PropTypes.object.isRequired
}
