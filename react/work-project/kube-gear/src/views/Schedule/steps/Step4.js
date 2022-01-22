import React, {
  // useEffect,
  useContext
} from 'react';

// % context
// import GlobalContext from 'layouts/Main/GlobalContext';
import ScheduleContext from '../ScheduleContext';

// ? Self-packed Components || Functions
import StorageSetting from './Step4/StorageSetting';
import Parameter from './Step4/Parameter';

// ^ Plugins
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/Schedule/{CreateSchedule | EditSchedule}/Step4
 * @component Step4
 * @description Step4 Component
*/
export const Step4 = ({
  setErrorMessage,
  nfsInfo,
  glusterfsInfo,
  nfsMounts,
  setNfsMountsState,
  setGlusterfsMountsState,
  glusterfsMounts,
  parameters,
  setParameters,
  xdfsInfo,
  xdfsMounts,
  setXdfsMountsState
}) => {

  // = styles
  const { classes } = useContext(ScheduleContext);

  // * hooks

  return (
    <div className={`${classes.stepsContainer} ${classes.contentContainer}`}>

      {/* 集中式存儲 | 分散式存儲 */}
      <StorageSetting
        glusterfsInfo={glusterfsInfo}
        glusterfsMounts={glusterfsMounts}
        nfsInfo={nfsInfo}
        nfsMounts={nfsMounts}
        setErrorMessage={setErrorMessage}
        setGlusterfsMountsState={setGlusterfsMountsState}
        setNfsMountsState={setNfsMountsState}
        setXdfsMountsState={setXdfsMountsState}
        xdfsInfo={xdfsInfo}
        xdfsMounts={xdfsMounts}
      />

      {/* 關鍵字 */}
      <Parameter
        parameters={parameters}
        setErrorMessage={setErrorMessage}
        setParameters={setParameters}
      />
    </div>
  )
}

Step4.propTypes = {
  nfsInfo: PropTypes.array,
  glusterfsInfo: PropTypes.array,
  nfsMounts: PropTypes.array,
  setNfsMountsState: PropTypes.func,
  setGlusterfsMountsState: PropTypes.func,
  glusterfsMounts: PropTypes.array,
  parameters: PropTypes.array,
  setParameters: PropTypes.func,
  xdfsInfo: PropTypes.array,
  xdfsMounts: PropTypes.array,
  setXdfsMountsState: PropTypes.func,
  setErrorMessage: PropTypes.func
}
